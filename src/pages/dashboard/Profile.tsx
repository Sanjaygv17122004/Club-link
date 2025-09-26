
const user = {
  name: "Jane Doe",
  email: "jane.doe@email.com",
  bio: "Enthusiastic club member. Loves coding and photography.",
  joined: "March 2024",
};

const Profile = () => (
  <div className="space-y-6 max-w-xl mx-auto">
    <h1 className="text-3xl font-orbitron font-bold">Profile</h1>
    <p className="text-muted-foreground">Manage your profile and preferences.</p>
    <div className="rounded-lg border bg-card p-6 space-y-4 shadow-sm">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input className="w-full rounded border px-3 py-2 bg-background" value={user.name} readOnly />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input className="w-full rounded border px-3 py-2 bg-background" value={user.email} readOnly />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea className="w-full rounded border px-3 py-2 bg-background" value={user.bio} readOnly />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Member since {user.joined}</span>
        <a href="/forgot-password" className="text-xs text-primary hover:underline">Change/Reset Password</a>
      </div>
    </div>
  </div>
);

export default Profile;
