import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api";

// obtener los tokens directamente de localStorage cuando sea necesario
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

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el accessToken en cada request
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para refrescar token automáticamente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        originalRequest._retry = true;
        try {
          const { data } = await axios.post(`${API_BASE_URL}/users/refresh-token`, {
            refreshToken,
          });

          // Guardamos los nuevos tokens
          setTokens(data.accessToken, data.refreshToken);

          // Reintentamos la petición original con el nuevo accessToken
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          clearTokens();
          if (typeof window !== "undefined") {
            window.location.href = "/login"; // Redirige al login
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
