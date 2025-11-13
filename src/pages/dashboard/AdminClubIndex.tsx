import React, { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

type Club = { id: number; name: string; description?: string | null; photoUrl?: string | null };

const AdminClubIndex = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const res: any = await apiFetch('/api/clubs');
      setClubs(res.data || []);
    } catch (err: any) {
      toast({ title: 'Unable to load clubs', description: err?.body?.error || err?.message || 'Failed to fetch' });
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchClubs(); }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-orbitron font-bold">Club Details</h1>
      <p className="text-muted-foreground">Select a club to view its details and members.</p>

      <div className="mt-4">
        {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
        {!loading && clubs.length === 0 && <div className="text-sm text-muted-foreground">No clubs found.</div>}

        <ul className="space-y-3 mt-3">
          {clubs.map(c => (
            <li key={c.id} className="p-3 rounded bg-background border flex items-center justify-between">
              <div>
                <div className="font-medium">{c.name}</div>
                {c.description && <div className="text-xs text-muted-foreground">{c.description}</div>}
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" onClick={() => navigate(`/dashboard/admin/club/${c.id}`)}>Open</Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminClubIndex;
