import DataTable from "@/components/DataTale/DataTable";
import getUsersTableColumns from "@/components/DataTale/UsersTableColumns";
import { useUsers } from "@/hooks/useUsers";
import { User } from "@/types/auth";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

const UsersTable = () => {
  const { data: usersData, isLoading } = useUsers();

  const columns: ColumnDef<User>[] = useMemo(() => getUsersTableColumns(), []);
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
