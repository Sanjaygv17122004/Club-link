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
import ClubDetails from "./ClubDetails";

const UserDashboard = () => {
  return (
    <SidebarProvider>
      <Header1 />
      <div className="min-h-screen flex flex-col sm:flex-row w-full bg-background pt-16">
        <AppSidebar userRole="user" />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border bg-card/50 backdrop supports-[backdrop-filter]:bg-card/50">
            <div className="flex flex-wrap items-center justify-between h-full px-2 sm:px-6">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <SidebarTrigger className="text-foreground hover:text-primary" />
                <h2 className="text-base sm:text-lg font-semibold text-foreground">
                  Dashboard
                </h2>
              </div>
            </div>
          </header>
          <main className="flex-1 p-2 sm:p-6 overflow-auto">
            <Routes>
              <Route path="discover" element={<DiscoverClubs />} />
              <Route path="events" element={<Events />} />
              <Route path="apply" element={<JoinApplication />} />
              <Route path="club/:id" element={<ClubDetails />} />
              <Route path="settings" element={<DashboardSettings />} />
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<DiscoverClubs />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default UserDashboard;