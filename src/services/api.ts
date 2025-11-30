import axios from "axios";

// API GATEWAY
const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL!;

// === Helpers para tokens ===
export const getAccessToken = () => {
  if (typeof window !== "undefined") return localStorage.getItem("accessToken");
  return null;
};

export const getRefreshToken = () => {
  if (typeof window !== "undefined") return localStorage.getItem("refreshToken");
  return null;
};

export const setTokens = (access: string, refresh: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
  }
};

export const clearTokens = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};

// Instancia única
export const api = axios.create({
  baseURL: API_GATEWAY_URL,
  headers: { "Content-Type": "application/json" },
});

// === Interceptores globales para tokens ===
const apis = [api];

apis.forEach((instance) => {
  instance.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Evitar loops
      if (!originalRequest) return Promise.reject(error);

      // Refresh cuando 401 (y opcional 403 si tu backend lo devuelve así)
      const shouldRefresh =
        (error.response?.status === 401 || error.response?.status === 403) &&
        !originalRequest._retry;

      if (shouldRefresh) {
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
          clearTokens();
          if (typeof window !== "undefined") window.location.href = "/login";
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
          const { data } = await api.post("/auth/refresh", { refreshToken });

          setTokens(data.accessToken, data.refreshToken);

          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return instance(originalRequest);
        } catch (e) {
          clearTokens();
          if (typeof window !== "undefined") window.location.href = "/login";
          return Promise.reject(e);
        }
      }

      // Manejo errores de negocio
      if (error.response?.data) {
        const errorData = error.response.data;

        const errorMessage =
          errorData.error ||
          errorData.message ||
          (typeof errorData === "string" ? errorData : null) ||
          "Error desconocido";

        const businessLogicError = new Error(errorMessage);
        (businessLogicError as any).status = error.response.status;
        (businessLogicError as any).response = error.response;
        (businessLogicError as any).isBusinessLogicError = true;

        return Promise.reject(businessLogicError);
      }

      return Promise.reject(error);
    }
  );
});
