import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

export default function UserMenu() {
  const auth = useAuth();

  if (!auth?.user) {
    return (
      <Link to="/signin">
        <Button variant="ghost">Sign In</Button>
      </Link>
    );
  }

  const handleLogout = () => {
    auth.logout();
    window.location.href = '/';
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="text-sm">
        <div className="font-medium">{auth.user.name ?? auth.user.email}</div>
        <div className="text-xs text-muted-foreground">{auth.user.role}</div>
      </div>
      <div>
        <Link to={auth.user.role === 'admin' ? '/dashboard/admin' : '/dashboard/user'}>
          <Button variant="ghost">Dashboard</Button>
        </Link>
      </div>
      <div>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  );
}
