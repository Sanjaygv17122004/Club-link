import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Routes, Route } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

// Import user dashboard components
const DiscoverClubs = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-orbitron font-bold">Discover Clubs</h1>
    <p className="text-muted-foreground">Find and explore clubs that match your interests.</p>
  </div>
);

const Events = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-orbitron font-bold">Activities & Events</h1>
    <p className="text-muted-foreground">Stay updated with upcoming events and activities.</p>
  </div>
);

const Profile = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-orbitron font-bold">Profile</h1>
    <p className="text-muted-foreground">Manage your profile and preferences.</p>
  </div>
);

const JoinApplication = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-orbitron font-bold">Join Application</h1>
    <p className="text-muted-foreground">Apply to join clubs and track your applications.</p>
  </div>
);

const DashboardSettings = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-orbitron font-bold">Settings</h1>
    <p className="text-muted-foreground">Manage your account settings and preferences.</p>
  </div>
);

// Moderator-specific component
const CreateEvent = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-orbitron font-bold">Create Event</h1>
    <p className="text-muted-foreground">Create and manage events for your clubs.</p>
    {/* TODO: Implement event creation form with image upload, scheduling, etc. */}
  </div>
);

const ModeratorDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar userRole="moderator" />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
            <div className="flex items-center justify-between h-full px-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="text-foreground hover:text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Moderator Dashboard</h2>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">M</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            <Routes>
              <Route path="discover" element={<DiscoverClubs />} />
              <Route path="events" element={<Events />} />
              <Route path="profile" element={<Profile />} />
              <Route path="apply" element={<JoinApplication />} />
              <Route path="settings" element={<DashboardSettings />} />
              <Route path="create-event" element={<CreateEvent />} />
              <Route path="*" element={<DiscoverClubs />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ModeratorDashboard;