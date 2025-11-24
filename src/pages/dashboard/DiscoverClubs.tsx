
import React, { useEffect, useState, useContext } from "react";
import { apiFetch } from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type Club = { id: number; name: string; description?: string | null; photoUrl?: string | null; createdAt?: string };

const DiscoverClubs = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedClubIds, setAppliedClubIds] = useState<number[]>([]);
  const auth = useContext(AuthContext) as any;
  const navigate = useNavigate();

  const fetchClubs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await apiFetch('/api/clubs');
      setClubs(res.data || []);
    } catch (err: any) {
      setError(err?.body?.error || err?.message || 'Unable to load clubs');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    if (!auth?.user) return;
    try {
      const res: any = await apiFetch('/api/applications');
      const ids = (res.data || []).map((a: any) => Number(a.clubId));
      setAppliedClubIds(ids);
    } catch (e) {
      // ignore; user may not have applications
    }
  };

  useEffect(() => { fetchClubs(); }, []);
  useEffect(() => { fetchApplications(); }, [auth?.user]);

  const applyToClub = async (clubId: number) => {
    if (!auth?.user) { navigate('/signin'); return; }
    try {
      await apiFetch('/api/applications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clubId }) });
      setAppliedClubIds((prev) => [...prev, clubId]);
      toast({ title: 'Application submitted', description: 'Your application has been submitted.' });
    } catch (err: any) {
      toast({ title: 'Application failed', description: err?.body?.error || err?.message || 'Unable to apply' });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-orbitron font-bold">Discover Clubs</h1>
      <p className="text-muted-foreground">Find and explore clubs that match your interests.</p>

      {loading && <div className="text-sm text-muted-foreground">Loading clubs...</div>}
      {error && <div className="text-sm text-destructive">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clubs.map((club) => (
          <div key={club.id} className="rounded-lg border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-primary mb-1">{club.name}</h2>
            <p className="text-muted-foreground mb-2">{club.description}</p>
            <div className="flex items-center justify-between mt-4">
              
              {appliedClubIds.includes(club.id) ? (
                <span className="text-sm text-muted-foreground">Applied</span>
              ) : (
                <Button size="sm" onClick={() => applyToClub(club.id)}>Apply</Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscoverClubs;
