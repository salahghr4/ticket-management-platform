import { AuthProvider } from "@/context/AuthContext";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AppProvider;
