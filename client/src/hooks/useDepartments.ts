import { getDepartments } from "@/services/department";
import { useQuery } from "@tanstack/react-query";


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
    queryFn: getDepartments,
  });
};  
