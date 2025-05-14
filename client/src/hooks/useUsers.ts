import UserService from "@/services/users";
import { UserCreateFormValues, UserEditFormValues } from "@/validation/users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
      const response = await UserService.getDepartmentUsers(departmentId);
      return response;
    },
    enabled: !!departmentId,
  });
};

export const useUser = (id: number) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => UserService.getUser(id),
    enabled: !!id,
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: UserService.getAllUsers,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: UserCreateFormValues) => UserService.createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

export const useUpdateUser = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: UserEditFormValues) => {
      const data = await UserService.updateUser(user, userId);
      console.log(data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => UserService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

