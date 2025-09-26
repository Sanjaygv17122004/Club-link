const users = [
  { name: "Jane Doe", email: "jane@email.com", status: "Active" },
  { name: "John Smith", email: "john@email.com", status: "Blocked" },
  { name: "Alice Lee", email: "alice@email.com", status: "Active" },
];

const ManageUsers = () => (
  <div className="space-y-6 max-w-xl mx-auto">
    <h1 className="text-3xl font-orbitron font-bold">Manage Users</h1>
    <p className="text-muted-foreground">Block, unblock, and manage user accounts across the platform.</p>
    <div className="rounded-lg border bg-card p-6 space-y-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-2">User Accounts</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.email} className="flex items-center justify-between p-3 rounded bg-background border">
            <div>
              <span className="font-medium">{user.name}</span>
              <span className="ml-2 text-xs text-muted-foreground">{user.email}</span>
            </div>
            <button className={`px-3 py-1 rounded text-xs ${user.status === 'Active' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>{user.status === 'Active' ? 'Block' : 'Unblock'}</button>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default ManageUsers;
