import Header1 from "@/components/layout/Header1";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Routes, Route } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

import AddClub from "./AddClub";
import RemoveClub from "./RemoveClub";
import AdminApplications from "./AdminApplications";
import ClubDetails from "./ClubDetails";
import AdminClubIndex from "./AdminClubIndex";
import ManageUsers from "./ManageUsers";
import AdminProfile from "./AdminProfile";
import Events from "./Events"
import AdminSettings from "./AdminSettings";

const AdminDashboard = () => {
  return (
    <SidebarProvider>
      <Header1 />
      <div className="min-h-screen flex w-full bg-background pt-16">
        <AppSidebar userRole="admin" />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
            <div className="flex items-center justify-between h-full px-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="text-foreground hover:text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Admin Dashboard</h2>
              </div>
              
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Routes>
              <Route path="add-club" element={<AddClub />} />
              <Route path="remove-club" element={<RemoveClub />} />
              <Route path="club" element={<AdminClubIndex />} />
              <Route path="events" element={<Events />} />
              <Route path="club/:id" element={<ClubDetails />} />
              <Route path="applications" element={<AdminApplications />} />
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