import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  Search, 
  Calendar, 
  User, 
  FileText, 
  Settings, 
  Plus, 
  Shield, 
  Users, 
  Building2,
  Trash2
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface AppSidebarProps {
  userRole: "user" | "moderator" | "admin";
}

export function AppSidebar({ userRole }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isCollapsed = state === "collapsed";

  const userItems = [
    { title: "Discover Clubs", url: "/dashboard/discover", icon: Search },
    { title: "Activities/Events", url: "/dashboard/events", icon: Calendar },
    { title: "Profile", url: "/dashboard/profile", icon: User },
    { title: "Join Application", url: "/dashboard/apply", icon: FileText },
    { title: "Settings", url: "/dashboard/settings", icon: Settings },
  ];

  const moderatorItems = [
    ...userItems,
    { title: "Create Events", url: "/dashboard/create-event", icon: Plus },
  ];

  const adminItems = [
    { title: "Add Club", url: "/dashboard/add-club", icon: Building2 },
    { title: "Remove Club", url: "/dashboard/remove-club", icon: Trash2 },
    { title: "Manage Users", url: "/dashboard/manage-users", icon: Users },
    { title: "Admin Profile", url: "/dashboard/admin-profile", icon: Shield },
    { title: "Settings", url: "/dashboard/admin-settings", icon: Settings },
  ];

  const getMenuItems = () => {
    switch (userRole) {
      case "admin":
        return adminItems;
      case "moderator":
        return moderatorItems;
      default:
        return userItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border"
    >
      <SidebarContent className="bg-sidebar">
        <div className="p-4 border-b border-sidebar-border">
          {!isCollapsed && (
            <h2 className="text-xl font-orbitron font-bold text-sidebar-primary neon-text-glow">
              ClubLink
            </h2>
          )}
          {isCollapsed && (
            <div className="flex justify-center">
              <span className="text-sidebar-primary font-orbitron font-bold text-lg neon-text-glow">
                CL
              </span>
            </div>
          )}
        </div>

        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className="text-sidebar-foreground/70">
            {!isCollapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-primary border border-sidebar-primary/20"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-primary"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <span className="text-sm text-sidebar-foreground/70">Theme</span>
            )}
            <ThemeToggle />
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}