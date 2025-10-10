import axios from "axios";

// === URLs de microservicios ===
const USERS_API_URL = process.env.NEXT_PUBLIC_USERS_MS_URL!;
const ACADEMIC_API_URL = process.env.NEXT_PUBLIC_ACADEMIC_MS_URL!;
const STORAGE_API_URL = process.env.NEXT_PUBLIC_STORAGE_MS_URL!;

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

// === Interceptores globales para tokens ===
const apis = [usersApi, academicApi, storageApi];

apis.forEach((api) => {
  api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          originalRequest._retry = true;
          try {
            const { data } = await usersApi.post("/users/refresh-token", {
              refreshToken,
            });
            setTokens(data.accessToken, data.refreshToken);
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return api(originalRequest);
          } catch {
            clearTokens();
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
          }
        }
      }
      return Promise.reject(error);
    }
  );
});
