import api from "@/lib/api";
import { LoginResponse } from "@/types/auth";

const authenticateUser = async (email: string, password: string) => {
  return await api<LoginResponse>({
    method: "POST",
    url: "/login",
    data: { email, password },
  });
};

const deauthenticateUser = async () => {
  return await api<LoginResponse>({
    method: "POST",
    url: "/logout",
  });
};

const getMe = async () => {
  return await api<LoginResponse>({
    method: "GET",
    url: "/me",
  });
};

export default { authenticateUser, deauthenticateUser,  getMe};
