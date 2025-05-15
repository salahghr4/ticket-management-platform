import DataTable from "@/components/DataTale/DataTable";
import getUsersTableColumns from "@/components/DataTale/UsersTableColumns";
import { useAuth } from "@/hooks/useAuth";
import { useDeleteUser, useUsers } from "@/hooks/useUsers";
import { User } from "@/types/auth";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";

const UsersTable = () => {
  const { data: usersData, isLoading } = useUsers();
  const { user } = useAuth();
  const { mutate: deleteUser } = useDeleteUser();

  const handleDeleteUser = useCallback(
    (userId: number) => {
      toast.promise(Promise.resolve(deleteUser(userId)), {
        loading: "Deleting user...",
        success: () => `User deleted`,
        error: "Error deleting user, please try again",
      });
    },
    [deleteUser]
  );

  const columns: ColumnDef<User>[] = useMemo(
    () =>
      getUsersTableColumns({
        handleDeleteUser,
        AuthUser: user,
      }),
    [user, handleDeleteUser]
  );
  return (
    <DataTable
      data={usersData ?? []}
      isLoading={isLoading}
      columns={columns}
      dataFor="users"
      filterConfig={{
        showSearch: true,
        showStatus: false,
        showPriority: false,
        showDepartment: true,
        showDateFilter: true,
        searchField: "name",
        showRole: true,
      }}
    />
  );
};

export default UsersTable;
