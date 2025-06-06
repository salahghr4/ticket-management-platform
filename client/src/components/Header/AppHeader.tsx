import { ModeToggle } from "@/components/Header/ModeToggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const AppHeader = () => {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full justify-between items-center px-4 lg:px-6">
        <div className="flex items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4 dark:data-[orientation=vertical]:bg-primary-foreground"
          />

          <Breadcrumb>
            <BreadcrumbList>
              {segments.map((seg, idx) => {
                const url = "/" + segments.slice(0, idx + 1).join("/");
                const isLast = idx === segments.length - 1;
                return (
                  <React.Fragment key={url}>
                    <BreadcrumbItem>
                      {isLast ? (
                        <span className="capitalize text-primary dark:text-foreground">
                          {seg.replace(/-/g, " ")}
                        </span>
                      ) : (
                        <Link
                          to={url}
                          className="capitalize"
                        >
                          {seg.replace(/-/g, " ")}
                        </Link>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <ModeToggle />
      </div>
    </header>
  );
};

export default AppHeader;
