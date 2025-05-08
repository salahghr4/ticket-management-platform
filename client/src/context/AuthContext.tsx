import { AuthContextType } from "@/types/auth";
import { createContext, useState, useLayoutEffect } from "react";
import storage from "@/lib/storage";
import { useMe, useLogin, useLogout } from "@/hooks/useAuth";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export default AuthContext;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    () => storage.get("token") as string | null
  );
  const { data: user, isLoading } = useMe(token);
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  useLayoutEffect(() => {
    const storedToken = storage.get("token");
    if (storedToken) {
      setToken(storedToken as string);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await loginMutation.mutateAsync({ email, password });
      if (result.token) {
        setToken(result.token);
      }
      return { success: true, error: null };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        token,
        setUser: () => {}, // This is now handled by React Query
        setToken,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
