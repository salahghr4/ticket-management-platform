import DataTableColumnHeader from "@/components/DataTale/DataTableColumnHeader";
import { Checkbox } from "@/components/ui/checkbox";
import RoleBadge from "@/components/Users/RoleBadge";
import UserActions from "@/components/Users/UserActions";
import { formatDate } from "@/lib/format";
import { User } from "@/types/auth";
import { ColumnDef } from "@tanstack/react-table";
import { addDays } from "date-fns";
import { NavigateFunction } from "react-router-dom";

interface GetUsersTableColumnsProps {
  handleDeleteUser: (userId: number) => void;
  navigate: NavigateFunction;
  AuthUser: User | null;
}

const getUsersTableColumns = ({
  navigate,
  handleDeleteUser,
  AuthUser,
}: GetUsersTableColumnsProps): ColumnDef<User>[] => [
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
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => DataTableColumnHeader({ column, header: "Email" }),
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("email")}</span>
    ),
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
    header: ({ column }) => DataTableColumnHeader({ column, header: "Joined" }),
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
    cell: ({ row }) => (
      <UserActions
        user={row.original}
        navigate={navigate}
        handleDeleteUser={handleDeleteUser}
        AuthUser={AuthUser}
      />
    ),
  },
];

export default getUsersTableColumns;
