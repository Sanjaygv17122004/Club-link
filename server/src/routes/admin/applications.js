"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../../prisma");
const admin_1 = __importDefault(require("../../middleware/admin"));
const sse_1 = require("../../sse");
const router = express_1.default.Router();
router.use(admin_1.default);
// GET /api/admin/applications - list all applications
router.get('/', async (req, res) => {
    try {
        const apps = await prisma_1.prisma.application.findMany({ orderBy: { createdAt: 'desc' }, include: { user: true, club: true } });
        res.json({ data: apps });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Unable to fetch applications' });
    }
});
// PATCH /api/admin/applications/:id - update application status (approve/reject)
router.patch('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;
        if (!['pending', 'approved', 'rejected'].includes(status))
            return res.status(400).json({ error: 'Invalid status' });
        const updated = await prisma_1.prisma.application.update({ where: { id }, data: { status }, include: { user: true, club: true } });
        res.json({ data: updated });
        try {
            (0, sse_1.sendAdminEvent)('application.updated', updated);
        }
        catch (e) {
            console.error(e);
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || 'Unable to update application' });
    }
});
exports.default = router;
//# sourceMappingURL=applications.js.map