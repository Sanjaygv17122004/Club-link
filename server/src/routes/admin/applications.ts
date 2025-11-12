import express from 'express';
import { prisma } from '../../prisma';
import requireAdmin from '../../middleware/admin';
import { sendAdminEvent } from '../../sse';

const router = express.Router();

router.use(requireAdmin);

// GET /api/admin/applications - list all applications
router.get('/', async (req, res) => {
  try {
    const apps = await prisma.application.findMany({ orderBy: { createdAt: 'desc' }, include: { user: true, club: true } });
    res.json({ data: apps });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to fetch applications' });
  }
});

// PATCH /api/admin/applications/:id - update application status (approve/reject)
router.patch('/:id', async (req: any, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const updated = await prisma.application.update({ where: { id }, data: { status } , include: { user: true, club: true } });
    res.json({ data: updated });
    try { sendAdminEvent('application.updated', updated); } catch (e) { console.error(e); }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Unable to update application' });
  }
});

export default router;
