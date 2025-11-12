import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { prisma } from '../../prisma';
import requireAdmin from '../../middleware/admin';
import { sendAdminEvent } from '../../sse';

const router = express.Router();

// ensure uploads dir exists (server/uploads)
const uploadsDir = path.resolve(__dirname, '../../../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    cb(null, `club-${Date.now()}-${Math.round(Math.random()*1e6)}${ext}`);
  }
});

const upload = multer({ storage });

router.use(requireAdmin);

// GET /api/admin/clubs
router.get('/', async (req, res) => {
  try {
    const clubs = await prisma.club.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ data: clubs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to fetch clubs' });
  }
});

// POST /api/admin/clubs (multipart: optional 'photo')
router.post('/', upload.single('photo'), async (req: any, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });

    const photo = req.file ? `/uploads/${req.file.filename}` : undefined;
    const club = await prisma.club.create({ data: { name, description: description || '', photoUrl: photo, createdBy: req.user?.id || 0 } });
    res.json({ data: club });
    // broadcast change to SSE clients
    try { sendAdminEvent('club.created', club); } catch (e) { console.error(e); }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Unable to create club' });
  }
});

// PATCH /api/admin/clubs/:id
router.patch('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, description } = req.body;
    const club = await prisma.club.update({ where: { id }, data: { name, description } });
    res.json({ data: club });
    try { sendAdminEvent('club.updated', club); } catch (e) { console.error(e); }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to update club' });
  }
});

// DELETE /api/admin/clubs/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid id' });

    // fetch club for cleanup (photoUrl)
    const club = await prisma.club.findUnique({ where: { id } });
    if (!club) return res.status(404).json({ error: 'club not found' });

    // delete dependents first to avoid FK constraint errors
    await prisma.$transaction([
      prisma.application.deleteMany({ where: { clubId: id } }),
      prisma.event.deleteMany({ where: { clubId: id } }),
      prisma.club.delete({ where: { id } }),
    ]);

    // best-effort remove uploaded photo file if stored locally
    if (club.photoUrl && club.photoUrl.startsWith('/uploads/')) {
      const filePath = path.join(uploadsDir, path.basename(club.photoUrl));
      fs.promises.unlink(filePath).catch(() => {});
    }

    res.json({ success: true });
    try { sendAdminEvent('club.deleted', { id }); } catch (e) { console.error(e); }
  } catch (err: any) {
    console.error('DELETE /api/admin/clubs/:id', err);
    if (err?.code === 'P2003') {
      return res.status(409).json({ error: 'Club has related records (events/applications); remove them first' });
    }
    res.status(500).json({ error: 'Unable to delete club' });
  }
});

export default router;
