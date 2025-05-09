import api from "@/lib/api";
import { User } from "@/types/auth";

const getDepartmentUsers = async (departmentId: number) => {
  const response = await api<User[]>({
    method: "GET",
    url: `/users/department/${departmentId}`,
  });
  return response;
};

const getAllUsers = async () => {
  const response = await api<User[]>({
    method: "GET",
    url: "/users",
  });
  return response;
};

export { getDepartmentUsers, getAllUsers };

