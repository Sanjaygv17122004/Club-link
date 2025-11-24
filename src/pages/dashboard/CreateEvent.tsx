import React, { useEffect, useState, useContext } from 'react';
import { apiFetch, API_BASE } from '@/lib/api';
import { AuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

type Club = { id: number; name: string };

const CreateEvent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [clubId, setClubId] = useState<number | ''>('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [clubs, setClubs] = useState<Club[]>([]);
  const auth = useContext(AuthContext) as any;

  useEffect(() => {
    // fetch available clubs for the select
    (async () => {
      try {
        const res: any = await apiFetch('/api/clubs');
        setClubs(res.data || []);
      } catch (err: any) {
        // don't block the form; show toast
        toast({ title: 'Unable to load clubs', description: err?.body?.error || err?.message || 'Could not fetch clubs' });
      }
    })();
  }, []);

  const uploadFile = async (): Promise<string | null> => {
    if (!file) return null;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const base = API_BASE || (import.meta.env.VITE_API_URL ?? '');
      const uploadUrl = base.endsWith('/') ? `${base}api/uploads` : `${base}/api/uploads`;
      const res = await fetch(uploadUrl, { method: 'POST', body: fd });
      const json = await res.json();
      console.debug('upload response', res.status, json);
      if (!res.ok) throw new Error(json?.error || 'Upload failed');
      // prefer absoluteUrl if provided
      return json?.data?.absoluteUrl || json?.data?.url || null;
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err?.message || 'Unable to upload file' });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!auth?.user) { toast({ title: 'Sign in required', description: 'Please sign in to create events.' }); return; }
    if (!title || !date || !clubId) { toast({ title: 'Missing fields', description: 'Title, date and club are required.' }); return; }

    setSubmitting(true);
    try {
      let mediaUrl: string | undefined;
      if (file) {
        const uploaded = await uploadFile();
        if (uploaded) mediaUrl = uploaded;
        else { setSubmitting(false); return; }
      }

      // combine date + time into an ISO string
      const when = time ? new Date(`${date}T${time}`) : new Date(date);

      const body: any = {
        title,
        description,
        date: when.toISOString(),
        location,
        clubId: Number(clubId),
      };
      if (mediaUrl) body.mediaUrl = mediaUrl;

      const created: any = await apiFetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      toast({ title: 'Event created', description: 'Your event was created successfully.' });
      // clear form
      setTitle(''); setDescription(''); setDate(''); setTime(''); setLocation(''); setFile(null); setClubId('');
    } catch (err: any) {
      toast({ title: 'Create failed', description: err?.body?.error || err?.message || 'Unable to create event' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-orbitron font-bold">Create Event</h1>
      <p className="text-muted-foreground">Create and manage events for your clubs.</p>

      <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 space-y-4 shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-1">Event Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded border px-3 py-2 bg-background" placeholder="Enter event title" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded border px-3 py-2 bg-background" placeholder="Describe the event" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="w-full rounded border px-3 py-2 bg-background" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Time</label>
            <input value={time} onChange={(e) => setTime(e.target.value)} type="time" className="w-full rounded border px-3 py-2 bg-background" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full rounded border px-3 py-2 bg-background" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Club</label>
          <select value={clubId} onChange={(e) => setClubId(e.target.value ? Number(e.target.value) : '')} className="w-full rounded border px-3 py-2 bg-background">
            <option value="">Select a club</option>
            {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image / Video</label>
          <input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="w-full rounded border px-3 py-2 bg-background" />
          {file && <div className="text-sm text-muted-foreground mt-2">Selected: {file.name}</div>}
        </div>

        <div className="flex items-center justify-end space-x-3">
          <Button type="button" variant="ghost" onClick={() => { setTitle(''); setDescription(''); setDate(''); setTime(''); setLocation(''); setFile(null); setClubId(''); }}>Clear</Button>
          <Button type="submit" className="bg-primary text-white" disabled={submitting || uploading}>{submitting || uploading ? 'Working...' : 'Create Event'}</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
