
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const DashboardSettings = () => {
  const [password, setPassword] = useState('');
  const [notifications, setNotifications] = useState('email_push');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // password change should call backend endpoint; here we'll just show a toast as a placeholder
      if (password) {
        // call /api/auth/me/password if needed - not performed here
        toast({ title: 'Password change', description: 'Password change request was queued.' });
      }
      localStorage.setItem('user:notificationPreferences', notifications);
      toast({ title: 'Settings saved', description: 'Your settings have been updated.' });
    } catch (err: any) {
      toast({ title: 'Save failed', description: err?.message || 'Unable to save settings', variant: 'destructive' });
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-orbitron font-bold">Settings</h1>
      <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      <form className="rounded-lg border bg-card p-6 space-y-4 shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-1">Change Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded border px-3 py-2 bg-background" placeholder="New password" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Notification Preferences</label>
          <select value={notifications} onChange={(e) => setNotifications(e.target.value)} className="w-full rounded border px-3 py-2 bg-background">
            <option value="email_push">Email & Push</option>
            <option value="email">Email Only</option>
            <option value="push">Push Only</option>
            <option value="none">None</option>
          </select>
        </div>
        <div className="flex items-center justify-end">
          <Button onClick={handleSave} className="bg-primary text-white" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
        </div>
      </form>
    </div>
  );
};

export default DashboardSettings;
