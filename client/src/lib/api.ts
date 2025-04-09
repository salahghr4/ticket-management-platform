import axiosClient, { AxiosError, AxiosRequestConfig } from "axios";
import storage from "./storage";

const axiosInstance = axiosClient.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = storage.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const api = async <T>(cfg: AxiosRequestConfig) => {
  try {
    const response = await axiosInstance.request<T>(cfg);
    return response.data as T;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response.data as T;
    }
    return { message: "An unknown error occurred" } as T;
  }
};

export default api;
