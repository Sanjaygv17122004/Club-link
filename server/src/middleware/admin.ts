import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';

/**
 * Verify a JWT string and return the user if valid and an admin.
 * Returns the user object or null if invalid / not admin.
 */
export async function verifyAdminToken(token: string | undefined) {
  if (!token) return null;
  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (!payload?.id) return null;
    const user = await prisma.user.findUnique({ where: { id: Number(payload.id) } });
    if (!user) return null;
    if (user.role !== 'admin') return null;
    return user;
  } catch (e) {
    return null;
  }
}

export default async function requireAdmin(req: Request & { user?: any }, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;
  const user = await verifyAdminToken(token);
  if (!user) return res.status(401).json({ error: 'Admin authentication required' });
  req.user = user;
  next();
}