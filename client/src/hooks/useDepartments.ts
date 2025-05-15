import departmentService from "@/services/department";
import { Department } from "@/types/department";
import { DepartmentFormValues } from "@/validation/departments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys
export const departmentKeys = {
  all: ["departments"] as const,
  lists: () => [...departmentKeys.all, "list"] as const,
  list: (filters: string) => [...departmentKeys.lists(), { filters }] as const,
};

// Hooks
export const useDepartments = () => {
  return useQuery({
    queryKey: departmentKeys.lists(),
    queryFn: departmentService.getAll,
  });
};

export const useDepartmentById = (id: number) => {
  return useQuery({
    queryKey: departmentKeys.list(id.toString()),
    queryFn: () => departmentService.getById(id),
    enabled: !!id,
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (department: DepartmentFormValues) => departmentService.create(department),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (department: Department) =>
      departmentService.update(department.id, department),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => departmentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
};
