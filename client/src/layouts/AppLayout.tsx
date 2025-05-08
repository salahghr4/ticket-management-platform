import AppHeader from "@/components/Header/AppHeader";
import AppSidebar from "@/components/Sidebar/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden">
        <AppHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
