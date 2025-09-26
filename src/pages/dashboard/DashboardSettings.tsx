
const DashboardSettings = () => (
  <div className="space-y-6 max-w-xl mx-auto">
    <h1 className="text-3xl font-orbitron font-bold">Settings</h1>
    <p className="text-muted-foreground">Manage your account settings and preferences.</p>
    <form className="rounded-lg border bg-card p-6 space-y-4 shadow-sm">
      <div>
        <label className="block text-sm font-medium mb-1">Change Password</label>
        <input type="password" className="w-full rounded border px-3 py-2 bg-background" placeholder="New password" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Notification Preferences</label>
        <select className="w-full rounded border px-3 py-2 bg-background">
          <option>Email & Push</option>
          <option>Email Only</option>
          <option>Push Only</option>
          <option>None</option>
        </select>
      </div>
      <button type="button" className="mt-2 px-4 py-2 rounded bg-primary text-white">Save Changes</button>
    </form>
  </div>
);

export default DashboardSettings;
