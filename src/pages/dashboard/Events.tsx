import React, { useEffect, useState, useContext } from "react";
import { apiFetch } from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type Post = {
	id: number;
	content: string | null;
	mediaUrl?: string | null;
	mediaType?: string | null;
	createdAt: string;
	author: { id: number; name?: string | null; email: string };
	likes?: any[];
	comments?: any[];
};

const Events = () => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(false);
	const [content, setContent] = useState('');
	const [mediaUrl, setMediaUrl] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const auth = useContext(AuthContext) as any;

	const fetchPosts = async () => {
		setLoading(true);
		try {
			const res: any = await apiFetch('/api/posts');
			// server returns an array for /api/posts
			const data = Array.isArray(res) ? res : (res.data || []);
			setPosts(data || []);
		} catch (err: any) {
			toast({ title: 'Failed to load feed', description: err?.body?.error || err?.message || 'Unable to fetch posts' });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => { fetchPosts(); }, []);

	const createPost = async () => {
		if (!auth?.user) { toast({ title: 'Sign in required', description: 'Please sign in to post.' }); return; }
		if (!content && !mediaUrl) { toast({ title: 'Empty post', description: 'Add text or an image to post.' }); return; }
		setSubmitting(true);
		try {
			const body: any = { content: content || null };
			if (mediaUrl) { body.mediaUrl = mediaUrl; body.mediaType = mediaUrl.match(/\.(mp4|webm|ogg)/i) ? 'video' : 'image'; }
			const created: any = await apiFetch('/api/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
			// server returns the created post object
			setPosts((p) => [created || created.data || created, ...p]);
			setContent(''); setMediaUrl('');
			toast({ title: 'Posted', description: 'Your post is live.' });
		} catch (err: any) {
			toast({ title: 'Post failed', description: err?.body?.error || err?.message || 'Unable to create post' });
		} finally { setSubmitting(false); }
	};

	const deletePost = async (id: number) => {
		try {
			await apiFetch(`/api/posts/${id}`, { method: 'DELETE' });
			setPosts((p) => p.filter(x => x.id !== id));
			toast({ title: 'Deleted', description: 'Post removed.' });
		} catch (err: any) {
			toast({ title: 'Delete failed', description: err?.body?.error || err?.message || 'Unable to delete post' });
		}
	};

	const toggleLike = async (postId: number) => {
		try {
			const res: any = await apiFetch(`/api/posts/${postId}/like`, { method: 'POST' });
			// update likes count locally (res.likes)
			setPosts((prev) => prev.map(p => p.id === postId ? { ...p, likes: Array(res.likes).fill(null) } : p));
		} catch (err: any) {
			toast({ title: 'Like failed', description: err?.body?.error || err?.message || 'Unable to like post' });
		}
	};

	return (
		<div className="max-w-2xl mx-auto py-6 px-4">
			<h1 className="text-2xl sm:text-3xl font-orbitron font-bold mb-4 text-center">Club Feed</h1>

			<div className="rounded-lg border bg-card p-4 mb-6">
				<textarea
					className="w-full p-3 rounded border bg-background border-border focus:border-primary"
					placeholder="Share something about your club..."
					value={content}
					onChange={(e) => setContent(e.target.value)}
					rows={3}
				/>
				<input
					className="mt-3 w-full p-2 rounded border bg-background border-border"
					placeholder="Optional image/video URL"
					value={mediaUrl}
					onChange={(e) => setMediaUrl(e.target.value)}
				/>
				<div className="flex items-center justify-between mt-3">
					<div className="text-sm text-muted-foreground">{auth?.user ? `Posting as ${auth.user.name || auth.user.email}` : 'Sign in to post'}</div>
					<div className="space-x-2">
						<Button onClick={() => { setContent(''); setMediaUrl(''); }} variant="ghost">Clear</Button>
						<Button onClick={createPost} disabled={submitting} className="bg-primary text-white">Post</Button>
					</div>
				</div>
			</div>

			<div className="space-y-6">
				{loading && <div className="text-sm text-muted-foreground">Loading feed...</div>}
				{!loading && posts.map((post) => (
					<div key={post.id} className="rounded-xl border bg-card shadow-sm overflow-hidden">
						{post.mediaUrl && (
							<div className="w-full h-72 bg-black/5">
								{post.mediaType === 'video' ? (
									<video src={post.mediaUrl || undefined} controls className="w-full h-72 object-cover" />
								) : (
									<img src={post.mediaUrl || undefined} alt="post media" className="w-full h-72 object-cover" />
								)}
							</div>
						)}
						<div className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<div className="font-medium">{post.author?.name || post.author.email.split('@')[0]}</div>
									<div className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleString()}</div>
								</div>
								<div className="flex items-center space-x-2">
									<button onClick={() => toggleLike(post.id)} className="text-sm px-2 py-1 rounded bg-card border">Like ({post.likes?.length ?? 0})</button>
									{(auth?.user?.id === post.author?.id || auth?.user?.role === 'admin') && (
										<button onClick={() => deletePost(post.id)} className="text-sm px-2 py-1 rounded bg-destructive text-white">Delete</button>
									)}
								</div>
							</div>
							{post.content && <p className="mt-3 text-foreground/90">{post.content}</p>}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Events;
