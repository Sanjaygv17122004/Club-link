
import React, { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const Profile = () => {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({ name: '', email: '', bio: '', joined: '' });

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res: any = await apiFetch('/api/auth/me');
      const data = res.data || res;
      setForm({ name: data.name || '', email: data.email || '', bio: data.bio || '', joined: new Date(data.createdAt).toLocaleDateString() });
    } catch (err: any) {
      toast({ title: 'Unable to load profile', description: err?.body?.error || err?.message || 'Failed to fetch profile' });
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { name: form.name, bio: form.bio };
      await apiFetch('/api/auth/me', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      toast({ title: 'Profile updated', description: 'Your profile was saved.' });
      auth?.setAuth?.(auth.token, { ...auth.user, name: form.name });
    } catch (err: any) {
      toast({ title: 'Save failed', description: err?.body?.error || err?.message || 'Unable to save profile', variant: 'destructive' });
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-orbitron font-bold">Profile</h1>
      <p className="text-muted-foreground">Manage your profile and preferences.</p>

      <div className="rounded-lg border bg-card p-6 space-y-4 shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded border px-3 py-2 bg-background" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input value={form.email} readOnly className="w-full rounded border px-3 py-2 bg-muted text-muted-foreground" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="w-full rounded border px-3 py-2 bg-background" rows={4} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Member since {form.joined}</span>
          <div className="space-x-2">
            <Button variant="ghost" onClick={fetchProfile} disabled={loading}>Revert</Button>
            <Button onClick={handleSave} className="bg-primary text-white" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
