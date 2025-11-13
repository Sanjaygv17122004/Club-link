import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import useAuth from '@/hooks/useAuth';

const Header1 = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogout = () => {
    auth?.logout?.();
    navigate("/signin");
  };

  const goToProfile = () => {
    const role = auth?.user?.role || 'user';
    if (role === 'admin') navigate('/dashboard/admin/admin-profile');
    else if (role === 'moderator') navigate('/dashboard/moderator/profile');
    else navigate('/dashboard/user/profile');
    setShowMenu(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-orbitron font-bold text-primary">ClubLink</h1>
        </div>
        <div className="flex items-center space-x-4 relative">
          <ThemeToggle />
          {/* If user is logged in, show profile avatar and logout */}
          {auth?.user ? (
            <div className="relative">
              <button className="flex items-center space-x-2 focus:outline-none" onClick={() => setShowMenu((prev) => !prev)}>
                {auth.user.avatar ? (
                  <img src={auth.user.avatar} alt={auth.user.name || auth.user.email} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">{(auth.user.name || auth.user.email || 'U').charAt(0)}</span>
                  </div>
                )}
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-card border rounded shadow-lg z-50">
                  <button className="block w-full text-left px-4 py-2 text-sm hover:bg-primary/10" onClick={goToProfile}>Profile</button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-primary/10" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header1;