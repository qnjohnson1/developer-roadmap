import { Router } from 'express';
import { pool } from '../db/pool';
import { authenticate, AuthRequest } from '../middleware/auth-pg';

const router = Router();

// Get user's complete roadmap
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    // Get all phases for the user
    const phasesResult = await pool.query(
      `SELECT * FROM "Phase" WHERE "userId" = $1 ORDER BY number`,
      [req.userId]
    );

    const phases = [];

    for (const phase of phasesResult.rows) {
      // Get months for each phase
      const monthsResult = await pool.query(
        `SELECT * FROM "Month" WHERE "phaseId" = $1 ORDER BY number`,
        [phase.id]
      );

      const months = [];

      for (const month of monthsResult.rows) {
        // Get resources for each month
        const resourcesResult = await pool.query(
          `SELECT * FROM "Resource" WHERE "monthId" = $1`,
          [month.id]
        );

        // Get weeks for each month
        const weeksResult = await pool.query(
          `SELECT * FROM "Week" WHERE "monthId" = $1 ORDER BY number`,
          [month.id]
        );

        const weeks = [];

        for (const week of weeksResult.rows) {
          // Get days for each week
          const daysResult = await pool.query(
            `SELECT * FROM "Day" WHERE "weekId" = $1 ORDER BY "dayIndex"`,
            [week.id]
          );

          const days = [];

          for (const day of daysResult.rows) {
            // Get time blocks for each day
            const timeBlocksResult = await pool.query(
              `SELECT * FROM "TimeBlock" WHERE "dayId" = $1 ORDER BY "order"`,
              [day.id]
            );

            days.push({
              ...day,
              timeBlocks: timeBlocksResult.rows
            });
          }

          weeks.push({
            ...week,
            days
          });
        }

        months.push({
          ...month,
          resources: resourcesResult.rows,
          weeks
        });
      }

      phases.push({
        ...phase,
        months
      });
    }

    res.json({ success: true, data: phases });
  } catch (error) {
    console.error('Get roadmap error:', error);
    res.status(500).json({ error: 'Failed to fetch roadmap' });
  }
});

// Update time block completion status
router.patch('/timeblock/:timeBlockId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { completed } = req.body;

    // Verify the time block belongs to the user
    const checkResult = await pool.query(
      `SELECT tb.* FROM "TimeBlock" tb
       JOIN "Day" d ON tb."dayId" = d.id
       JOIN "Week" w ON d."weekId" = w.id
       JOIN "Month" m ON w."monthId" = m.id
       JOIN "Phase" p ON m."phaseId" = p.id
       WHERE tb.id = $1 AND p."userId" = $2`,
      [req.params.timeBlockId, req.userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Time block not found' });
    }

    const timeBlock = checkResult.rows[0];

    // Update the time block
    const updateResult = await pool.query(
      `UPDATE "TimeBlock" SET completed = $1, "updatedAt" = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [completed, req.params.timeBlockId]
    );

    // If marking as completed, create a progress log
    if (completed && !timeBlock.completed) {
      await pool.query(
        `INSERT INTO "ProgressLog" ("userId", "timeBlockId", "actualDuration", date) 
         VALUES ($1, $2, $3, $4)`,
        [req.userId, req.params.timeBlockId, 0, new Date()]
      );
    }

    res.json({ success: true, data: updateResult.rows[0] });
  } catch (error) {
    console.error('Update time block error:', error);
    res.status(500).json({ error: 'Failed to update time block' });
  }
});

// Update resource status
router.patch('/resource/:resourceId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { status, notes } = req.body;

    // Verify the resource belongs to the user
    const checkResult = await pool.query(
      `SELECT r.* FROM "Resource" r
       JOIN "Month" m ON r."monthId" = m.id
       JOIN "Phase" p ON m."phaseId" = p.id
       WHERE r.id = $1 AND p."userId" = $2`,
      [req.params.resourceId, req.userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Update the resource
    const updateResult = await pool.query(
      `UPDATE "Resource" 
       SET status = COALESCE($1, status), 
           notes = COALESCE($2, notes),
           "updatedAt" = CURRENT_TIMESTAMP
       WHERE id = $3 
       RETURNING *`,
      [status, notes, req.params.resourceId]
    );

    res.json({ success: true, data: updateResult.rows[0] });
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({ error: 'Failed to update resource' });
  }
});

export default router;