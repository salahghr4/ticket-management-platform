import api from "@/lib/api";
import { LoginResponse, User } from "@/types/auth";

const authenticateUser = async (email: string, password: string): Promise<LoginResponse> => {
  return await api<LoginResponse>({
    method: "POST",
    url: "/login",
    data: { email, password },
  });
};

const deauthenticateUser = async ()=> {
  return await api<LoginResponse>({
    method: "POST",
    url: "/logout",
  });
};

const getMe = async () => {
  return await api<User | { message: string }>({
    method: "GET",
    url: "/me",
  });
};

export default { authenticateUser, deauthenticateUser,  getMe};
