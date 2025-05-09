import { useQuery } from "@tanstack/react-query";
import { getDepartmentUsers, getAllUsers } from "@/services/users";

// Query keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
  department: (departmentId: number) =>
    [...userKeys.all, "department", departmentId] as const,
};

// Hooks
export const useDepartmentUsers = (departmentId: number) => {
  return useQuery({
    queryKey: userKeys.department(departmentId),
    queryFn: async () => {
      const response = await getDepartmentUsers(departmentId);
      return response;
    },
    enabled: !!departmentId,
  });
};


export const useUsers = () => {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: getAllUsers,
  });
};
