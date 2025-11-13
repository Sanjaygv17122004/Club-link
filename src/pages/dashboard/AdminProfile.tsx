import React, { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const AdminProfile = () => {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({ name: '', email: '', role: '', avatar: '', bio: '', location: '' });
  const [counts, setCounts] = useState({ posts: 0, applications: 0 });

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res: any = await apiFetch('/api/auth/me');
      const data = res.data || res;
      setForm({ name: data.name || '', email: data.email || '', role: data.role || '', avatar: data.avatar || '', bio: data.bio || '', location: data.location || '' });
      setCounts({ posts: data.postsCount || 0, applications: data.applicationsCount || 0 });
    } catch (err: any) {
      toast({ title: 'Unable to load profile', description: err?.body?.error || err?.message || 'Failed to fetch profile' });
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { name: form.name, avatar: form.avatar, bio: form.bio, location: form.location };
      const res: any = await apiFetch('/api/auth/me', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      toast({ title: 'Profile updated', description: 'Your admin profile was saved.' });
      // update auth context with new name/avatar
      auth?.setAuth?.(auth.token, { ...auth.user, name: form.name, avatar: form.avatar });
    } catch (err: any) {
      toast({ title: 'Save failed', description: err?.body?.error || err?.message || 'Unable to save profile', variant: 'destructive' });
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-orbitron font-bold">Admin Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your administrator profile and permissions.</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Posts</div>
          <div className="text-xl font-semibold">{counts.posts}</div>
          <div className="text-sm text-muted-foreground mt-2">Applications</div>
          <div className="text-xl font-semibold">{counts.applications}</div>
        </div>
      </header>

      <div className="rounded-lg border bg-card p-6 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="col-span-1 flex items-center">
            {form.avatar ? (
              <img src={form.avatar} alt={form.name} className="w-28 h-28 rounded-lg object-cover" />
            ) : (
              <div className="w-28 h-28 rounded-lg bg-muted flex items-center justify-center text-2xl">{(form.name || 'A').charAt(0)}</div>
            )}
          </div>
          <div className="col-span-2 space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded border px-3 py-2 bg-background" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input value={form.email} readOnly className="w-full rounded border px-3 py-2 bg-muted text-muted-foreground" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="w-full rounded border px-3 py-2 bg-background" rows={4} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full rounded border px-3 py-2 bg-background" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Avatar URL</label>
            <input value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} className="w-full rounded border px-3 py-2 bg-background" />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3">
          <Button variant="ghost" onClick={fetchProfile} disabled={loading}>Revert</Button>
          <Button onClick={handleSave} className="bg-primary text-white" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
