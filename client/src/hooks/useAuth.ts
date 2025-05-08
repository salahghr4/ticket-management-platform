import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";

import AuthContext from "@/context/AuthContext";
import storage from "@/lib/storage";
import authService from "@/services/auth";
import { User } from "@/types/auth";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Query keys
export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

// Hooks
export const useMe = (token: string | null) => {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      const response = await authService.getMe();
      if ((response as { message: string }).message === "Unauthenticated.") {
        throw new Error("Unauthenticated");
      } else if (!response) {
        throw new Error("An unknown error occurred");
      }
      return response as User;
    },
    enabled: !!token,
    staleTime: Infinity,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const response = await authService.authenticateUser(email, password);
      if (response.user && response.token) {
        storage.set("user", response.user);
        storage.set("token", response.token);
        return response;
      }
      throw new Error(response.message ?? "An unknown error occurred");
    },
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.me(), data.user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        await authService.deauthenticateUser();
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        storage.remove("user");
        storage.remove("token");
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(authKeys.me(), null);
    },
  });
};
