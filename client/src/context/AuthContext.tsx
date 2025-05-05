import { AuthContextType, User } from "@/types/auth";
import { createContext, useState, useLayoutEffect, useEffect } from "react";
import authService from "@/services/auth";
import storage from "@/lib/storage";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export default AuthContext;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => storage.get("user"));
  const [token, setToken] = useState<string | null>(() => storage.get("token"));
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    const token = storage.get("token");
    if (token) {
      setToken(token as string);
    }
    setIsLoading(false);
  }, [token]);

  useEffect(() => {
    const getUser = async () => {
      if (token) {
        const response = await authService.getMe();
        if (response.message === "Unauthenticated.") {
          logout();
        }
        setUser(user);
      }
    };
    getUser();
  }, [user, token]);

  const login = async (email: string, password: string) => {
    const response = await authService.authenticateUser(email, password);
    if (response.user && response.token) {
      setUser(response.user);
      setToken(response.token);
      storage.set("user", response.user);
      storage.set("token", response.token);
      return { success: true, error: null };
    }
    return {
      success: false,
      error: response.message ?? "An unknown error occurred",
    };
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.deauthenticateUser();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      storage.remove("user");
      storage.remove("token");
      setUser(null);
      setToken(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, setUser, setToken, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
