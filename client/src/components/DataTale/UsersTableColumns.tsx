import DataTableColumnHeader from "@/components/DataTale/DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import RoleBadge from "@/components/Users/RoleBadge";
import { formatDate } from "@/lib/format";
import { User } from "@/types/auth";
import { ColumnDef } from "@tanstack/react-table";
import { addDays } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";


const getUsersTableColumns = (): ColumnDef<User>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="bg-white border-gray-400 mr-2"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => DataTableColumnHeader({ column, header: "ID" }),
    cell: ({ row }) => (
      <span className="underline text-center text-primary dark:text-accent-foreground/80">
        {row.getValue("id")}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => DataTableColumnHeader({ column, header: "Name" }),
    cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => DataTableColumnHeader({ column, header: "Email" }),
    cell: ({ row }) => <span className="font-medium">{row.getValue("email")}</span>,
  },
  {
    accessorKey: "role",
    header: ({ column }) => DataTableColumnHeader({ column, header: "Role" }),
    cell: ({ row }) => <RoleBadge role={row.getValue("role")} />,
    filterFn: (row, id, value) => {
      return value?.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "department",
    accessorFn: (row) => row.department?.name,
    header: ({ column }) =>
      DataTableColumnHeader({ column, header: "Department" }),
    cell: ({ row }) => {
      const department = row.getValue("department") as string;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{department || "N/A"}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value?.includes(row.getValue(id));
    },
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    header: ({ column }) =>
      DataTableColumnHeader({ column, header: "Joined" }),
    cell: ({ row }) =>
      row.getValue("created_at")
        ? formatDate(row.getValue("created_at") as string)
        : "N/A",
    enableColumnFilter: true,
    filterFn: (row, _, value) => {
      const createdAt = row.getValue("created_at");
      if (!createdAt) return false;
      const date = new Date(createdAt as string);
      if (!value) return true;
      if (Array.isArray(value)) {
        const [from, to] = value;
        const minDate = from ?? new Date().getTime();
        const maxDate = to ?? new Date().getTime();
        return (
          date.getTime() >= minDate && date.getTime() <= addDays(maxDate, 1)
        );
      }
      return date.getTime() >= value;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(user.email);
                toast.success("User Email copied to clipboard");
              }}
              className="cursor-pointer"
            >
              Copy user Email
            </DropdownMenuItem>
            {/* <DropdownMenuSeparator /> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default getUsersTableColumns;
