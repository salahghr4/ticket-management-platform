import {
  Column,
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
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Ban,
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  Circle,
  CircleCheck,
  CircleDot,
  CirclePlus,
  CircleX,
  EyeOff,
  MoreHorizontal,
  Timer,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@/types/auth";
import { Ticket } from "@/types/tickets";
import { Link } from "react-router-dom";
import { DataTableDateFilter } from "@/components/DataTableDateFilter";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Create status badge with appropriate color
const StatusBadge = ({ status }: { status: Ticket["status"] }) => {
  const statusStyles = {
    open: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700",
    "in progress":
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-700",
    resolved:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700",
    closed:
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700",
    rejected:
      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300 dark:border-red-700",
  };

  return (
    <Badge
      variant="outline"
      className={`${statusStyles[status]} font-medium`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

// Create priority badge with appropriate color
const PriorityBadge = ({ priority }: { priority: Ticket["priority"] }) => {
  const priorityStyles = {
    low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300 dark:border-green-700",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700",
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300 dark:border-red-700",
  };

  return (
    <Badge
      variant="outline"
      className={`${priorityStyles[priority]} font-medium`}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
};

// Create a column header component
const columnHeader = ({
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

export default function DataTable({ data }: { data: Ticket[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [statusPopoverOpen, setStatusPopoverOpen] = useState(false);
  const [priorityPopoverOpen, setPriorityPopoverOpen] = useState(false);
  const [departmentPopoverOpen, setDepartmentPopoverOpen] = useState(false);

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
            className="bg-white border-gray-400"
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
        header: "ID",
        cell: ({ row }) => (
          <Link
            to={`/tickets/${row.getValue("id")}`}
            className="underline text-primary"
          >
            <span className="text-center">#{row.getValue("id")}</span>
          </Link>
        ),
      },
      {
        accessorKey: "title",
        header: ({ column }) => columnHeader({ column, header: "Title" }),
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
        header: ({ column }) => columnHeader({ column, header: "Status" }),
        cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
        filterFn: (row, id, value) => {
          return value?.includes(row.getValue(id));
        },
      },
      {
        accessorKey: "priority",
        header: ({ column }) => columnHeader({ column, header: "Priority" }),
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
              <span className="font-medium">{user.name}</span>
              <span className="text-xs text-gray-500">{user.email}</span>
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
              <span className="font-medium">{assignee.name}</span>
              <span className="text-xs text-gray-500">{assignee.email}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "department",
        accessorFn: (row) => row.department?.name,
        header: ({ column }) => columnHeader({ column, header: "Department" }),
        cell: ({ row }) => {
          const department = row.getValue("department") as string;
          return (
            <div className="flex flex-col">
              <span className="font-medium">{department}</span>
            </div>
          );
        },
        filterFn: (row, id, value) => {
          return value?.includes(row.getValue(id));
        },
      },
      {
        accessorKey: "due_date",
        header: ({ column }) => columnHeader({ column, header: "Due Date" }),
        cell: ({ row }) => formatDate(row.getValue("due_date")),
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        header: ({ column }) => columnHeader({ column, header: "Created At" }),
        cell: ({ row }) => formatDate(row.getValue("created_at")),
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
            return date.getTime() >= minDate && date.getTime() <= maxDate;
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
                  }}
                  className="cursor-pointer"
                >
                  Copy ticket ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View details</DropdownMenuItem>
                <DropdownMenuItem>Edit ticket</DropdownMenuItem>
                <DropdownMenuItem>Assign to me</DropdownMenuItem>
                <DropdownMenuItem>
                  Mark as{" "}
                  {ticket.status === "rejected" ? "pending" : "resolved"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
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

  const statusOptions = [
    {
      label: "Open",
      value: "open",
      icon: <CircleDot className="h-4 w-4 text-gray-500" />,
    },
    {
      label: "In Progress",
      value: "in progress",
      icon: <Timer className="h-4 w-4 text-gray-500" />,
    },
    {
      label: "Resolved",
      value: "resolved",
      icon: <CircleCheck className="h-4 w-4 text-gray-500" />,
    },
    {
      label: "Closed",
      value: "closed",
      icon: <Circle className="h-4 w-4 text-gray-500" />,
    },
    {
      label: "Rejected",
      value: "rejected",
      icon: <Ban className="h-4 w-4 text-gray-500" />,
    },
  ];

  const priorityOptions = [
    {
      label: "Low",
      value: "low",
      icon: <ArrowDown className="h-4 w-4 text-gray-500" />,
    },
    {
      label: "Medium",
      value: "medium",
      icon: <ArrowRight className="h-4 w-4 text-gray-500" />,
    },
    {
      label: "High",
      value: "high",
      icon: <ArrowUp className="h-4 w-4 text-gray-500" />,
    },
  ];

  const departmentOptions = useMemo(
    () =>
      data
        .map((ticket) => ticket.department)
        .filter(
          (department, index, self) =>
            index === self.findIndex((t) => t.id === department.id)
        ),
    [data]
  );

  const selectedStatuses =
    (table.getColumn("status")?.getFilterValue() as string[]) || [];
  const selectedPriorities =
    (table.getColumn("priority")?.getFilterValue() as string[]) || [];
  const selectedDepartments =
    (table.getColumn("department")?.getFilterValue() as string[]) || [];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4 flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {/* a filter for the title */}
          <Input
            placeholder="Filter tickets..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          {/* a filter for the status */}
          <Popover
            open={statusPopoverOpen}
            onOpenChange={setStatusPopoverOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="border-dashed"
                // size="sm"
              >
                {selectedStatuses.length > 0 ? (
                  <CircleX className="h-4 w-4" />
                ) : (
                  <CirclePlus className="h-4 w-4" />
                )}
                Status
                {selectedStatuses.length > 0 && (
                  <>
                    <Separator orientation="vertical" />
                    <div className="flex items-center gap-2">
                      {selectedStatuses.length <= 2 ? (
                        selectedStatuses.map((status) => (
                          <Badge
                            key={status}
                            variant="outline"
                          >
                            {
                              statusOptions.find((s) => s.value === status)
                                ?.label
                            }
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline">
                          {selectedStatuses.length} selected
                        </Badge>
                      )}
                    </div>
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[12.5rem] p-1"
              align="start"
            >
              {statusOptions.map((status) => (
                <label
                  key={status.value}
                  htmlFor={status.value}
                  className="flex items-center gap-4 px-2 rounded-sm text-sm hover:bg-accent cursor-pointer py-1.5 overflow-y-auto overflow-x-hidden"
                >
                  <div className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      id={status.value}
                      className="border-gray-400"
                      checked={(
                        (table
                          .getColumn("status")
                          ?.getFilterValue() as string[]) || []
                      ).includes(status.value)}
                      onCheckedChange={(checked) => {
                        const filterValues =
                          (table
                            .getColumn("status")
                            ?.getFilterValue() as string[]) || [];

                        const newFilterValues = checked
                          ? [...filterValues, status.value]
                          : filterValues.filter((val) => val !== status.value);

                        table
                          .getColumn("status")
                          ?.setFilterValue(
                            newFilterValues.length > 0 ? newFilterValues : null
                          );
                      }}
                    />
                    <div className="flex items-center gap-2">
                      <span>{status.icon}</span>
                      <span>{status.label}</span>
                    </div>
                  </div>
                  <span className="ml-auto">
                    {
                      data.filter((ticket) => ticket.status === status.value)
                        .length
                    }
                  </span>
                </label>
              ))}
              <Separator className="my-1" />
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  table.getColumn("status")?.setFilterValue(null);
                  setStatusPopoverOpen(false);
                }}
              >
                Clear filters
              </Button>
            </PopoverContent>
          </Popover>
          {/* a filter for the priority */}
          <Popover
            open={priorityPopoverOpen}
            onOpenChange={setPriorityPopoverOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="border-dashed"
                // size="sm"
              >
                {selectedPriorities.length > 0 ? (
                  <CircleX className="h-4 w-4" />
                ) : (
                  <CirclePlus className="h-4 w-4" />
                )}
                Priority
                {selectedPriorities.length > 0 && (
                  <>
                    <Separator orientation="vertical" />
                    <div className="flex items-center gap-2">
                      {selectedPriorities.map((priority) => (
                        <Badge
                          key={priority}
                          variant="outline"
                        >
                          {
                            priorityOptions.find((p) => p.value === priority)
                              ?.label
                          }
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[12.5rem] p-1"
              align="start"
            >
              {priorityOptions.map((priority) => (
                <label
                  htmlFor={priority.value}
                  key={priority.value}
                  className="flex items-center gap-4 px-2 rounded-sm text-sm hover:bg-accent cursor-pointer py-1.5 overflow-y-auto overflow-x-hidden"
                >
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      id={priority.value}
                      className="border-gray-400"
                      checked={(
                        (table
                          .getColumn("priority")
                          ?.getFilterValue() as string[]) || []
                      ).includes(priority.value)}
                      onCheckedChange={(checked) => {
                        const filterValues =
                          (table
                            .getColumn("priority")
                            ?.getFilterValue() as string[]) || [];

                        const newFilterValues = checked
                          ? [...filterValues, priority.value]
                          : filterValues.filter(
                              (val) => val !== priority.value
                            );

                        table
                          .getColumn("priority")
                          ?.setFilterValue(
                            newFilterValues.length > 0 ? newFilterValues : null
                          );
                      }}
                    />
                    {priority.icon}
                    {priority.label}
                  </div>
                </label>
              ))}
              <Separator className="my-1" />
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  table.getColumn("priority")?.setFilterValue(null);
                  setPriorityPopoverOpen(false);
                }}
              >
                Clear filters
              </Button>
            </PopoverContent>
          </Popover>
          {/* a fliter for the department */}
          <Popover
            open={departmentPopoverOpen}
            onOpenChange={setDepartmentPopoverOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="border-dashed"
                // size="sm"
              >
                {selectedDepartments.length > 0 ? (
                  <CircleX className="h-4 w-4" />
                ) : (
                  <CirclePlus className="h-4 w-4" />
                )}
                Department
                {selectedDepartments.length > 0 && (
                  <>
                    <Separator orientation="vertical" />
                    <div className="flex items-center gap-2">
                      {selectedDepartments.length <= 2 ? (
                        selectedDepartments.map((department) => (
                          <Badge
                            key={department}
                            variant="outline"
                          >
                            {department}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline">
                          {selectedDepartments.length} selected
                        </Badge>
                      )}
                    </div>
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[12.5rem] p-1"
              align="start"
            >
              {departmentOptions.map((department) => (
                <label
                  key={department.name}
                  htmlFor={department.name}
                  className="flex items-center gap-4 px-2 rounded-sm text-sm hover:bg-accent cursor-pointer py-1.5 overflow-y-auto overflow-x-hidden"
                >
                  <Checkbox
                    id={department.name}
                    className="border-gray-400"
                    checked={(
                      (table
                        .getColumn("department")
                        ?.getFilterValue() as string[]) || []
                    ).includes(department.name)}
                    onCheckedChange={(checked) => {
                      const filterValues =
                        (table
                          .getColumn("department")
                          ?.getFilterValue() as string[]) || [];

                      const newFilterValues = checked
                        ? [...filterValues, department.name]
                        : filterValues.filter((val) => val !== department.name);

                      table
                        .getColumn("department")
                        ?.setFilterValue(
                          newFilterValues.length > 0 ? newFilterValues : null
                        );
                    }}
                  />
                  {department.name}
                </label>
              ))}
              <Separator className="my-1" />
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  table.getColumn("department")?.setFilterValue(null);
                  setDepartmentPopoverOpen(false);
                }}
              >
                Clear filters
              </Button>
            </PopoverContent>
          </Popover>
          {/* a date filter for the created_at column */}
          <DataTableDateFilter
            column={table.getColumn("created_at") as Column<Ticket>}
            title="Created At"
            multiple={true}
          />
          {/* reset fliters button */}
          {(selectedStatuses.length > 0 ||
            selectedPriorities.length > 0 ||
            selectedDepartments.length > 0 ||
            table.getColumn("created_at")?.getFilterValue() !== undefined) && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  // size="sm"
                  className="border-dashed"
                  onClick={() => {
                    table.getColumn("status")?.setFilterValue(null);
                    table.getColumn("priority")?.setFilterValue(null);
                    table.getColumn("department")?.setFilterValue(null);
                    table.getColumn("created_at")?.setFilterValue(null);
                  }}
                >
                  <CircleX className="h-4 w-4" />
                  Reset
                </Button>
              </PopoverTrigger>
            </Popover>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="border-dashed self-baseline"
            >
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
          <TableHeader className="bg-primary/30">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
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
      </div>
    </div>
  );
}
