import api from "@/lib/api";
import { User, UserResponse } from "@/types/auth";

const UserService = {
  getDepartmentUsers: async (departmentId: number) => {
    return await api<User[]>({
      method: "GET",
      url: `/users/department/${departmentId}`,
    });
  },

  getAllUsers: async () => {
    return await api<User[]>({
      method: "GET",
      url: "/users",
    });
  },

  createUser: async (user: User) => {
    return await api<UserResponse>({
      method: "POST",
      url: "/users",
      data: user,
    });
  },

  updateUser: async (user: User) => {
    return await api<UserResponse>({
      method: "PUT",
      url: `/users/${user.id}`,
      data: user,
    });
  },

  deleteUser: async (userId: number) => {
    return await api<{ message: string, success: boolean }>({
      method: "DELETE",
      url: `/users/${userId}`,
    });
  },
}

export default UserService;
