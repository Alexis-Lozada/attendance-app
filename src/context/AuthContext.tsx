"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { login as loginService, logout as logoutService } from "@/services/auth.service";
import { User } from "@/types/user";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;          // loading por login/logout
  initializing: boolean;     // (loading inicial)
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const router = useRouter();

  // Cargar tokens y usuario del localStorage al iniciar
  useEffect(() => {
    const storedAccess = localStorage.getItem("accessToken");
    const storedRefresh = localStorage.getItem("refreshToken");
    const storedUser = localStorage.getItem("user");

    if (storedAccess && storedRefresh) {
      setAccessToken(storedAccess);
      setRefreshToken(storedRefresh);
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setInitializing(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user, accessToken, refreshToken } = await loginService(email, password);
      setUser(user);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutService();
    } catch (e) {
      console.warn("Error al cerrar sesión en backend:", e);
    }

    // Limpiar sesión
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("university");

    // Limpieza del tema
    localStorage.removeItem("themeColor");
    document.documentElement.style.setProperty("--primary-color", "#3B82F6");

    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        loading,
        initializing,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
