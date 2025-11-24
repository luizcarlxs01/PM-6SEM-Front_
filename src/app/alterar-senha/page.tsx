"use client";

import { FormEvent, useState } from "react";
import api from "../../services/api";
import { useAuthGuard } from "../../hooks/useAuthGuard";
import { Card } from "../../components/ui/Card";

interface ResponseModel<T> {
  dados: T;
  mensagem: string;
  status: boolean;
}

export default function AlterarSenhaPage() {
  const { isChecking } = useAuthGuard();

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMensagem(null);
    setErro(null);

    if (novaSenha !== confirmacaoSenha) {
      setErro("A confirmação da senha não confere.");
      return;
    }

    if (novaSenha.length < 8) {
      setErro("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post<ResponseModel<boolean>>(
        "/Usuarios/AlterarSenha",
        {
          senhaAtual,
          novaSenha,
        }
      );

      if (response.data.status) {
        setMensagem(response.data.mensagem || "Senha alterada com sucesso.");
        setSenhaAtual("");
        setNovaSenha("");
        setConfirmacaoSenha("");
      } else {
        setErro(response.data.mensagem || "Não foi possível alterar a senha.");
      }
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      setErro("Erro ao alterar a senha.");
    } finally {
      setLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  return (
    <div className="max-h-screen p-8 flex justify-center">
      <Card title="Alterar senha" description="Atualize sua senha de acesso.">
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="block text-sm mb-1">Senha atual</label>
            <input
              type="password"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              required
              className="w-full p-2 rounded bg-gray-800 text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Nova senha</label>
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
              className="w-full p-2 rounded bg-gray-800 text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Confirme a nova senha</label>
            <input
              type="password"
              value={confirmacaoSenha}
              onChange={(e) => setConfirmacaoSenha(e.target.value)}
              required
              className="w-full p-2 rounded bg-gray-800 text-white"
            />
          </div>

          {erro && <p className="text-red-400 text-sm">{erro}</p>}
          {mensagem && <p className="text-green-400 text-sm">{mensagem}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-black py-2 rounded hover:bg-green-500 transition disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Alterar senha"}
          </button>
        </form>
      </Card>
    </div>
  );
}
