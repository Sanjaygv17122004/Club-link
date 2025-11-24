import React, { useEffect, useState, useContext, useMemo } from "react";
import { apiFetch } from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Trash, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

type UserItem = { id: number; name: string | null; email: string; role: string; createdAt: string };

const ManageUsers = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');
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

  const visibleUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(u => {
      const name = (u.name || '').toLowerCase();
      const email = u.email.toLowerCase();
      const role = (u.role || '').toLowerCase();
      return name.includes(q) || email.includes(q) || role.includes(q);
    });
  }, [users, query]);

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
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">User Accounts</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                className="pl-10 pr-3 py-2 rounded border bg-background text-sm w-64"
                placeholder="Search by name, email or role..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search users"
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-1 top-1/2 -translate-y-1/2 text-sm px-2 py-1 rounded bg-muted text-muted-foreground">Clear</button>
              )}
            </div>
            <Button variant="ghost" onClick={fetchUsers}>Refresh</Button>
          </div>
        </div>

        {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
        {error && <div className="text-sm text-destructive">{error}</div>}

        {!loading && visibleUsers.length === 0 && (
          <div className="text-sm text-muted-foreground">{query ? 'No users match your search.' : 'No users found.'}</div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-sm text-muted-foreground">
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Joined</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((u) => (
                <tr key={u.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                        {((u.name || u.email).split(' ')[0] || '').slice(0,2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{u.name || u.email.split('@')[0]}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="inline-block px-2 py-1 rounded text-sm font-medium bg-muted text-muted-foreground">{u.role}</div>
                    <div className="hidden">{u.email}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(u.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <select
                        className="rounded border px-2 py-1 bg-background border-border text-sm"
                        value={u.role}
                        onChange={(e) => updateRole(u.id, e.target.value)}
                      >
                        <option value="user">user</option>
                        <option value="moderator">moderator</option>
                        <option value="admin">admin</option>
                      </select>
                      <button onClick={() => deleteUser(u.id)} title="Delete user" aria-label="Delete user" className="p-2 rounded text-destructive hover:bg-red-50">
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
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
