import axiosClient, { AxiosRequestConfig } from "axios";
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

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.remove("token");
      storage.remove("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const api = async <TData>(cfg: AxiosRequestConfig): Promise<TData> => {
    const response = await axiosInstance.request<TData>(cfg);
    return response.data as TData;
};

export default api;
