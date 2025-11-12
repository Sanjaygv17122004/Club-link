import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: 'email already used' });
  const hashed = await bcrypt.hash(password, 10);
  // don't allow creating admin via signup. Only accept 'user' or 'moderator'
  const allowedRoles = ['user', 'moderator'];
  const userRole = allowedRoles.includes(role) ? role : 'user';
  const user = await prisma.user.create({ data: { name: name || email.split('@')[0], email, password: hashed, role: userRole } });
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret');
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret');
  // return role so frontend can route correctly (admin created manually in DB will have role 'admin')
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

// GET /api/auth/me - return authenticated user's profile and simple counts
router.get('/me', requireAuth as any, async (req: any, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    // gather some useful counts
    const postsCount = await prisma.post.count({ where: { authorId: Number(user.id) } });
    const applicationsCount = await prisma.application.count({ where: { userId: Number(user.id) } });

    res.json({ data: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar ?? null, createdAt: user.createdAt, postsCount, applicationsCount } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to fetch profile' });
  }
});

// PATCH /api/auth/me - update profile fields
router.patch('/me', requireAuth as any, async (req: any, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { name, avatar, bio, location, website, skills, notificationPreferences } = req.body;
  const updateData: any = { };
  if (name !== undefined) updateData.name = name;
  if (avatar !== undefined) updateData.avatar = avatar;
  if (bio !== undefined) updateData.bio = bio;
  if (location !== undefined) updateData.location = location;
  if (website !== undefined) updateData.website = website;
  if (skills !== undefined) updateData.skills = skills;
  if (notificationPreferences !== undefined) updateData.notificationPreferences = notificationPreferences;
  const updated = await (prisma.user as any).update({ where: { id: Number(userId) }, data: updateData });
    res.json({ data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to update profile' });
  }
});

// POST /api/auth/me/password - change password
router.post('/me/password', requireAuth as any, async (req: any, res) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'currentPassword and newPassword required' });
    const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(400).json({ error: 'Current password is incorrect' });
    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: Number(userId) }, data: { password: hashed } });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to change password' });
  }
});

export default router;
