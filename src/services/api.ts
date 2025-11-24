// src/services/api.ts
// Serviço HTTP central da aplicação. Responsável por:
// - Definir a baseURL da API
// - Anexar automaticamente o token JWT (se existir) em todas as requisições
// - Tratar respostas 401 (não autorizado) e redirecionar para o login

import axios, { AxiosError } from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://localhost:7215"; // fallback local

const api = axios.create({
  baseURL, // ex: https://localhost:7215  ou  https://xxxx-xxx.ngrok-free.app
  headers: {
    "Content-Type": "application/json",
  },
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
        // Token inválido ou expirado
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
