import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import postsRoutes from './routes/posts';
import adminClubs from './routes/admin/clubs';
import adminUsers from './routes/admin/users';
import adminApplications from './routes/admin/applications';
import applicationsRoutes from './routes/applications';
import uploadsRoutes from './routes/uploads';
import { prisma } from './prisma';
import { addClient, removeClient } from './sse';
import { verifyAdminToken } from './middleware/admin';
import { requireAuth } from './middleware/auth';
import { sendAdminEvent } from './sse';
import { verifyToken } from './middleware/auth';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple request logger to make incoming requests visible in server logs
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/admin/clubs', adminClubs);
app.use('/api/admin/users', adminUsers);
app.use('/api/admin/applications', adminApplications);
app.use('/api/applications', applicationsRoutes);
app.use('/api/uploads', uploadsRoutes);

// serve uploaded files
app.use('/uploads', express.static(path.resolve(__dirname, '..', '..', 'uploads')));

app.get('/health', (req, res) => res.json({ ok: true }));

// SSE endpoint for admin clients to receive server-sent events
app.get('/api/admin/stream', async (req, res) => {
  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // authenticate via token in query string (EventSource can't set headers)
  const token = typeof req.query.token === 'string' ? req.query.token : undefined;
  const user = await verifyAdminToken(token);
  if (!user) {
    // write a comment and close connection politely
    res.write(`event: error\ndata: ${JSON.stringify({ error: 'Unauthorized' })}\n\n`);
    res.end();
    return;
  }

  const id = addClient(res);
  // heartbeat to keep proxies/connections alive
  const heartbeat = setInterval(() => {
    try { res.write(':keep-alive\n\n'); } catch (e) { /* ignore */ }
  }, 15000);
  console.log('SSE admin client connected', { id, user: { id: user.id, email: user.email } });
  req.on('close', () => {
    removeClient(id);
    clearInterval(heartbeat);
  });
});

// public stream for authenticated users (non-admin)
app.get('/api/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const token = typeof req.query.token === 'string' ? req.query.token : undefined;
  const user = await verifyToken(token);
  if (!user) {
    res.write(`event: error\ndata: ${JSON.stringify({ error: 'Unauthorized' })}\n\n`);
    res.end();
    return;
  }

  const id = addClient(res);
  const heartbeat = setInterval(() => {
    try { res.write(':keep-alive\n\n'); } catch (e) { /* ignore */ }
  }, 15000);
  console.log('SSE client connected', { id, user: { id: user.id, email: user.email, role: user.role } });
  req.on('close', () => { clearInterval(heartbeat); removeClient(id); });
});

// public endpoints for clubs and events for dashboards
app.get('/api/clubs', async (req, res) => {
  try {
    const clubs = await prisma.club.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ data: clubs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to fetch clubs' });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const events = await prisma.event.findMany({ orderBy: { date: 'desc' } });
    res.json({ data: events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to fetch events' });
  }
});

// GET /api/clubs/:id - return club with events and approved members
app.get('/api/clubs/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const club = await prisma.club.findUnique({ where: { id }, include: { events: { orderBy: { date: 'desc' } } } });
    if (!club) return res.status(404).json({ error: 'Club not found' });
    const members = await prisma.application.findMany({ where: { clubId: id, status: 'approved' }, include: { user: true } });
    res.json({ data: { club, members } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to fetch club' });
  }
});

// Create event (authenticated users)
app.post('/api/events', requireAuth, async (req: any, res) => {
  try {
    const { title, description, date, location, clubId, mediaUrl } = req.body;
    if (!title || !date || !clubId) return res.status(400).json({ error: 'title, date and clubId required' });
    const parsedDate = new Date(date);
    const created = await prisma.event.create({ data: { title, description: description || '', date: parsedDate, location: location || null, clubId: Number(clubId) } });

    // After creating an event, also create a feed post so it shows in Events feed
    try {
      const postData: any = {
        authorId: Number(req.user?.id),
        content: `${title}${description ? ' — ' + String(description) : ''}`,
      };
      if (mediaUrl && typeof mediaUrl === 'string') {
        postData.mediaUrl = mediaUrl;
        // naive media type detection based on extension
        const lower = mediaUrl.toLowerCase();
        postData.mediaType = lower.match(/\.(mp4|webm|ogg)(\?|#|$)/) ? 'video' : 'image';
      }
      const createdPost = await prisma.post.create({ data: postData, include: { author: true, likes: true, comments: true } });
      // emit both event and post events for live refreshers
      try { sendAdminEvent('post.created', createdPost); } catch (e) { console.error(e); }
    } catch (e) {
      console.warn('Failed to create post for event', e);
    }

    res.json({ data: created });
    try { sendAdminEvent('event.created', created); } catch (e) { console.error(e); }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to create event' });
  }
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
