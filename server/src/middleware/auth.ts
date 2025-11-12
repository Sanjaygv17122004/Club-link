import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';

interface AuthRequest extends Request {
  user?: any;
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];
  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    // load fresh user from db
    const user = await prisma.user.findUnique({ where: { id: Number(payload.id) } });
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

/**
 * Verify token string and return user object or null.
 */
export async function verifyToken(token?: string) {
  if (!token) return null;
  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (!payload?.id) return null;
    const user = await prisma.user.findUnique({ where: { id: Number(payload.id) } });
    return user ?? null;
  } catch (err) {
    return null;
  }
}
