import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api";

// Tokens en memoria (puedes moverlos a context si quieres)
let accessToken: string | null = null;
let refreshToken: string | null = null;

export const setTokens = (newAccess: string, newRefresh: string) => {
  accessToken = newAccess;
  refreshToken = newRefresh;

  localStorage.setItem("accessToken", newAccess);
  localStorage.setItem("refreshToken", newRefresh);
};

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// Cargamos tokens guardados al iniciar
if (typeof window !== "undefined") {
  accessToken = localStorage.getItem("accessToken");
  refreshToken = localStorage.getItem("refreshToken");
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir accessToken en cada request
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Interceptor para refrescar token si expira
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && refreshToken) {
      try {
        const { data } = await axios.post(`${API_BASE_URL}/users/refresh-token`, {
          refreshToken,
        });

        setTokens(data.accessToken, data.refreshToken);

        // Reintenta la petición original con el nuevo token
        error.config.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(error.config);
      } catch (refreshError) {
        clearTokens();
        window.location.href = "/login"; // Redirige al login
      }
    }
    return Promise.reject(error);
  }
);

export default api;
