import DataTableColumnHeader from "@/components/DataTale/DataTableColumnHeader";
import PriorityBadge from "@/components/DataTale/PriorityBadge";
import StatusBadge from "@/components/DataTale/StatusBadge";
import TicketActions from "@/components/Ticket/TicketActions";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/format";
import { User } from "@/types/auth";
import { Ticket } from "@/types/tickets";
import { ColumnDef } from "@tanstack/react-table";
import { addDays } from "date-fns";
import { Link, NavigateFunction } from "react-router-dom";

interface GetTicketTableColumnsProps {
  handleStatusChange: (ticket: Ticket) => void;
  navigate: NavigateFunction;
  handleDeleteTicket: (ticketId: number) => void;
  user: User | null;
}

const getTicketTableColumns = ({
  handleStatusChange,
  navigate,
  handleDeleteTicket,
  user: AuthUser,
}: GetTicketTableColumnsProps): ColumnDef<Ticket>[] => [
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
      <Link
        to={`/tickets/${row.getValue("id")}`}
        className="underline text-primary dark:text-accent-foreground/80"
      >
        <span className="text-center">#{row.getValue("id")}</span>
      </Link>
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => DataTableColumnHeader({ column, header: "Title" }),
    cell: ({ row }) => (
      <div className="font-medium flex flex-col gap-1">
        <span>{row.getValue("title")}</span>
        <span className="text-xs text-gray-500">
          {row.original.description.slice(0, 50) + "..."}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => DataTableColumnHeader({ column, header: "Status" }),
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    filterFn: (row, id, value) => {
      return value?.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) =>
      DataTableColumnHeader({ column, header: "Priority" }),
    cell: ({ row }) => <PriorityBadge priority={row.getValue("priority")} />,
    filterFn: (row, id, value) => {
      return value?.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "user",
    header: "Submitted By",
    cell: ({ row }) => {
      const user = row.getValue("user") as User;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{user?.name || "N/A"}</span>
          <span className="text-xs text-gray-500">{user?.email || "N/A"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "assignee",
    header: "Assigned To",
    cell: ({ row }) => {
      const assignee = row.getValue("assignee") as User;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{assignee?.name || "N/A"}</span>
          <span className="text-xs text-gray-500">
            {assignee?.email || "N/A"}
          </span>
        </div>
      );
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
    accessorKey: "due_date",
    header: ({ column }) =>
      DataTableColumnHeader({ column, header: "Due Date" }),
    cell: ({ row }) =>
      row.getValue("due_date")
        ? formatDate(row.getValue("due_date") as string)
        : "N/A",
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    header: ({ column }) =>
      DataTableColumnHeader({ column, header: "Created At" }),
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
      <TicketActions
        ticket={row.original}
        handleStatusChange={handleStatusChange}
        navigate={navigate}
        handleDeleteTicket={handleDeleteTicket}
        AuthUser={AuthUser}
      />
    ),
  },
];

export default getTicketTableColumns;
