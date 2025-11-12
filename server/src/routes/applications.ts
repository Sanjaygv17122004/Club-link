import express from 'express';
import { prisma } from '../prisma';
import { requireAuth } from '../middleware/auth';
import { sendAdminEvent } from '../sse';

const router = express.Router();

// require auth for all application routes
router.use(requireAuth as any);

// GET /api/applications - return applications for current user
router.get('/', async (req: any, res) => {
  try {
    const userId = req.user?.id;
    const apps = await prisma.application.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, include: { club: true } });
    res.json({ data: apps });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to fetch applications' });
  }
});

// POST /api/applications - apply to join a club
router.post('/', async (req: any, res) => {
  try {
    const userId = req.user?.id;
    const { clubId } = req.body;
    if (!clubId) return res.status(400).json({ error: 'clubId required' });

    // prevent duplicate application
    const existing = await prisma.application.findFirst({ where: { userId, clubId: Number(clubId) } });
    if (existing) return res.status(400).json({ error: 'Already applied' });

    const created = await prisma.application.create({ data: { userId: Number(userId), clubId: Number(clubId), status: 'pending' } });
    res.json({ data: created });
    try { sendAdminEvent('application.created', created); } catch (e) { console.error(e); }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to create application' });
  }
});

// DELETE /api/applications/:id - withdraw an application (owner only)
router.delete('/:id', async (req: any, res) => {
  try {
    const userId = req.user?.id;
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });

    const app = await prisma.application.findUnique({ where: { id } });
    if (!app) return res.status(404).json({ error: 'Application not found' });
    if (app.userId !== Number(userId)) return res.status(403).json({ error: 'Not allowed' });

    const deleted = await prisma.application.delete({ where: { id } });
    res.json({ data: deleted });
    try { sendAdminEvent('application.deleted', deleted); } catch (e) { console.error(e); }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to withdraw application' });
  }
});

export default router;
