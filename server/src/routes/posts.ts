import express from 'express';
import { prisma } from '../prisma';
import { requireAuth } from '../middleware/auth';
import { sendAdminEvent } from '../sse';

const router = express.Router();

// list posts
router.get('/', async (req, res) => {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      likes: true,
      comments: { include: { author: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(posts);
});

// create post (protected)
router.post('/', requireAuth, async (req: any, res) => {
  try {
    const { content, mediaUrl, mediaType } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const post = await prisma.post.create({ data: { authorId: userId, content, mediaUrl, mediaType }, include: { author: true, likes: true, comments: true } });
    res.json(post);
    try { sendAdminEvent('post.created', post); } catch (e) { console.error(e); }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to create post' });
  }
});

// add comment to a post
router.post('/:id/comments', requireAuth, async (req: any, res) => {
  try {
    const postId = Number(req.params.id);
    const userId = req.user?.id;
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'content required' });
    const comment = await prisma.comment.create({ data: { postId, authorId: userId, content }, include: { author: true } });
    res.json(comment);
    try { sendAdminEvent('comment.created', { postId, comment }); } catch (e) { console.error(e); }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to add comment' });
  }
});

// toggle like for a post
router.post('/:id/like', requireAuth, async (req: any, res) => {
  try {
    const postId = Number(req.params.id);
    const userId = req.user?.id;
    // check existing
    const existing = await prisma.like.findFirst({ where: { postId, userId } });
    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      const likesCount = await prisma.like.count({ where: { postId } });
      res.json({ liked: false, likes: likesCount });
      try { sendAdminEvent('post.unliked', { postId, userId }); } catch (e) { console.error(e); }
      return;
    }
    const like = await prisma.like.create({ data: { postId, userId } });
    const likesCount = await prisma.like.count({ where: { postId } });
    res.json({ liked: true, likes: likesCount });
    try { sendAdminEvent('post.liked', { postId, userId }); } catch (e) { console.error(e); }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to toggle like' });
  }
});

// delete a post (author or admin can delete)
router.delete('/:id', requireAuth, async (req: any, res) => {
  try {
    const postId = Number(req.params.id);
    const userId = Number(req.user?.id);
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    // allow deletion if author or admin
    const isAuthor = post.authorId === userId;
    const isAdmin = req.user?.role === 'admin';
    if (!isAuthor && !isAdmin) return res.status(403).json({ error: 'Forbidden' });

    // delete dependent records first
    await prisma.comment.deleteMany({ where: { postId } });
    await prisma.like.deleteMany({ where: { postId } });
    await prisma.post.delete({ where: { id: postId } });

    res.json({ ok: true });
    try { sendAdminEvent('post.deleted', { postId }); } catch (e) { console.error(e); }
  } catch (err) {
    console.error('delete post error', err);
    res.status(500).json({ error: 'Unable to delete post' });
  }
});

export default router;

