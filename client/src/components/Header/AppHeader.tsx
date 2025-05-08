import { ModeToggle } from "@/components/Header/ModeToggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";

const AppHeader = () => {
  const { pathname } = useLocation();
  const title = pathname.split("/").pop() || "";
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full justify-between items-center px-4 lg:px-6">
        <div className="flex items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">
            {title.charAt(0).toUpperCase() + title.slice(1)}
          </h1>
        </div>
        <ModeToggle />
      </div>
    </header>
  );
};

export default AppHeader;
