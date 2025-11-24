"use client";

/**
 * Tela de login do sistema.
 * - Envia email e senha para a API.
 * - Exibe mensagens amigáveis de erro/sucesso.
 * - Salva token, idUsuario e perfil no localStorage.
 * - Dispara evento global "auth-change" para Navbar reagir.
 * - Redireciona para a página inicial ("/") após login.
 */

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../services/api";
import { Card } from "../../components/ui/Card";

interface LoginResponseDTO {
  idUsuario: number;
  nome: string;
  email: string;
  perfil: string;
  token: string;
}

interface ResponseModel<T> {
  dados: T;
  mensagem: string;
  status: boolean;
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senhaHash, setSenhaHash] = useState("");

  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setErro(null);
    setSucesso(null);

    if (!email.trim() || !senhaHash.trim()) {
      setErro("Preencha o e-mail e a senha para continuar.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        email: email.trim(),
        senhaHash: senhaHash.trim(),
      };

      console.log("Enviando para API (login):", payload);

      const response = await api.post<ResponseModel<LoginResponseDTO>>(
        "/Usuarios/Login",
        payload
      );

      const data = response.data;

      if (!data.status || !data.dados) {
        setErro(data.mensagem || "Usuário ou senha inválidos.");
        return;
      }

      // Salva dados de autenticação
      localStorage.setItem("token", data.dados.token);
      localStorage.setItem("idUsuario", String(data.dados.idUsuario));
      localStorage.setItem("perfil", data.dados.perfil || "Cidadao");

      // Notifica toda a aplicação que o estado de auth mudou
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth-change"));
      }

      setSucesso("Login realizado com sucesso! Redirecionando...");
      setErro(null);

      // Redireciona para a tela inicial do portal
      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);

      if (error.response?.data?.mensagem) {
        setErro(error.response.data.mensagem);
      } else {
        setErro("Erro ao tentar fazer login. Tente novamente mais tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card
          title="Entrar"
          description="Acesse o portal para registrar e acompanhar suas denúncias de acessibilidade."
        >
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm mb-1" htmlFor="email">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm mb-1" htmlFor="senha">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                placeholder="Sua senha"
                value={senhaHash}
                onChange={(e) => setSenhaHash(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                autoComplete="current-password"
              />
            </div>

            {erro && <p className="text-sm text-red-400">{erro}</p>}
            {sucesso && <p className="text-sm text-green-400">{sucesso}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-black font-semibold py-2 rounded hover:bg-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <p className="text-xs text-gray-400 mt-2 text-center">
              Ainda não tem cadastro?{" "}
              <a
                href="/cadastro"
                className="text-green-400 hover:underline font-medium"
              >
                Criar conta
              </a>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
