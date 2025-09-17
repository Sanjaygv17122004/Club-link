import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Routes, Route } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

// Admin-specific components
const AddClub = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-orbitron font-bold">Add Club</h1>
    <p className="text-muted-foreground">Create new clubs and set up their configurations.</p>
    {/* TODO: Implement add club functionality */}
  </div>
);

const RemoveClub = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-orbitron font-bold">Remove Club</h1>
    <p className="text-muted-foreground">Manage and remove existing clubs from the platform.</p>
    {/* TODO: Implement remove club functionality */}
  </div>
);

const ManageUsers = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-orbitron font-bold">Manage Users</h1>
    <p className="text-muted-foreground">Block, unblock, and manage user accounts across the platform.</p>
    {/* TODO: Implement user management functionality */}
  </div>
);

const AdminProfile = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-orbitron font-bold">Admin Profile</h1>
    <p className="text-muted-foreground">Manage your administrator profile and permissions.</p>
    {/* TODO: Implement admin profile functionality */}
  </div>
);

const AdminSettings = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-orbitron font-bold">Admin Settings</h1>
    <p className="text-muted-foreground">Configure platform-wide settings and preferences.</p>
    {/* TODO: Implement admin settings functionality */}
  </div>
);

const AdminDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar userRole="admin" />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
            <div className="flex items-center justify-between h-full px-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="text-foreground hover:text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Admin Dashboard</h2>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">A</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            <Routes>
              <Route path="add-club" element={<AddClub />} />
              <Route path="remove-club" element={<RemoveClub />} />
              <Route path="manage-users" element={<ManageUsers />} />
              <Route path="admin-profile" element={<AdminProfile />} />
              <Route path="admin-settings" element={<AdminSettings />} />
              <Route path="*" element={<AddClub />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;