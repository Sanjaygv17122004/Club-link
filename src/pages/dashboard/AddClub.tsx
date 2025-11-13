import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { apiFetch } from '@/lib/api';

const AddClub: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // only allow admins to access this page
  if (!auth?.user || auth.user.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto py-12">
        <h2 className="text-2xl font-semibold">Access denied</h2>
        <p className="text-muted-foreground mt-2">You must be an admin to create clubs.</p>
      </div>
    );
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setPhoto(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError('Club name is required');
    setLoading(true);
    try {
      const form = new FormData();
      form.append('name', name.trim());
      form.append('description', description.trim());
      // include category as metadata (server ignores, but useful)
      form.append('category', category);
      if (photo) form.append('photo', photo);

      const res: any = await apiFetch('/api/admin/clubs', { method: 'POST', body: form });
      setSuccess('Club created successfully');
      // navigate to admin dashboard or club page
      setTimeout(() => {
        navigate('/dashboard/admin');
      }, 900);
    } catch (err: any) {
      setError(err?.body?.error || err?.message || 'Failed to create club');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto py-8">
      <h1 className="text-3xl font-orbitron font-bold">Add Club</h1>
      <p className="text-muted-foreground">Create new clubs and set up their configurations.</p>

      <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 space-y-4 shadow-sm">
        {error && <div className="text-destructive text-sm">{error}</div>}
        {success && <div className="text-primary text-sm">{success}</div>}

        <div>
          <label className="block text-sm font-medium mb-1">Club Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border px-3 py-2 bg-background"
            placeholder="Enter club name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border px-3 py-2 bg-background"
            placeholder="Describe the club"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded border px-3 py-2 bg-background">
            <option>Technology</option>
            <option>Arts</option>
            <option>Sports</option>
            <option>Music</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Photo (optional)</label>
          <input type="file" accept="image/*" onChange={onFileChange} />
          {preview && (
            <div className="mt-2">
              <img src={preview} alt="preview" className="max-w-full h-40 object-cover rounded-md" />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button type="submit" disabled={loading} className="mt-2 px-4 py-2 rounded bg-primary text-white">
            {loading ? 'Creating...' : 'Create Club'}
          </button>
          <button type="button" onClick={() => { setName(''); setDescription(''); setCategory('Technology'); setPhoto(null); setPreview(null); }} className="mt-2 px-4 py-2 rounded border">
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClub;
