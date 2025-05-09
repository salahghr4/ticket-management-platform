import { Department } from "@/types/auth";
import api from "@/lib/api";


const getDepartments = async () => {
  return await api<Department[]>({
    method: "GET",
    url: "/departments",
  });
};

export { getDepartments };
