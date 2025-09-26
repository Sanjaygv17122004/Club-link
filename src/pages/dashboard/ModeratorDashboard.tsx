import Header1 from "@/components/layout/Header1";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Routes, Route } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

import DiscoverClubs from "./DiscoverClubs";
import Events from "./Events";
import Profile from "./Profile";
import JoinApplication from "./JoinApplication";
import DashboardSettings from "./DashboardSettings";
import CreateEvent from "./CreateEvent";

const ModeratorDashboard = () => {
  return (
    <SidebarProvider>
      <Header1 />
      <div className="min-h-screen flex w-full bg-background pt-16">
        <AppSidebar userRole="moderator" />
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
            <div className="flex items-center justify-between h-full px-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="text-foreground hover:text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Moderator Dashboard
                </h2>
              </div>

            
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            <Routes>
              <Route path="discover" element={<DiscoverClubs />} />
              <Route path="events" element={<Events />} />
              <Route path="profile" element={<Profile />} />
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