import api from "@/lib/api";
import { User, UserResponse } from "@/types/auth";
import { UserCreateFormValues, UserEditFormValues } from "@/validation/users";

const UserService = {
  getDepartmentUsers: async (departmentId: number) => {
    return await api<User[]>({
      method: "GET",
      url: `/users/department/${departmentId}`,
    });
  },

  getUser: async (userId: number) => {
    return await api<User>({
      method: "GET",
      url: `/users/${userId}`,
    });
  },

  getAllUsers: async () => {
    return await api<User[]>({
      method: "GET",
      url: "/users",
    });
  },

  createUser: async (user: UserCreateFormValues) => {
    return await api<UserResponse>({
      method: "POST",
      url: "/users",
      data: user,
    });
  },

  updateUser: async (user: UserEditFormValues, userId: number) => {
    return await api<UserResponse>({
      method: "PUT",
      url: `/users/${userId}`,
      data: user,
    });
  },

  deleteUser: async (userId: number) => {
    return await api<{ message: string; success: boolean }>({
      method: "DELETE",
      url: `/users/${userId}`,
    });
  },
};

export default UserService;
