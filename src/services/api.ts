import axios from "axios";

// === URLs de microservicios ===
const USERS_API_URL = process.env.NEXT_PUBLIC_USERS_MS_URL!;
const ACADEMIC_API_URL = process.env.NEXT_PUBLIC_ACADEMIC_MS_URL!;
const STORAGE_API_URL = process.env.NEXT_PUBLIC_STORAGE_MS_URL!;
const CHAT_API_URL = process.env.NEXT_PUBLIC_CHAT_MS_URL!;
const ATTENDANCE_API_URL = process.env.NEXT_PUBLIC_ATTENDANCE_MS_URL!;

// === Helpers para tokens ===
export const getAccessToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

export const getRefreshToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("refreshToken");
  }
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

// === Instancias Axios por microservicio ===
export const usersApi = axios.create({
  baseURL: USERS_API_URL,
  headers: { "Content-Type": "application/json" },
});

export const academicApi = axios.create({
  baseURL: ACADEMIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

export const storageApi = axios.create({
  baseURL: STORAGE_API_URL,
  headers: { "Content-Type": "application/json" },
});

export const chatApi = axios.create({
  baseURL: CHAT_API_URL,
  headers: { "Content-Type": "application/json" },
});

export const attendanceApi = axios.create({
  baseURL: ATTENDANCE_API_URL,
  headers: { "Content-Type": "application/json" },
});

// === Interceptores globales para tokens ===
const apis = [usersApi, academicApi, storageApi, chatApi, attendanceApi];

apis.forEach((api) => {
  api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // Manejo de errores de autenticación (solo 401 y 403 para refresh token)
      if (error.response?.status === 401 || (error.response?.status === 403 && !originalRequest._retry)) {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          originalRequest._retry = true;
          try {
            const { data } = await usersApi.post("/auth/refresh-token", { refreshToken });
            setTokens(data.accessToken, data.refreshToken);
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return api(originalRequest);
          } catch {
            clearTokens();
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
          }
        } else {
          // Sin refresh token, redirigir al login
          clearTokens();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }

      // Manejo de errores de negocio (400, 404, etc.)
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Extraer mensaje de diferentes formatos posibles
        const errorMessage = 
          errorData.error || 
          errorData.message || 
          (typeof errorData === 'string' ? errorData : null) ||
          'Error desconocido';

        const businessLogicError = new Error(errorMessage);
        
        // Mantener información adicional del error original
        (businessLogicError as any).status = error.response.status;
        (businessLogicError as any).response = error.response;
        (businessLogicError as any).isBusinessLogicError = true;
        
        return Promise.reject(businessLogicError);
      }

      return Promise.reject(error);
    }
  );
});
