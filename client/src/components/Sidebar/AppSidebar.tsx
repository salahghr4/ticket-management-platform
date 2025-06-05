import SidebarLogo from "@/components/Logo/SidebarLogo";
import { NavUser } from "@/components/Sidebar/NavUser";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/auth";
import {
  Building,
  ChevronRight,
  FolderKanban,
  LayoutDashboard,
  Users,
} from "lucide-react";
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
      title: "Tickets",
      url: "/tickets",
      icon: FolderKanban,
      children: [
        {
          title: "All Tickets",
          url: "/tickets/all",
        },
        {
          title: "Assigned to Me",
          url: "/tickets/assigned",
        },
      ],
    },
    {
      title: "Users",
      url: "/users",
      icon: Users,
    },
    {
      title: "Departments",
      url: "/departments",
      icon: Building,
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
              {items.map((item) => {
                const hasChildren = !!item.children;
                const isParentActive = location.pathname.startsWith(item.url);
                if (hasChildren) {
                  return (
                    <Collapsible
                      key={item.title}
                      asChild
                      defaultOpen={isParentActive}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.title}
                            isActive={isParentActive}
                          >
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.children?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={location.pathname === subItem.url}
                                >
                                  <Link to={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isParentActive}
                      tooltip={item.title}
                    >
                      <Link
                        to={item.url}
                        state={{ from: location.pathname }}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
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
