import { Router } from 'express';
import { pool } from '../db/pool';
import { authenticate, AuthRequest } from '../middleware/auth-pg';

const router = Router();

// Get user's progress overview
router.get('/overview', authenticate, async (req: AuthRequest, res) => {
  try {
    // Get total and completed time blocks
    const totalResult = await pool.query(
      `SELECT COUNT(*) as total FROM "TimeBlock" tb
       JOIN "Day" d ON tb."dayId" = d.id
       JOIN "Week" w ON d."weekId" = w.id
       JOIN "Month" m ON w."monthId" = m.id
       JOIN "Phase" p ON m."phaseId" = p.id
       WHERE p."userId" = $1`,
      [req.userId]
    );

    const completedResult = await pool.query(
      `SELECT COUNT(*) as completed FROM "TimeBlock" tb
       JOIN "Day" d ON tb."dayId" = d.id
       JOIN "Week" w ON d."weekId" = w.id
       JOIN "Month" m ON w."monthId" = m.id
       JOIN "Phase" p ON m."phaseId" = p.id
       WHERE p."userId" = $1 AND tb.completed = true`,
      [req.userId]
    );

    const totalTimeBlocks = parseInt(totalResult.rows[0].total);
    const completedTimeBlocks = parseInt(completedResult.rows[0].completed);

    // Get progress logs for time tracking
    const progressLogsResult = await pool.query(
      `SELECT * FROM "ProgressLog" WHERE "userId" = $1 ORDER BY date DESC`,
      [req.userId]
    );

    // Calculate total time invested
    const totalMinutes = progressLogsResult.rows.reduce((sum, log) => sum + log.actualDuration, 0);
    const totalHours = Math.round(totalMinutes / 60 * 10) / 10;

    // Get current streak
    const streak = await calculateStreak(req.userId!);

    // Get progress by phase
    const phaseProgressResult = await pool.query(
      `SELECT 
        p.id as "phaseId",
        p.title as "phaseTitle",
        p.number as "phaseNumber",
        COUNT(tb.id) as "totalBlocks",
        COUNT(CASE WHEN tb.completed = true THEN 1 END) as "completedBlocks"
       FROM "Phase" p
       LEFT JOIN "Month" m ON p.id = m."phaseId"
       LEFT JOIN "Week" w ON m.id = w."monthId"
       LEFT JOIN "Day" d ON w.id = d."weekId"
       LEFT JOIN "TimeBlock" tb ON d.id = tb."dayId"
       WHERE p."userId" = $1
       GROUP BY p.id, p.title, p.number
       ORDER BY p.number`,
      [req.userId]
    );

    const phaseStats = phaseProgressResult.rows.map(phase => ({
      phaseId: phase.phaseId,
      phaseTitle: phase.phaseTitle,
      phaseNumber: phase.phaseNumber,
      progress: phase.totalBlocks > 0 ? Math.round(phase.completedBlocks / phase.totalBlocks * 100) : 0,
      totalBlocks: parseInt(phase.totalBlocks),
      completedBlocks: parseInt(phase.completedBlocks)
    }));

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

// Helper function to calculate streak
async function calculateStreak(userId: string): Promise<number> {
  const result = await pool.query(
    `SELECT DISTINCT DATE(date) as log_date 
     FROM "ProgressLog" 
     WHERE "userId" = $1 
     ORDER BY log_date DESC`,
    [userId]
  );

  if (result.rows.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < result.rows.length; i++) {
    const logDate = new Date(result.rows[i].log_date);
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