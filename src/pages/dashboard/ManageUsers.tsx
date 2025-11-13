import React, { useEffect, useState, useContext } from "react";
import { apiFetch } from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

type UserItem = { id: number; name: string | null; email: string; role: string; createdAt: string };

const ManageUsers = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useContext(AuthContext) as any;

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await apiFetch('/api/admin/users');
      setUsers(res.data || []);
    } catch (err: any) {
      setError(err?.body?.error || err?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id: number, role: string) => {
    try {
      await apiFetch(`/api/admin/users/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role }) });
      setUsers((prev) => prev.map(u => u.id === id ? { ...u, role } : u));
      toast({ title: 'Role updated', description: `User role changed to ${role}` });
    } catch (err: any) {
      toast({ title: 'Update failed', description: err?.body?.error || err?.message || 'Unable to update role' });
    }
  };

  const deleteUser = async (id: number) => {
    // show toast-based confirmation with action
    let t: any;
    const performDelete = async () => {
      try {
        await apiFetch(`/api/admin/users/${id}`, { method: 'DELETE' });
        setUsers((prev) => prev.filter(u => u.id !== id));
        toast({ title: 'User deleted', description: 'User was removed successfully.' });
      } catch (err: any) {
        toast({ title: 'Delete failed', description: err?.body?.error || err?.message || 'Unable to delete user' });
      }
      if (t && t.dismiss) t.dismiss();
    };

    t = toast({ title: 'Confirm delete', description: 'Click Delete to confirm removing this user.', action: (
      <button onClick={performDelete} className="px-3 py-1 rounded bg-destructive text-white text-sm">Delete</button>
    ) });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-orbitron font-bold">Manage Users</h1>
      <p className="text-muted-foreground">View and manage user accounts across the platform.</p>

      <div className="rounded-lg border bg-card p-6 space-y-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">User Accounts</h2>

        {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
        {error && <div className="text-sm text-destructive">{error}</div>}

        {!loading && users.length === 0 && <div className="text-sm text-muted-foreground">No users found.</div>}

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-sm text-muted-foreground">
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Joined</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-3">
                    <div className="font-medium">{u.name || u.email.split('@')[0]}</div>
                    <div className="text-xs text-muted-foreground">{u.email}</div>
                  </td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      className="rounded border px-2 py-1 bg-background border-border"
                      value={u.role}
                      onChange={(e) => updateRole(u.id, e.target.value)}
                    >
                      <option value="user">user</option>
                      <option value="moderator">moderator</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">{new Date(u.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteUser(u.id)} className="text-sm text-destructive hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
