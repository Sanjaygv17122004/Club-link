import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.resolve(__dirname, '..', '..', 'uploads')),
  filename: (req, file, cb) => {
    const safe = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.\-]/g, '_')}`;
    cb(null, safe);
  },
});

const upload = multer({ storage });

// POST /api/uploads - upload a file and return a public URL
router.post('/', upload.single('file'), async (req: any, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'file required' });
    // Build an absolute URL so clients can use it directly in <img src>
    const host = req.get('host');
    const proto = req.protocol;
    const pathname = `/uploads/${req.file.filename}`;
    const absolute = `${proto}://${host}${pathname}`;
    // also return the relative path for compatibility
    res.json({ data: { url: pathname, absoluteUrl: absolute } });
  } catch (err) {
    console.error('upload error', err);
    res.status(500).json({ error: 'Unable to upload' });
  }
});

export default router;
