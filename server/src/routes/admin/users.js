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
// GET /api/admin/users
router.get('/', async (req, res) => {
    try {
        const users = await prisma_1.prisma.user.findMany({ orderBy: { createdAt: 'desc' }, select: { id: true, name: true, email: true, role: true, createdAt: true } });
        res.json({ data: users });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Unable to fetch users' });
    }
});
// PATCH /api/admin/users/:id (e.g., change role or block/unblock)
router.patch('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { role } = req.body;
        const updated = await prisma_1.prisma.user.update({ where: { id }, data: { role } });
        res.json({ data: { id: updated.id, name: updated.name, email: updated.email, role: updated.role } });
        try {
            (0, sse_1.sendAdminEvent)('user.updated', { id: updated.id, role: updated.role });
        }
        catch (e) {
            console.error(e);
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Unable to update user' });
    }
});
// DELETE /api/admin/users/:id
router.delete('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        await prisma_1.prisma.user.delete({ where: { id } });
        res.json({ success: true });
        try {
            (0, sse_1.sendAdminEvent)('user.deleted', { id });
        }
        catch (e) {
            console.error(e);
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Unable to delete user' });
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map