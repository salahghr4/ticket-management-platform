import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Column } from "@tanstack/react-table";
import { Ticket } from "@/types/tickets";
import { ChevronUp, ChevronDown, X, EyeOff, ChevronsUpDown } from "lucide-react";

const DataTableColumnHeader = ({
  column,
  header,
}: {
  column: Column<Ticket>;
  header: string;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="-ml-3"
        >
          {header}
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-28"
      >
        {column.getCanSort() && (
          <>
            <DropdownMenuCheckboxItem
              className="relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto [&_svg]:text-muted-foreground"
              checked={column.getIsSorted() === "asc"}
              onClick={() => column.toggleSorting(false)}
            >
              <ChevronUp />
              Asc
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              className="relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto [&_svg]:text-muted-foreground"
              checked={column.getIsSorted() === "desc"}
              onClick={() => column.toggleSorting(true)}
            >
              <ChevronDown />
              Desc
            </DropdownMenuCheckboxItem>
            {column.getIsSorted() && (
              <DropdownMenuItem
                className="pl-2 [&_svg]:text-muted-foreground"
                onClick={() => column.clearSorting()}
              >
                <X />
                Reset
              </DropdownMenuItem>
            )}
          </>
        )}
        {column.getCanHide() && (
          <DropdownMenuCheckboxItem
            className="relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto [&_svg]:text-muted-foreground"
            checked={!column.getIsVisible()}
            onClick={() => column.toggleVisibility(false)}
          >
            <EyeOff />
            Hide
          </DropdownMenuCheckboxItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DataTableColumnHeader;
