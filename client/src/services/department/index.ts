import api from "@/lib/api";
import { Department, DepartmentResponse } from "@/types/department";
import { DepartmentFormValues } from "@/validation/departments";

const departmentService = {
  getAll: async () => {
    return await api<Department[]>({
      method: "GET",
      url: "/departments",
    });
  },

  getById: async (id: number) => {
    return await api<Department>({
      method: "GET",
      url: `/departments/${id}`,
    });
  },

  create: async (department: DepartmentFormValues): Promise<DepartmentResponse> => {
    return await api<DepartmentResponse>({
      method: "POST",
      url: "/departments",
      data: department,
    });
  },

  update: async (id: number, department: Pick<Department, "name">) => {
    return await api<DepartmentResponse>({
      method: "PUT",
      url: `/departments/${id}`,
      data: department,
    });
  },

  delete: async (id: number) => {
    return await api<DepartmentResponse>({
      method: "DELETE",
      url: `/departments/${id}`,
    });
  },
};

export default departmentService;
