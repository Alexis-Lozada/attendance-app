import api, { setTokens, clearTokens } from "./api";
import { LoginResponse } from "@/types/auth";

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>("/users/login", {
    email,
    password,
  });

  setTokens(data.accessToken, data.refreshToken);
  return data;
};

export const logout = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken) {
    await api.post("/users/logout", { refreshToken });
  }
  clearTokens();
};
