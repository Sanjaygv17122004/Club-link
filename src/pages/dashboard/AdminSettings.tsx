import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const [theme, setTheme] = useState('system');
  const [maintenance, setMaintenance] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // load from localStorage as fallback
    const s = localStorage.getItem('admin:settings');
    if (s) {
      try { const parsed = JSON.parse(s); setTheme(parsed.theme || 'system'); setMaintenance(!!parsed.maintenance); } catch {}
    }
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { theme, maintenance };
      // no server endpoint for platform settings in this app; persist locally for now
      localStorage.setItem('admin:settings', JSON.stringify(payload));
      toast({ title: 'Settings saved', description: 'Admin settings were saved locally.' });
    } catch (err: any) {
      toast({ title: 'Save failed', description: err?.message || 'Unable to save settings', variant: 'destructive' });
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-orbitron font-bold">Admin Settings</h1>
      <p className="text-muted-foreground">Configure platform-wide settings and preferences.</p>
      <form className="rounded-lg border bg-card p-6 space-y-4 shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-1">Platform Theme</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full rounded border px-3 py-2 bg-background">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Maintenance Mode</label>
          <div className="flex items-center space-x-3">
            <label className="inline-flex items-center">
              <input type="checkbox" checked={maintenance} onChange={(e) => setMaintenance(e.target.checked)} className="mr-2" />
              <span className="text-sm">Enable maintenance mode</span>
            </label>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <Button onClick={handleSave} className="bg-primary text-white" disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
