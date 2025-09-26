import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

// Example: Replace with your actual user context/auth logic
const mockUser = {
  name: "Jane Doe",
  email: "jane@email.com",
  avatarUrl: "", // Add avatar URL if available
  role: "user",
};

const Header1 = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session/auth here
    // For example: localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-orbitron font-bold text-primary">
            ClubLink
          </h1>
        </div>
        <div className="flex items-center space-x-4 relative">
          <ThemeToggle />
          {/* If user is logged in, show profile avatar and logout */}
          {mockUser ? (
            <div className="relative">
              <button
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => setShowMenu((prev) => !prev)}
              >
                {mockUser.avatarUrl ? (
                  <img
                    src={mockUser.avatarUrl}
                    alt={mockUser.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      {mockUser.name.charAt(0)}
                    </span>
                  </div>
                )}
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-card border rounded shadow-lg z-50">
                  <Link
                    to="/dashboard/user/profile"
                    className="block px-4 py-2 text-sm hover:bg-primary/10"
                    onClick={() => setShowMenu(false)}
                  >
                    Profile
                  </Link>
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-primary/10"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
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