import axios from "axios";

// API GATEWAY
const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL!;

// ✅ extender config para usar _retry sin pelear con TS
declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

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

// Instancia principal (con interceptores)
export const api = axios.create({
  baseURL: API_GATEWAY_URL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Instancia SOLO para auth/refresh (SIN interceptores) -> evita loop infinito
const authApi = axios.create({
  baseURL: API_GATEWAY_URL,
  headers: { "Content-Type": "application/json" },
});

// ✅ helper: detectar endpoints donde NO se debe refrescar
const isAuthEndpoint = (url?: string) => {
  if (!url) return false;
  return (
    url.includes("/auth/login") ||
    url.includes("/auth/refresh") ||
    url.includes("/auth/logout")
  );
};

// ✅ lock de refresh para evitar múltiples refresh simultáneos
let refreshPromise: Promise<{ accessToken: string; refreshToken: string }> | null = null;

// === Interceptores globales para tokens ===
const apis = [api];

apis.forEach((instance) => {
  instance.interceptors.request.use((config) => {
    const token = getAccessToken();

    // si ya trae Authorization, no lo pisamos
    if (token && !config.headers?.Authorization) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error?.config;

      if (!originalRequest) return Promise.reject(error);

      const status = error?.response?.status;

      // ✅ NO refrescar si el error viene de login/refresh/logout
      if ((status === 401 || status === 403) && isAuthEndpoint(originalRequest.url)) {
        // para login: simplemente deja que caiga al manejo "negocio" abajo
        // para refresh: también evita recursión
      } else {
        const shouldRefresh =
          (status === 401 || status === 403) && !originalRequest._retry;

        if (shouldRefresh) {
          const refreshToken = getRefreshToken();

          if (!refreshToken) {
            clearTokens();
            if (typeof window !== "undefined") window.location.href = "/login";
            return Promise.reject(error);
          }

          originalRequest._retry = true;

          try {
            // ✅ si no hay refresh en curso, lo creamos
            if (!refreshPromise) {
              refreshPromise = authApi
                .post("/auth/refresh", { refreshToken })
                .then((res) => res.data)
                .finally(() => {
                  refreshPromise = null;
                });
            }

            const data = await refreshPromise;

            setTokens(data.accessToken, data.refreshToken);

            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

            return instance(originalRequest);
          } catch (e) {
            clearTokens();
            if (typeof window !== "undefined") window.location.href = "/login";
            return Promise.reject(e);
          }
        }
      }

      // Manejo errores de negocio (incluye: {"error":"Invalid credentials"})
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
