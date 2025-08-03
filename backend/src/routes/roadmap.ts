import { Router } from 'express';
import { prisma } from '../index';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get user's complete roadmap
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const roadmap = await prisma.phase.findMany({
      where: { userId: req.userId! },
      orderBy: { number: 'asc' },
      include: {
        months: {
          orderBy: { number: 'asc' },
          include: {
            weeks: {
              orderBy: { number: 'asc' },
              include: {
                days: {
                  orderBy: { dayIndex: 'asc' },
                  include: {
                    timeBlocks: {
                      orderBy: { order: 'asc' }
                    }
                  }
                }
              }
            },
            resources: true
          }
        }
      }
    });

    return res.json({ success: true, data: roadmap });
  } catch (error) {
    console.error('Get roadmap error:', error);
    return res.status(500).json({ error: 'Failed to fetch roadmap' });
  }
});

// Get specific phase
router.get('/phase/:phaseId', authenticate, async (req: AuthRequest, res) => {
  try {
    const phase = await prisma.phase.findFirst({
      where: {
        id: req.params.phaseId,
        userId: req.userId!
      },
      include: {
        months: {
          orderBy: { number: 'asc' },
          include: {
            weeks: {
              orderBy: { number: 'asc' },
              include: {
                days: {
                  orderBy: { dayIndex: 'asc' },
                  include: {
                    timeBlocks: {
                      orderBy: { order: 'asc' }
                    }
                  }
                }
              }
            },
            resources: true
          }
        }
      }
    });

    if (!phase) {
      return res.status(404).json({ error: 'Phase not found' });
    }

    return res.json({ success: true, data: phase });
  } catch (error) {
    console.error('Get phase error:', error);
    return res.status(500).json({ error: 'Failed to fetch phase' });
  }
});

// Update time block completion status
router.patch('/timeblock/:timeBlockId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { completed } = req.body;

    // Verify the time block belongs to the user
    const timeBlock = await prisma.timeBlock.findFirst({
      where: {
        id: req.params.timeBlockId,
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

    // Update the time block
    const updated = await prisma.timeBlock.update({
      where: { id: req.params.timeBlockId },
      data: { completed }
    });

    // If marking as completed, create a progress log
    if (completed && !timeBlock.completed) {
      await prisma.progressLog.create({
        data: {
          userId: req.userId!,
          timeBlockId: updated.id,
          actualDuration: 0, // User can update this later
          date: new Date()
        }
      });
    }

    return res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update time block error:', error);
    return res.status(500).json({ error: 'Failed to update time block' });
  }
});

// Update resource status
router.patch('/resource/:resourceId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { status, notes } = req.body;

    // Verify the resource belongs to the user
    const resource = await prisma.resource.findFirst({
      where: {
        id: req.params.resourceId,
        month: {
          phase: {
            userId: req.userId!
          }
        }
      }
    });

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Update the resource
    const updated = await prisma.resource.update({
      where: { id: req.params.resourceId },
      data: { status, notes }
    });

    return res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update resource error:', error);
    return res.status(500).json({ error: 'Failed to update resource' });
  }
});

export default router;