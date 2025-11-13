import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

type AppItem = { id: number; status: string; createdAt: string; user: { id: number; name?: string | null; email: string }; club: { id: number; name: string } };
type Club = { id: number; name: string };

const AdminApplications = () => {
  const [applications, setApplications] = useState<AppItem[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [filterClub, setFilterClub] = useState<number | 'all'>('all');
  const [loading, setLoading] = useState(false);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res: any = await apiFetch('/api/admin/applications');
      setApplications(res.data || []);
    } catch (err: any) {
      toast({ title: 'Unable to load applications', description: err?.body?.error || err?.message || 'Failed to fetch' });
    } finally { setLoading(false); }
  };

  const fetchClubs = async () => {
    try {
      const res: any = await apiFetch('/api/clubs');
      setClubs(res.data || []);
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => { fetchApps(); fetchClubs(); }, []);
  const navigate = useNavigate();

  const updateStatus = async (id: number, status: string) => {
    try {
      const res: any = await apiFetch(`/api/admin/applications/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
      setApplications((prev) => prev.map(a => a.id === id ? res.data : a));
      toast({ title: 'Application updated', description: `Status set to ${status}` });
    } catch (err: any) {
      toast({ title: 'Update failed', description: err?.body?.error || err?.message || 'Unable to update' });
    }
  };

  const filtered = filterClub === 'all' ? applications : applications.filter(a => a.club.id === filterClub);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-orbitron font-bold">User Applications</h1>
      <p className="text-muted-foreground">Review and manage user applications for clubs.</p>

      <div className="flex items-center space-x-3">
        <label className="text-sm">Filter by club:</label>
        <select value={filterClub as any} onChange={(e) => setFilterClub(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="rounded border px-2 py-1 bg-background">
          <option value="all">All clubs</option>
          {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <Button variant="ghost" onClick={fetchApps}>Refresh</Button>
      </div>

      <div className="rounded-lg border bg-card p-4">
        {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
        {!loading && filtered.length === 0 && <div className="text-sm text-muted-foreground">No applications found.</div>}

        <ul className="space-y-3">
          {filtered.map(app => (
            <li key={app.id} className="p-3 rounded bg-background border flex items-center justify-between">
              <div>
                <div className="font-medium">{app.user?.name || app.user.email}</div>
                <div className="text-xs text-muted-foreground">Applied to <strong>{app.club?.name}</strong> — {new Date(app.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`text-sm px-2 py-1 rounded ${app.status === 'approved' ? 'bg-green-100 text-green-700' : app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{app.status}</div>
                {app.status !== 'approved' && <Button size="sm" onClick={() => updateStatus(app.id, 'approved')}>Approve</Button>}
                {app.status !== 'rejected' && <Button variant="ghost" size="sm" onClick={() => updateStatus(app.id, 'rejected')}>Reject</Button>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminApplications;
