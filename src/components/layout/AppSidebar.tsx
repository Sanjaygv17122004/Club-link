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
import { title } from "process";

interface AppSidebarProps {
  userRole: "user" | "moderator" | "admin";
}

export function AppSidebar({ userRole }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  // consider a menu item active if the current path equals the item url
  // or if the current path starts with the item url (for dynamic routes like club/:id)
  const isActive = (path: string) => {
    if (!path) return false;
    if (currentPath === path) return true;
    const normalized = path.endsWith('/') ? path.slice(0, -1) : path;
    return currentPath === normalized || currentPath.startsWith(normalized + '/') || currentPath.startsWith(normalized);
  };
  const isCollapsed = state === "collapsed";

  const userItems = [
    { title: "Discover Clubs", url: "/dashboard/user/discover", icon: Search },
    { title: "Activities/Events", url: "/dashboard/user/events", icon: Calendar },
    { title: "Join Application", url: "/dashboard/user/apply", icon: FileText },
    { title: "Settings", url: "/dashboard/user/settings", icon: Settings },
    { title: "Profile", url: "/dashboard/user/profile", icon: User },
  ];

  const moderatorItems = [
    { title: "Create Events", url: "/dashboard/moderator/create-event", icon: Plus },
    { title: "Discover Clubs", url: "/dashboard/moderator/discover", icon: Search },
    { title: "Activities/Events", url: "/dashboard/moderator/events", icon: Calendar },
    { title: "Profile", url: "/dashboard/moderator/profile", icon: User },
    { title: "Settings", url: "/dashboard/moderator/settings", icon: Settings },
  ];

  const adminItems = [
    { title: "Events", url: "/dashboard/admin/events", icon: Calendar },
    { title: "Add Club", url: "/dashboard/admin/add-club", icon: Building2 },
    { title: "Remove Club", url: "/dashboard/admin/remove-club", icon: Trash2 },
    { title: "Club Details", url: "/dashboard/admin/club", icon: Shield },
    { title: "Applications", url: "/dashboard/admin/applications", icon: FileText },
    { title: "Manage Users", url: "/dashboard/admin/manage-users", icon: Users },
    { title: "Settings", url: "/dashboard/admin/admin-settings", icon: Settings },
    { title: "Admin Profile", url: "/dashboard/admin/admin-profile", icon: Shield },
   
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
      <SidebarContent className="bg-sidebar pt-16">
        {/* Removed ClubLink heading */}
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className="text-sidebar-foreground/70 mt-2">
            {!isCollapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={() =>
                          `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                            isActive(item.url)
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
        {/* Removed ThemeToggle */}
      </SidebarContent>
    </Sidebar>
  );
}