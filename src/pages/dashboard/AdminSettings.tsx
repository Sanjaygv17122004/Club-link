const AdminSettings = () => (
  <div className="space-y-6 max-w-xl mx-auto">
    <h1 className="text-3xl font-orbitron font-bold">Admin Settings</h1>
    <p className="text-muted-foreground">Configure platform-wide settings and preferences.</p>
    <form className="rounded-lg border bg-card p-6 space-y-4 shadow-sm">
      <div>
        <label className="block text-sm font-medium mb-1">Platform Theme</label>
        <select className="w-full rounded border px-3 py-2 bg-background">
          <option>Light</option>
          <option>Dark</option>
          <option>System</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Maintenance Mode</label>
        <select className="w-full rounded border px-3 py-2 bg-background">
          <option>Off</option>
          <option>On</option>
        </select>
      </div>
      <button type="button" className="mt-2 px-4 py-2 rounded bg-primary text-white">Save Settings</button>
    </form>
  </div>
);

export default AdminSettings;
