import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Settings2,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUpdateTicket } from "@/hooks/useTickets";
import { formatDate } from "@/lib/format";
import { User } from "@/types/auth";
import { Ticket } from "@/types/tickets";
import { addDays } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DataTableColumnHeader from "./DataTableColumnHeader";
import DataTableFilters from "./DataTableFilters";
import { DataTableSkeleton } from "./DataTableSkeleton";
import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";

export default function DataTable({
  data,
  isLoading = false,
}: {
  data: Ticket[];
  isLoading?: boolean;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const { mutateAsync: updateTicket } = useUpdateTicket();
  const navigate = useNavigate();

  const handleStatusChange = useCallback(
    (ticket: Ticket) => {
      const newStatus =
        ticket.status === "open"
          ? "in progress"
          : ticket.status === "in progress"
          ? "resolved"
          : ticket.status === "resolved"
          ? "closed"
          : "open";
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { updated_at, user, assignee, department, ...rest } = ticket;
      const ticketData: Partial<Ticket> = {
        ...rest,
        status: newStatus as Ticket["status"],
      };

      try {
        toast.promise(updateTicket(ticketData), {
          loading: "Updating ticket status...",
          success: () => `Ticket status updated to ${newStatus}`,
          error: "Error updating ticket status, please try again",
        });
      } catch (error) {
        console.error("Error updating ticket:", error);
      }
    },
    [updateTicket]
  );

  const columns: ColumnDef<Ticket>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
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
        header: ({ column }) =>
          DataTableColumnHeader({ column, header: "Title" }),
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
        header: ({ column }) =>
          DataTableColumnHeader({ column, header: "Status" }),
        cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
        filterFn: (row, id, value) => {
          return value?.includes(row.getValue(id));
        },
      },
      {
        accessorKey: "priority",
        header: ({ column }) =>
          DataTableColumnHeader({ column, header: "Priority" }),
        cell: ({ row }) => (
          <PriorityBadge priority={row.getValue("priority")} />
        ),
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
              <span className="text-xs text-gray-500">
                {user?.email || "N/A"}
              </span>
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
        cell: ({ row }) => {
          const ticket = row.original;

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
                    navigator.clipboard.writeText(ticket.id.toString());
                    toast.success("Ticket ID copied to clipboard");
                  }}
                  className="cursor-pointer"
                >
                  Copy ticket ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    navigate(`/tickets/${ticket.id}`);
                  }}
                  className="cursor-pointer"
                >
                  View details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    navigate(`/tickets/${ticket.id}/edit`);
                  }}
                  className="cursor-pointer"
                >
                  Edit ticket
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusChange(ticket)}
                  className="cursor-pointer"
                >
                  Mark as{" "}
                  {ticket.status === "open"
                    ? "in progress"
                    : ticket.status === "in progress"
                    ? "resolved"
                    : ticket.status === "resolved"
                    ? "closed"
                    : "open"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleStatusChange, navigate]
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isLoading) {
    return <DataTableSkeleton />;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4 flex-wrap gap-2">
        <DataTableFilters
          table={table}
          data={data}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="border-dashed self-baseline"
            >
              <Settings2 className="h-4 w-4" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="sticky top-0 z-10 bg-muted/50"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="**:data-[slot=table-cell]:first:w-8">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No tickets found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        {/* pagination */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Rows per page</p>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="h-8 w-[70px] rounded-md border border-input bg-background px-2 py-1 text-sm"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option
                  key={pageSize}
                  value={pageSize}
                >
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1 px-2">
              <span className="text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
