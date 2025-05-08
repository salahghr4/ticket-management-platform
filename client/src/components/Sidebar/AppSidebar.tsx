import { NavUser } from "@/components/Sidebar/NavUser";
import SidebarLogo from "@/components/Logo/SidebarLogo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/auth";
import { FolderKanban, LayoutDashboard, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const AppSidebar = () => {
  // Menu items.
  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Users",
      url: "/users",
      icon: Users,
    },
    {
      title: "Tickets",
      url: "/tickets",
      icon: FolderKanban,
    },
  ];
  const location = useLocation();
  const { open } = useSidebar();
  const { user } = useAuth();

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
    >
      <SidebarHeader>
        <SidebarLogo sideBarOpen={open} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user as User} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
