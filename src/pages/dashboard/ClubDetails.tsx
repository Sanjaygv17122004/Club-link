import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

type ClubData = { id: number; name: string; description?: string | null; photoUrl?: string | null; createdAt?: string };
type Member = { id: number; name?: string | null; email: string };

const ClubDetails = () => {
  const { id } = useParams();
  const [club, setClub] = useState<ClubData | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchClub = async (clubId: string) => {
    setLoading(true);
    try {
      const res: any = await apiFetch(`/api/clubs/${clubId}`);
      const data = res.data || {};
      setClub(data.club || null);
      setMembers(data.members?.map((m: any) => m.user) || []);
    } catch (err: any) {
      toast({ title: 'Unable to load club', description: err?.body?.error || err?.message || 'Failed to fetch' });
    } finally { setLoading(false); }
  };

  useEffect(() => { if (id) fetchClub(id); }, [id]);

  if (!id) return <div className="text-muted-foreground">No club specified.</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
      {!loading && club && (
        <div>
          <div className="flex items-start space-x-6">
            {club.photoUrl ? (
              <img src={club.photoUrl} alt={club.name} className="w-40 h-40 object-cover rounded-lg" />
            ) : (
              <div className="w-40 h-40 bg-muted rounded-lg flex items-center justify-center">No image</div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{club.name}</h1>
              <p className="text-sm text-muted-foreground">Joined: {new Date(club.createdAt || '').toLocaleDateString()}</p>
              <p className="mt-3">{club.description}</p>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold">Members</h2>
            {members.length === 0 ? (
              <div className="text-sm text-muted-foreground">No approved members yet.</div>
            ) : (
              <ul className="mt-3 space-y-2">
                {members.map(m => (
                  <li key={m.id} className="p-2 rounded bg-background border flex items-center justify-between">
                    <div>
                      <div className="font-medium">{m.name || m.email.split('@')[0]}</div>
                      <div className="text-xs text-muted-foreground">{m.email}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubDetails;
