import { useAuth } from "@/hooks/useAuth";
import { useDepartments, useDeleteDepartment } from "@/hooks/useDepartments";
import { Department } from "@/types/department";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import DataTable from "@/components/DataTale/DataTable";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft, Plus, Edit, Building } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTableColumnHeader from "@/components/DataTale/DataTableColumnHeader";
import { formatDate } from "@/lib/format";
import { addDays } from "date-fns";
import DepartmentCreateModal from "@/components/departments/DepartmentCreateModal";
import DepartmentEditModal from "@/components/departments/DepartmentEditModal";
import DepartmentDeleteModel from "@/components/departments/DepartmentDeleteModel";
const Departments = () => {
  const { data: departments, isLoading } = useDepartments();
  const { user } = useAuth();
  const { mutate: deleteDepartment } = useDeleteDepartment();
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const redirectUrl = state?.from || "/";
  const isAdmin = user?.role === "admin";
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  const handleDeleteDepartment = useCallback(
    (departmentId: number) => {
      toast.promise(
        new Promise((resolve, reject) => {
          deleteDepartment(departmentId, {
            onSuccess: () => resolve("Department deleted"),
            onError: () => reject("Error deleting department, please try again"),
          });
        }),
        {
          loading: "Deleting department...",
          success: () => `Department deleted`,
          error: "Error deleting department, please try again",
      });
    },
    [deleteDepartment]
  );

  const columns = useMemo<ColumnDef<Department>[]>(() => {
    const baseColumns: ColumnDef<Department>[] = [
      {
        accessorKey: "id",
        header: ({ column }) =>
          DataTableColumnHeader({
            column,
            header: "ID",
          }),
        cell: ({ row }) => (
          <span className="font-medium">{row.getValue("id")}</span>
        ),
      },
      {
        accessorKey: "name",
        header: ({ column }) =>
          DataTableColumnHeader({
            column,
            header: "Name",
          }),
        cell: ({ row }) => (
          <span className="font-medium">{row.getValue("name")}</span>
        ),
      },
      {
        accessorKey: "created_at",
        header: ({ column }) =>
          DataTableColumnHeader({
            column,
            header: "Created At",
          }),
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
            return (
              date.getTime() >= minDate && date.getTime() <= addDays(maxDate, 1)
            );
          }
          return date.getTime() >= value;
        },
      },
    ];

    if (isAdmin) {
      baseColumns.push({
        id: "actions",
        accessorKey: "id",
        header: () => <span className="text-center pl-3">Actions</span>,
        cell: ({ row }) => {
          const department = row.original;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="group h-8 w-8 p-0 hover:bg-yellow-500 hover:text-white dark:hover:bg-yellow-500 dark:hover:text-white"
                title="Edit Department"
                onClick={() => {
                  setSelectedDepartment(department);
                  setIsEditModalOpen(true);
                }}
              >
                <Edit className="h-4 w-4 text-yellow-500  group-hover:text-white" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="group h-8 w-8 p-0 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white"
                title="Delete Department"
                onClick={() => {
                  setSelectedDepartment(department);
                  setIsDeleteModalOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4 text-red-500 group-hover:text-white dark:text-red-500 dark:group-hover:text-white" />
              </Button>
            </div>
          );
        },
      });
    }

    return baseColumns;
  }, [isAdmin, setIsDeleteModalOpen, setSelectedDepartment]);

  return (
    <div className="min-h-screen w-full flex justify-center px-4 py-6">
      <div className="w-[95%] space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                navigate(redirectUrl, {
                  state: {
                    from: pathname,
                  },
                })
              }
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Building className="h-8 w-8 text-primary dark:text-primary-foreground" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Departments</h1>
              {isAdmin ? (
                <p className="text-muted-foreground text-sm sm:text-base">
                  Manage and track all system departments
                </p>
              ) : (
                <p className="text-muted-foreground text-sm sm:text-base">
                  View all departments
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            {isAdmin && (
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Department
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardHeader className="border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>All Departments</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-6">
            <DataTable
              data={departments ?? []}
              isLoading={isLoading}
              columns={columns}
              dataFor="departments"
              filterConfig={{
                showSearch: true,
                searchField: "name",
                showDateFilter: true,
              }}
            />
          </CardContent>
        </Card>
      </div>

      <DepartmentCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <DepartmentEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        department={selectedDepartment as Department}
      />
      <DepartmentDeleteModel
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        department={selectedDepartment as Department}
        onDelete={handleDeleteDepartment}
      />
    </div>
  );
};

export default Departments;
