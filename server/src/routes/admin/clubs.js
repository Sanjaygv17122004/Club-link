"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const prisma_1 = require("../../prisma");
const admin_1 = __importDefault(require("../../middleware/admin"));
const sse_1 = require("../../sse");
const router = express_1.default.Router();
// ensure uploads dir exists (server/uploads)
const uploadsDir = path_1.default.resolve(__dirname, '../../../uploads');
if (!fs_1.default.existsSync(uploadsDir))
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname) || '';
        cb(null, `club-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
    }
});
const upload = (0, multer_1.default)({ storage });
router.use(admin_1.default);
// GET /api/admin/clubs
router.get('/', async (req, res) => {
    try {
        const clubs = await prisma_1.prisma.club.findMany({ orderBy: { createdAt: 'desc' } });
        res.json({ data: clubs });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Unable to fetch clubs' });
    }
});
// POST /api/admin/clubs (multipart: optional 'photo')
router.post('/', upload.single('photo'), async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name)
            return res.status(400).json({ error: 'name required' });
        const photo = req.file ? `/uploads/${req.file.filename}` : undefined;
        const club = await prisma_1.prisma.club.create({ data: { name, description: description || '', photoUrl: photo, createdBy: req.user?.id || 0 } });
        res.json({ data: club });
        // broadcast change to SSE clients
        try {
            (0, sse_1.sendAdminEvent)('club.created', club);
        }
        catch (e) {
            console.error(e);
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || 'Unable to create club' });
    }
});
// PATCH /api/admin/clubs/:id
router.patch('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, description } = req.body;
        const club = await prisma_1.prisma.club.update({ where: { id }, data: { name, description } });
        res.json({ data: club });
        try {
            (0, sse_1.sendAdminEvent)('club.updated', club);
        }
        catch (e) {
            console.error(e);
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Unable to update club' });
    }
});
// DELETE /api/admin/clubs/:id
router.delete('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        await prisma_1.prisma.club.delete({ where: { id } });
        res.json({ success: true });
        try {
            (0, sse_1.sendAdminEvent)('club.deleted', { id });
        }
        catch (e) {
            console.error(e);
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Unable to delete club' });
    }
});
exports.default = router;
//# sourceMappingURL=clubs.js.map