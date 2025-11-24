import React, { useEffect, useState, useContext } from "react";
import { apiFetch } from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Check, X, Clock } from 'lucide-react';

type AppItem = { id: number; status: string; club: { id: number; name: string } };

const JoinApplication = () => {
  const [applications, setApplications] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useContext(AuthContext) as any;

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await apiFetch('/api/applications');
      setApplications(res.data || []);
    } catch (err: any) {
      setError(err?.body?.error || err?.message || 'Unable to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [auth?.user]);

  const withdraw = async (id: number) => {
    let t: any;
    const performWithdraw = async () => {
      try {
        await apiFetch(`/api/applications/${id}`, { method: 'DELETE' });
        setApplications((prev) => prev.filter(a => a.id !== id));
        toast({ title: 'Application withdrawn', description: 'Your application was withdrawn.' });
      } catch (err: any) {
        toast({ title: 'Withdraw failed', description: err?.body?.error || err?.message || 'Unable to withdraw' });
      }
      if (t && t.dismiss) t.dismiss();
    };

    t = toast({ title: 'Confirm withdraw', description: 'Click Withdraw to confirm.', action: (
      <button onClick={performWithdraw} className="px-3 py-1 rounded bg-destructive text-white text-sm">Withdraw</button>
    ) });
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-orbitron font-bold">Join Application</h1>
      <p className="text-muted-foreground">Apply to join clubs and track your applications.</p>

      <div className="rounded-lg border bg-card p-6 space-y-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Your Applications</h2>

        {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
        {error && <div className="text-sm text-destructive">{error}</div>}

        {!loading && applications.length === 0 && (
          <div className="text-sm text-muted-foreground">You have no applications yet.</div>
        )}

        <ul className="space-y-2">
          {applications.map((app) => (
            <li key={app.id} className="flex items-center justify-between p-3 rounded bg-background border">
              <div>
                <div className="font-medium">{app.club?.name}</div>
                <div className="text-xs text-muted-foreground">Application ID: {app.id}</div>
              </div>
              <div className="flex items-center space-x-3">
                <span title={app.status} aria-label={`Status: ${app.status}`} className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-muted/10">
                  {app.status === 'approved' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : app.status === 'pending' ? (
                    <Clock className="w-4 h-4 text-yellow-600" />
                  ) : (
                    <X className="w-4 h-4 text-red-600" />
                  )}
                </span>
                <Button variant="ghost" size="sm" onClick={() => withdraw(app.id)}>Withdraw</Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default JoinApplication;
