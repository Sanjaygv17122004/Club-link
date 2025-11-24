import React, { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { apiFetch } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { Trash2 } from 'lucide-react';

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

  const handleRemove = (id: number, name: string) => {
    // show a toast with an action button that performs the deletion
    let doing = false;

    const performDelete = async () => {
      if (doing) return;
      doing = true;
      try {
        await apiFetch(`/api/admin/clubs/${id}`, { method: 'DELETE' });
        setClubs((prev) => prev.filter((c) => c.id !== id));
        toast({ title: 'Club removed', description: `"${name}" has been deleted.` });
      } catch (err: any) {
        console.error('RemoveClub delete error', err);
        toast({ title: 'Remove failed', description: err?.body?.error || err?.message || 'Failed to remove club', variant: 'destructive' });
      } finally {
        doing = false;
      }
    };

    const t = toast({
      title: 'Confirm delete',
      description: `Delete club "${name}"? This action cannot be undone.`,
      action: (
        <ToastAction
          altText={`Delete ${name}`}
          onClick={async () => {
            try {
              try { t?.dismiss && t.dismiss(); } catch (e) { /* ignore */ }
              await performDelete();
            } catch (err) {
              console.error('Error running delete action', err);
            }
          }}
          className="px-3 py-1 rounded bg-red-600 text-white text-xs"
        >
          Delete
        </ToastAction>
      ),
    });
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
    <div className="w-[80%] min-h-half mx-auto px-6 lg:px-12 py-10">
      <h1 className="text-3xl sm:text-3.5xl font-orbitron font-extrabold">Remove Club</h1>
      <p className="text-muted-foreground text-lg mt-2">Manage and remove existing clubs from the platform.</p>

      <div className="mt-6 rounded-lg border bg-card p-6 space-y-6 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2">Existing Clubs</h2>

        {loading && <div className="text-sm text-muted-foreground">Loading clubs…</div>}
        {error && <div className="text-sm text-destructive">{error}</div>}

        {!loading && clubs.length === 0 && (
          <div className="text-sm text-muted-foreground">No clubs found.</div>
        )}

        <ul className="space-y-4">
          {clubs.map((club) => (
            <li key={club.id} className="w-full p-4 rounded-lg bg-background border hover:shadow-md flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {club.photoUrl ? (
                  <img src={club.photoUrl} alt={club.name} className="w-16 h-16 rounded-lg object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-lg font-bold text-foreground">{club.name?.charAt(0)}</div>
                )}
                <div>
                  <div className="text-xl lg:text-2xl font-orbitron tracking-tight text-foreground">{club.name}</div>
                  {club.description && <div className="text-sm text-muted-foreground mt-1 max-w-3xl">{club.description}</div>}
                  {club.createdAt && <div className="text-xs text-muted-foreground mt-1">Created: {new Date(club.createdAt).toLocaleString()}</div>}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleRemove(club.id, club.name)}
                  aria-label={`Remove ${club.name}`}
                  title="Remove club"
                  className="p-2 rounded-md hover:bg-red-600/10"
                >
                  <Trash2 className="w-5 h-5 text-destructive" />
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