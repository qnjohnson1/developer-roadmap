import { Router } from 'express';
import { prisma } from '../index';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get notes for a specific entity
router.get('/:entityType/:entityId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { entityType, entityId } = req.params;

    const notes = await prisma.note.findMany({
      where: {
        userId: req.userId!,
        entityType,
        entityId
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: notes });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// Create a note
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { entityType, entityId, content } = req.body;

    const note = await prisma.note.create({
      data: {
        userId: req.userId!,
        entityType,
        entityId,
        content
      }
    });

    res.json({ success: true, data: note });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Update a note
router.put('/:noteId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { content } = req.body;

    // Verify the note belongs to the user
    const note = await prisma.note.findFirst({
      where: {
        id: req.params.noteId,
        userId: req.userId!
      }
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const updated = await prisma.note.update({
      where: { id: req.params.noteId },
      data: { content }
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// Delete a note
router.delete('/:noteId', authenticate, async (req: AuthRequest, res) => {
  try {
    // Verify the note belongs to the user
    const note = await prisma.note.findFirst({
      where: {
        id: req.params.noteId,
        userId: req.userId!
      }
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    await prisma.note.delete({
      where: { id: req.params.noteId }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

export default router;