const AdminProfile = () => {
  const admin = {
    name: "Admin User",
    email: "admin@email.com",
    role: "Administrator",
    joined: "January 2023",
  };
  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-orbitron font-bold">Admin Profile</h1>
      <p className="text-muted-foreground">Manage your administrator profile and permissions.</p>
      <div className="rounded-lg border bg-card p-6 space-y-4 shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input className="w-full rounded border px-3 py-2 bg-background" value={admin.name} readOnly />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input className="w-full rounded border px-3 py-2 bg-background" value={admin.email} readOnly />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <input className="w-full rounded border px-3 py-2 bg-background" value={admin.role} readOnly />
        </div>
        <div className="text-xs text-muted-foreground">Admin since {admin.joined}</div>
      </div>
    </div>
  );
};

export default AdminProfile;
