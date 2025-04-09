import { AuthContextType, User } from "@/types/auth";
import { createContext, useState, useEffect } from "react";
import authService from "@/services/auth";
import storage from "@/lib/storage";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export default AuthContext;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => storage.get("user"));
  const [token, setToken] = useState<string | null>(() => storage.get("token"));

  // Sync state changes with storage
  useEffect(() => {
    if (user) {
      storage.set("user", user);
    } else {
      storage.remove("user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      storage.set("token", token);
    } else {
      storage.remove("token");
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const response = await authService.authenticateUser(email, password);
    if (response.user && response.token) {
      setUser(response.user);
      setToken(response.token);
      return { success: true, error: null };
    }
    return { success: false, error: response.message ?? "An unknown error occurred" };
  };

  const logout = async () => {
    try {
      await authService.deauthenticateUser();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      storage.remove("user");
      storage.remove("token");
      setUser(null);
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, setUser, setToken, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
