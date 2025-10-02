"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login as loginService, logout as logoutService } from "@/services/auth.service";
import { User } from "@/types/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user } = await loginService(email, password);
      setUser(user);
      router.push("/");
    } catch (error) {
      console.error("Error en login", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutService();
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  return { user, loading, login, logout };
}
