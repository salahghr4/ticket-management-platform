export type AuthContextType = {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error: string | null }>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "employee" | "manager" | "technician";
  email_verified_at: Date | null;
  department_id: number | null;
  department?: Department;
  created_at: Date;
  updated_at: Date;
};

export type Department = {
  id: number;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
};

export type LoginResponse = {
  user?: User;
  token?: string;
  message?: string;
  errors?: string[];
  };

export type UserResponse = {
  message: string;
  user: User;
  success: boolean;
};
