import { DataTableDateFilter } from "@/components/DataTale/DataTableDateFilter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import { Table } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Ban,
  Circle,
  CircleCheck,
  CircleDot,
  CirclePlus,
  CircleX,
  Settings2,
  Timer,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

interface FilterConfig {
  showStatus?: boolean;
  showPriority?: boolean;
  showDepartment?: boolean;
  showDateFilter?: boolean;
  showSearch?: boolean;
  searchField?: string;
}

const DataTableFilters = <T extends object>({
  table,
  data,
  filterConfig = {
    showStatus: true,
    showPriority: true,
    showDepartment: true,
    showDateFilter: true,
    showSearch: true,
    searchField: "title",
  },
}: {
  table: Table<T>;
  data: T[];
  filterConfig?: FilterConfig;
}) => {
  const [statusPopoverOpen, setStatusPopoverOpen] = useState(false);
  const [priorityPopoverOpen, setPriorityPopoverOpen] = useState(false);
  const [departmentPopoverOpen, setDepartmentPopoverOpen] = useState(false);

  const departmentOptions = useMemo(() => {
    if (!filterConfig.showDepartment) return [];

    // map over departments and return unique departments
    return data
      .filter(
        (item): item is T & { department: { id: number; name: string } } =>
          "department" in item &&
          typeof item.department === "object" &&
          item.department !== null &&
          "id" in item.department &&
          "name" in item.department
      )
      .map((item) => item.department)
      .filter(
        (department, index, self) =>
          index === self.findIndex((t) => t.id === department.id)
      );
  }, [data, filterConfig.showDepartment]);

  const statusOptions = [
    {
      label: "Open",
      value: "open",
      icon: (
        <CircleDot
          size={16}
          className="text-gray-500"
        />
      ),
    },
    {
      label: "In Progress",
      value: "in progress",
      icon: (
        <Timer
          size={16}
          className="text-gray-500"
        />
      ),
    },
    {
      label: "Resolved",
      value: "resolved",
      icon: (
        <CircleCheck
          size={16}
          className="text-gray-500"
        />
      ),
    },
    {
      label: "Closed",
      value: "closed",
      icon: (
        <Circle
          size={16}
          className="text-gray-500"
        />
      ),
    },
    {
      label: "Rejected",
      value: "rejected",
      icon: (
        <Ban
          size={16}
          className="text-gray-500"
        />
      ),
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

  const selectedStatuses = filterConfig.showStatus
    ? (table.getColumn("status")?.getFilterValue() as string[]) || []
    : [];
  const selectedPriorities = filterConfig.showPriority
    ? (table.getColumn("priority")?.getFilterValue() as string[]) || []
    : [];
  const selectedDepartments = filterConfig.showDepartment
    ? (table.getColumn("department")?.getFilterValue() as string[]) || []
    : [];

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap flex-1">
        {filterConfig.showSearch && filterConfig.searchField && (
          <Input
            placeholder="Filter..."
            value={
              (table
                .getColumn(filterConfig.searchField)
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) => {
              const column = table.getColumn(filterConfig.searchField!);
              if (column) {
                column.setFilterValue(event.target.value);
              }
            }}
            className="max-w-sm"
          />
        )}

        {filterConfig.showStatus && (
          <Popover
            open={statusPopoverOpen}
            onOpenChange={setStatusPopoverOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="border-dashed"
              >
                {selectedStatuses.length > 0 ? (
                  <div
                    role="button"
                    aria-label={`Clear Status filter`}
                    tabIndex={0}
                    onClick={(e) => {
                      e.preventDefault();
                      table.getColumn("status")?.setFilterValue(undefined);
                      setStatusPopoverOpen(false);
                    }}
                    className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <XCircle />
                  </div>
                ) : (
                  <CirclePlus />
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
                  className="group flex items-center gap-4 px-2 rounded-sm text-sm hover:bg-accent cursor-pointer py-1.5 overflow-y-auto overflow-x-hidden"
                >
                  <div className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      id={status.value}
                      className="border-gray-400 group-hover:border-gray-500"
                      checked={selectedStatuses.includes(status.value)}
                      onCheckedChange={(checked) => {
                        const newFilterValues = checked
                          ? [...selectedStatuses, status.value]
                          : selectedStatuses.filter(
                              (val) => val !== status.value
                            );

                        table
                          .getColumn("status")
                          ?.setFilterValue(
                            newFilterValues.length > 0
                              ? newFilterValues
                              : undefined
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
                      data.filter(
                        (item): item is T & { status: string } =>
                          "status" in item && item.status === status.value
                      ).length
                    }
                  </span>
                </label>
              ))}
              <Separator className="my-1" />
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  table.getColumn("status")?.setFilterValue(undefined);
                  setStatusPopoverOpen(false);
                }}
              >
                Clear filters
              </Button>
            </PopoverContent>
          </Popover>
        )}

        {filterConfig.showPriority && (
          <Popover
            open={priorityPopoverOpen}
            onOpenChange={setPriorityPopoverOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="border-dashed"
              >
                {selectedPriorities.length > 0 ? (
                  <div
                    role="button"
                    aria-label={`Clear Priority filter`}
                    tabIndex={0}
                    onClick={(e) => {
                      e.preventDefault();
                      table.getColumn("priority")?.setFilterValue(undefined);
                      setPriorityPopoverOpen(false);
                    }}
                  >
                    <XCircle />
                  </div>
                ) : (
                  <CirclePlus />
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
                  className="group flex items-center gap-4 px-2 rounded-sm text-sm hover:bg-accent cursor-pointer py-1.5 overflow-y-auto overflow-x-hidden"
                >
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      id={priority.value}
                      className="border-gray-400 group-hover:border-gray-500"
                      checked={selectedPriorities.includes(priority.value)}
                      onCheckedChange={(checked) => {
                        const newFilterValues = checked
                          ? [...selectedPriorities, priority.value]
                          : selectedPriorities.filter(
                              (val) => val !== priority.value
                            );

                        table
                          .getColumn("priority")
                          ?.setFilterValue(
                            newFilterValues.length > 0
                              ? newFilterValues
                              : undefined
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
                  table.getColumn("priority")?.setFilterValue(undefined);
                  setPriorityPopoverOpen(false);
                }}
              >
                Clear filters
              </Button>
            </PopoverContent>
          </Popover>
        )}

        {filterConfig.showDepartment && (
          <Popover
            open={departmentPopoverOpen}
            onOpenChange={setDepartmentPopoverOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="border-dashed"
              >
                {selectedDepartments.length > 0 ? (
                  <div
                    role="button"
                    aria-label={`Clear Department filter`}
                    tabIndex={0}
                    onClick={(e) => {
                      e.preventDefault();
                      table.getColumn("department")?.setFilterValue(undefined);
                      setDepartmentPopoverOpen(false);
                    }}
                  >
                    <XCircle />
                  </div>
                ) : (
                  <CirclePlus />
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
                  className="group flex items-center gap-4 px-2 rounded-sm text-sm hover:bg-accent cursor-pointer py-1.5 overflow-y-auto overflow-x-hidden"
                >
                  <Checkbox
                    id={department.name}
                    className="border-gray-400 group-hover:border-gray-500"
                    checked={selectedDepartments.includes(department.name)}
                    onCheckedChange={(checked) => {
                      const newFilterValues = checked
                        ? [...selectedDepartments, department.name]
                        : selectedDepartments.filter(
                            (val) => val !== department.name
                          );

                      table
                        .getColumn("department")
                        ?.setFilterValue(
                          newFilterValues.length > 0
                            ? newFilterValues
                            : undefined
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
                  table.getColumn("department")?.setFilterValue(undefined);
                  setDepartmentPopoverOpen(false);
                }}
              >
                Clear filters
              </Button>
            </PopoverContent>
          </Popover>
        )}

        {filterConfig.showDateFilter && (
          <DataTableDateFilter
            column={table.getColumn("created_at")!}
            title="Created At"
            multiple={true}
          />
        )}

        {(table.getColumn("status")?.getFilterValue() !== undefined ||
          table.getColumn("priority")?.getFilterValue() !== undefined ||
          table.getColumn("department")?.getFilterValue() !== undefined ||
          table.getColumn("created_at")?.getFilterValue() !== undefined) && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="border-dashed"
                onClick={() => {
                  table.getColumn("status")?.setFilterValue(undefined);
                  table.getColumn("priority")?.setFilterValue(undefined);
                  table.getColumn("department")?.setFilterValue(undefined);
                  table.getColumn("created_at")?.setFilterValue(undefined);
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
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default DataTableFilters;
