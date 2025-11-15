import { usersApi, setTokens, clearTokens } from "@/services/api";
import { LoginResponse } from "@/types/auth";

/**
 * Inicia sesión con email y password
 * Usa el microservicio users-ms (puerto 8081)
 */
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const { data } = await usersApi.post<LoginResponse>("/auth/login", { email, password });

  // Guarda los tokens en localStorage
  setTokens(data.accessToken, data.refreshToken);

  return data;
};

/**
 * Cierra sesión y limpia tokens
 * Llama al endpoint de logout del users-ms
 */
export const logout = async (): Promise<void> => {
  const refreshToken = localStorage.getItem("refreshToken");

  try {
    if (refreshToken) {
      await usersApi.post("/auth/logout", { refreshToken });
    }
  } catch (error) {
    console.warn("Error al cerrar sesión en backend:", error);
  } finally {
    clearTokens();
  }
};
