import React, { useEffect, useState, useContext } from "react";
import { apiFetch, API_BASE } from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Heart, MessageCircle, Trash2, MoreHorizontal } from 'lucide-react';

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
	const [file, setFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [openCommentsFor, setOpenCommentsFor] = useState<number | null>(null);
	const [openProfileFor, setOpenProfileFor] = useState<number | null>(null);
	const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
	const [loadingComments, setLoadingComments] = useState<Record<number, boolean>>({});
	const [postingComment, setPostingComment] = useState<Record<number, boolean>>({});
	const auth = useContext(AuthContext) as any;

	const fetchPosts = async () => {
		setLoading(true);
		try {
			const res: any = await apiFetch('/api/posts');
			const data = Array.isArray(res) ? res : (res.data || []);
			setPosts(data || []);
		} catch (err: any) {
			toast({ title: 'Failed to load feed', description: err?.body?.error || err?.message || 'Unable to fetch posts' });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => { fetchPosts(); }, []);

	const resolveMediaUrl = (url?: string | null) => {
		if (!url) return undefined;
		if (url.startsWith('http://') || url.startsWith('https://')) return url;
		const base = API_BASE || window.location.origin;
		return url.startsWith('/') ? `${base}${url}` : `${base}/${url}`;
	};

	const uploadFile = async (): Promise<string | null> => {
		if (!file) return null;
		setUploading(true);
		try {
			const fd = new FormData();
			fd.append('file', file);
			const uploadUrl = API_BASE ? (API_BASE.endsWith('/') ? `${API_BASE}api/uploads` : `${API_BASE}/api/uploads`) : '/api/uploads';
		const res = await fetch(uploadUrl, { method: 'POST', body: fd });
		let json: any = null;
		try { json = await res.json(); } catch (e) { json = null; }
		console.debug('uploadFile response', { status: res.status, body: json });
		if (!res.ok) {
			const msg = json?.error || (json?.message || 'Upload failed');
			throw new Error(msg);
		}
		// prefer absoluteUrl if provided
		return json?.data?.absoluteUrl || json?.data?.url || (typeof json === 'string' ? json : null);
		} catch (err: any) {
		console.error('uploadFile error', err);
		toast({ title: 'Upload failed', description: err?.message || err?.toString() || 'Unable to upload file' });
			return null;
		} finally {
			setUploading(false);
		}
	};

	// close profile preview when clicking outside
	useEffect(() => {
		const handler = (e: MouseEvent) => {
			const target = e.target as HTMLElement | null;
			if (!target) return setOpenProfileFor(null);
			if (target.closest('[data-avatar]') || target.closest('[data-profile]')) return;
			setOpenProfileFor(null);
		};
		window.addEventListener('click', handler);
		return () => window.removeEventListener('click', handler);
	}, []);

	const createPost = async () => {
		if (!auth?.user) { toast({ title: 'Sign in required', description: 'Please sign in to post.' }); return; }
		if (!content && !mediaUrl) { toast({ title: 'Empty post', description: 'Add text or an image to post.' }); return; }
		if (!content && !mediaUrl && !file) { toast({ title: 'Empty post', description: 'Add text, an image or a video to post.' }); return; }
		setSubmitting(true);
		try {
			const body: any = { content: content || null };
			// if a local file was selected, upload it first and use the returned URL
			if (file) {
				const uploaded = await uploadFile();
				if (uploaded) {
					body.mediaUrl = uploaded;
					body.mediaType = uploaded.match(/\.(mp4|webm|ogg)(\?|#|$)/i) ? 'video' : 'image';
				} else {
					setSubmitting(false);
					return;
				}
			} else if (mediaUrl) {
				body.mediaUrl = mediaUrl;
				body.mediaType = mediaUrl.match(/\.(mp4|webm|ogg)/i) ? 'video' : 'image';
			}
			const created: any = await apiFetch('/api/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
			setPosts((p) => [created || created.data || created, ...p]);
			setContent(''); setMediaUrl(''); setFile(null); setPreviewUrl(null);
			// revoke any preview object URL
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
			setPosts((prev) => prev.map(p => p.id === postId ? { ...p, likes: Array(res.likes).fill(null) } : p));
		} catch (err: any) {
			toast({ title: 'Like failed', description: err?.body?.error || err?.message || 'Unable to like post' });
		}
	};

	const toggleComments = async (postId: number) => {
		if (openCommentsFor === postId) { setOpenCommentsFor(null); return; }
		setOpenCommentsFor(postId);
		// If comments already present do nothing
		const p = posts.find(x => x.id === postId);
		if (p && Array.isArray(p.comments) && p.comments.length > 0) return;
		setLoadingComments((s) => ({ ...s, [postId]: true }));
		try {
			const res: any = await apiFetch(`/api/posts/${postId}/comments`);
			const data = Array.isArray(res) ? res : (res?.data || []);
			setPosts((prev) => prev.map(pp => pp.id === postId ? { ...pp, comments: data } : pp));
		} catch (err: any) {
			toast({ title: 'Failed to load comments', description: err?.body?.error || err?.message || 'Unable to fetch comments' });
		} finally {
			setLoadingComments((s) => ({ ...s, [postId]: false }));
		}
	};

	const postComment = async (postId: number) => {
		const value = (commentInputs[postId] || '').trim();
		if (!auth?.user) { toast({ title: 'Sign in required', description: 'Please sign in to comment.' }); return; }
		if (!value) { toast({ title: 'Empty comment', description: 'Please write something to comment.' }); return; }
		setPostingComment((s) => ({ ...s, [postId]: true }));
		try {
			const created: any = await apiFetch(`/api/posts/${postId}/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: value }) });
			const comment = created || created.data || created;
			setPosts((prev) => prev.map(p => p.id === postId ? { ...p, comments: [comment, ...(p.comments || [])] } : p));
			setCommentInputs((s) => ({ ...s, [postId]: '' }));
			toast({ title: 'Comment posted' });
		} catch (err: any) {
			toast({ title: 'Comment failed', description: err?.body?.error || err?.message || 'Unable to post comment' });
		} finally {
			setPostingComment((s) => ({ ...s, [postId]: false }));
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
				{/* Local file upload */}
				<div className="mt-3">
					<label className="block text-sm font-medium mb-1">Upload image / video</label>
					<input
						type="file"
						accept="image/*,video/*"
						onChange={(e) => {
							const f = e.target.files?.[0] ?? null;
							setFile(f);
							if (f) {
								setMediaUrl('');
								const url = URL.createObjectURL(f);
								setPreviewUrl(url);
							} else {
								setPreviewUrl(null);
							}
						}}
					/>
					{previewUrl && (
						<div className="mt-2">
							{file?.type.startsWith('image/') ? (
								<img src={previewUrl} alt="preview" className="max-h-48 object-cover rounded" />
							) : (
								<div className="text-sm text-muted-foreground">Selected file: {file?.name}</div>
							)}
						</div>
					)}
				</div>
				<div className="flex items-center justify-between mt-3">
					<div className="text-sm text-muted-foreground">{auth?.user ? `Posting as ${auth.user.name || auth.user.email}` : 'Sign in to post'}</div>
					<div className="space-x-2">
						<Button onClick={() => { setContent(''); setMediaUrl(''); setFile(null); setPreviewUrl(null); }} variant="ghost">Clear</Button>
						<Button onClick={createPost} disabled={submitting || uploading} className="bg-primary text-white">{uploading ? 'Uploading...' : submitting ? 'Posting...' : 'Post'}</Button>
					</div>
				</div>
			</div>

			<div className="space-y-6">
				{loading && <div className="text-sm text-muted-foreground">Loading feed...</div>}
				{!loading && posts.map((post) => (
					<div key={post.id} className="rounded-xl border bg-card/80 shadow-sm overflow-hidden">
						{/* header */}
						<div className="flex items-center justify-between p-3">
							<div className="flex items-center space-x-3">
								<div className="relative">
									<button
										data-avatar
										type="button"
										onClick={(e) => { e.stopPropagation(); setOpenProfileFor(prev => prev === post.author.id ? null : post.author.id); }}
										className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-foreground"
									>
										{(post.author?.name || post.author?.email || 'U').charAt(0)}
									</button>

									{openProfileFor === post.author.id && (
										<div data-profile className="absolute left-0 top-full mt-2 w-56 rounded border bg-card p-3 shadow z-10">
											<div className="font-medium text-foreground">{post.author?.name || (post.author?.email || '').split('@')[0]}</div>
											<div className="text-xs text-muted-foreground">{post.author?.email}</div>
											<div className="text-xs text-muted-foreground mt-2">Posted: {new Date(post.createdAt).toLocaleString()}</div>
										</div>
									)}
								</div>
								<div>
									<div className="font-medium text-foreground">{post.author?.name || post.author.email.split('@')[0]}</div>
									<div className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleString()}</div>
								</div>
							</div>
							<MoreHorizontal className="w-5 h-5 text-muted-foreground" />
						</div>

						{/* media */}
						{post.mediaUrl && (
							<div className="w-full bg-black/5 flex items-center justify-center">
								{post.mediaType === 'video' ? (
									<video src={resolveMediaUrl(post.mediaUrl)} controls className="w-full max-h-[520px] object-cover" />
								) : (
									<img src={resolveMediaUrl(post.mediaUrl)} alt="post media" className="w-full max-h-[520px] object-cover" />
								)}
							</div>
						)}

						{/* actions + content */}
						<div className="p-3">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-3">
									<button onClick={() => toggleLike(post.id)} className="flex items-center space-x-2 text-muted-foreground hover:text-red-600">
										<Heart className="w-5 h-5" />
										<span className="text-sm">{post.likes?.length ?? 0}</span>
									</button>
									<button onClick={() => toggleComments(post.id)} className="flex items-center space-x-2 text-muted-foreground hover:text-primary">
										<MessageCircle className="w-5 h-5" />
										<span className="text-sm">{post.comments?.length ?? 0}</span>
									</button>
								</div>
								{(auth?.user?.id === post.author?.id || auth?.user?.role === 'admin') && (
									<button onClick={() => deletePost(post.id)} className="p-2 rounded hover:bg-muted/60">
										<Trash2 className="w-5 h-5 text-destructive" />
									</button>
								)}
							</div>

							{/* comments area (toggle) */}
							{openCommentsFor === post.id && (
								<div className="p-3 border-t bg-background">
									{loadingComments[post.id] ? (
										<div className="text-sm text-muted-foreground">Loading comments...</div>
									) : (
										<>
											{(post.comments || []).length === 0 && (
												<div className="text-sm text-muted-foreground mb-2">No comments yet — be the first!</div>
											)}

											{(post.comments || []).map((c: any) => (
												<div key={c.id || Math.random()} className="flex items-start space-x-3 mb-3">
													<div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-foreground">{(c.author?.name || c.author?.email || 'U').charAt(0)}</div>
													<div>
														<div className="text-sm font-medium">{c.author?.name || (c.author?.email || '').split('@')[0]}</div>
														<div className="text-xs text-muted-foreground">{new Date(c.createdAt || c.created_at || Date.now()).toLocaleString()}</div>
														<div className="mt-1 text-sm text-foreground/90">{c.content}</div>
													</div>
												</div>
											))}

											<div className="mt-2">
												<textarea
													className="w-full p-2 rounded border bg-background border-border focus:border-primary"
													rows={2}
													placeholder="Write a comment..."
													value={commentInputs[post.id] || ''}
													onChange={(e) => setCommentInputs(s => ({ ...s, [post.id]: e.target.value }))}
												/>
												<div className="flex items-center justify-end space-x-2 mt-2">
													<Button variant="ghost" onClick={() => setOpenCommentsFor(null)}>Close</Button>
													<Button onClick={() => postComment(post.id)} disabled={postingComment[post.id]} className="bg-primary text-white">Comment</Button>
												</div>
											</div>
										</>
									)}
								</div>
							)}

							{post.content && <p className="mt-3 text-foreground/90 leading-relaxed">{post.content}</p>}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Events;
