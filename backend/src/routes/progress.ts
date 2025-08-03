import { Router } from 'express';
import { prisma } from '../index';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get user's progress overview
router.get('/overview', authenticate, async (req: AuthRequest, res) => {
  try {
    // Get total and completed time blocks
    const totalTimeBlocks = await prisma.timeBlock.count({
      where: {
        day: {
          week: {
            month: {
              phase: {
                userId: req.userId!
              }
            }
          }
        }
      }
    });

    const completedTimeBlocks = await prisma.timeBlock.count({
      where: {
        completed: true,
        day: {
          week: {
            month: {
              phase: {
                userId: req.userId!
              }
            }
          }
        }
      }
    });

    // Get progress logs for time tracking
    const progressLogs = await prisma.progressLog.findMany({
      where: { userId: req.userId! },
      orderBy: { date: 'desc' }
    });

    // Calculate total time invested
    const totalMinutes = progressLogs.reduce((sum, log) => sum + log.actualDuration, 0);
    const totalHours = Math.round(totalMinutes / 60 * 10) / 10;

    // Get current streak
    const streak = await calculateStreak(req.userId!);

    // Get progress by phase
    const phaseProgress = await prisma.phase.findMany({
      where: { userId: req.userId! },
      select: {
        id: true,
        title: true,
        number: true,
        months: {
          select: {
            id: true,
            weeks: {
              select: {
                id: true,
                days: {
                  select: {
                    id: true,
                    timeBlocks: {
                      select: {
                        id: true,
                        completed: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const phaseStats = phaseProgress.map(phase => {
      let total = 0;
      let completed = 0;

      phase.months.forEach(month => {
        month.weeks.forEach(week => {
          week.days.forEach(day => {
            total += day.timeBlocks.length;
            completed += day.timeBlocks.filter(tb => tb.completed).length;
          });
        });
      });

      return {
        phaseId: phase.id,
        phaseTitle: phase.title,
        phaseNumber: phase.number,
        progress: total > 0 ? Math.round(completed / total * 100) : 0,
        totalBlocks: total,
        completedBlocks: completed
      };
    });

    return res.json({
      success: true,
      data: {
        totalTimeBlocks,
        completedTimeBlocks,
        overallProgress: totalTimeBlocks > 0 ? Math.round(completedTimeBlocks / totalTimeBlocks * 100) : 0,
        totalHoursInvested: totalHours,
        currentStreak: streak,
        phaseProgress: phaseStats
      }
    });
  } catch (error) {
    console.error('Get progress overview error:', error);
    return res.status(500).json({ error: 'Failed to fetch progress overview' });
  }
});

// Get progress logs
router.get('/logs', authenticate, async (req: AuthRequest, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const logs = await prisma.progressLog.findMany({
      where: { userId: req.userId! },
      orderBy: { date: 'desc' },
      take: Number(limit),
      skip: Number(offset),
      include: {
        timeBlock: {
          include: {
            day: true
          }
        }
      }
    });

    const total = await prisma.progressLog.count({
      where: { userId: req.userId! }
    });

    return res.json({
      success: true,
      data: {
        logs,
        total,
        limit: Number(limit),
        offset: Number(offset)
      }
    });
  } catch (error) {
    console.error('Get progress logs error:', error);
    return res.status(500).json({ error: 'Failed to fetch progress logs' });
  }
});

// Create or update progress log
router.post('/log', authenticate, async (req: AuthRequest, res) => {
  try {
    const { timeBlockId, actualDuration, notes } = req.body;

    // Verify the time block belongs to the user
    const timeBlock = await prisma.timeBlock.findFirst({
      where: {
        id: timeBlockId,
        day: {
          week: {
            month: {
              phase: {
                userId: req.userId!
              }
            }
          }
        }
      }
    });

    if (!timeBlock) {
      return res.status(404).json({ error: 'Time block not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if log already exists for today
    const existingLog = await prisma.progressLog.findFirst({
      where: {
        userId: req.userId!,
        timeBlockId,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    });

    let log;
    if (existingLog) {
      // Update existing log
      log = await prisma.progressLog.update({
        where: { id: existingLog.id },
        data: { actualDuration, notes }
      });
    } else {
      // Create new log
      log = await prisma.progressLog.create({
        data: {
          userId: req.userId!,
          timeBlockId,
          actualDuration,
          notes,
          date: new Date()
        }
      });
    }

    return res.json({ success: true, data: log });
  } catch (error) {
    console.error('Create/update progress log error:', error);
    return res.status(500).json({ error: 'Failed to save progress log' });
  }
});

// Helper function to calculate streak
async function calculateStreak(userId: string): Promise<number> {
  const logs = await prisma.progressLog.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    distinct: ['date']
  });

  if (logs.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < logs.length; i++) {
    const logDate = new Date(logs[i].date);
    logDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);

    if (logDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export default router;