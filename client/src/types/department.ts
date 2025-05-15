export type Department = {
  id: number;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
};

export type DepartmentResponse = {
  message: string;
  department: Department;
  success: boolean;
};

