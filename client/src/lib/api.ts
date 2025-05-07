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

const api = async <TData>(cfg: AxiosRequestConfig) => {
  try {
    const response = await axiosInstance.request<TData>(cfg);
    return response.data as TData;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response.data as TData;
    }
    return { message: "An unknown error occurred, please try again later", success: false };
  }
};

export default api;
