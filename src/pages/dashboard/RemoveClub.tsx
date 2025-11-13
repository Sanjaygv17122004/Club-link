import React, { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { apiFetch } from '@/lib/api';

type Club = {
  id: number;
  name: string;
  description?: string | null;
  photoUrl?: string | null;
  createdBy?: number;
  createdAt?: string;
};

const RemoveClub: React.FC = () => {
  const auth = useAuth();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth?.user || auth.user.role !== 'admin') return;
    setLoading(true);
    setError(null);
    apiFetch('/api/admin/clubs')
      .then((res: any) => setClubs(res.data || []))
      .catch((err: any) => setError(err?.body?.error || err?.message || 'Unable to load clubs'))
      .finally(() => setLoading(false));
  }, [auth?.user]);

  const handleRemove = async (id: number, name: string) => {
    if (!confirm(`Delete club "${name}"? This action cannot be undone.`)) return;
    setError(null);
    try {
      await apiFetch(`/api/admin/clubs/${id}`, { method: 'DELETE' });
      setClubs((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      setError(err?.body?.error || err?.message || 'Failed to remove club');
    }
  };

  if (!auth?.user || auth.user.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto py-12">
        <h2 className="text-2xl font-semibold">Access denied</h2>
        <p className="text-muted-foreground mt-2">You must be an admin to remove clubs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto py-8">
      <h1 className="text-3xl font-orbitron font-bold">Remove Club</h1>
      <p className="text-muted-foreground">Manage and remove existing clubs from the platform.</p>

      <div className="rounded-lg border bg-card p-6 space-y-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Existing Clubs</h2>

        {loading && <div className="text-sm text-muted-foreground">Loading clubs…</div>}
        {error && <div className="text-sm text-destructive">{error}</div>}

        {!loading && clubs.length === 0 && (
          <div className="text-sm text-muted-foreground">No clubs found.</div>
        )}

        <ul className="space-y-2">
          {clubs.map((club) => (
            <li key={club.id} className="flex items-center justify-between p-3 rounded bg-background border">
              <div>
                <div className="font-medium">{club.name}</div>
                {club.description && <div className="text-xs text-muted-foreground">{club.description}</div>}
                {club.createdAt && <div className="text-xs text-muted-foreground">Created: {new Date(club.createdAt).toLocaleString()}</div>}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleRemove(club.id, club.name)}
                  className="px-3 py-1 rounded bg-red-600 text-white text-xs"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RemoveClub;
