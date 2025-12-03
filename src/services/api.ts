// src/services/api.ts
import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://pm-6sem-2025-d6gdgjhjg7b3f5dm.brazilsouth-01.azurewebsites.net/swagger/index.html",
});
// Interceptor de requisição: adiciona Authorization: Bearer <token>
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// Interceptor de resposta: se der 401, limpa token e redireciona para /login
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (typeof window !== "undefined") {
      const status = error.response?.status;

      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("idUsuario");

        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
