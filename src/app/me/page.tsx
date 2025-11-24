"use client";

import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuthGuard } from "../../hooks/useAuthGuard";
import { Card } from "../../components/ui/Card";

interface Usuario {
  idUsuario: number;
  nome: string;
  email: string;
  telefone: string;
  perfil: string;
  dataCadastro: string;
}

interface ResponseModel<T> {
  dados: T;
  mensagem: string;
  status: boolean;
}

export default function MePage() {
  const { isChecking } = useAuthGuard();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isChecking) return;

    const carregar = async () => {
      try {
        const response = await api.get<ResponseModel<Usuario>>("/Usuarios/Me");

        if (response.data.status && response.data.dados) {
          setUsuario(response.data.dados);
        } else {
          alert(response.data.mensagem || "Não foi possível carregar seus dados.");
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        alert("Erro ao carregar seus dados.");
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, [isChecking]);

  if (isChecking || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando seus dados...
      </div>
    );
  }

  if (!usuario) {
    return <div className="min-h-screen p-8">Nenhuma informação encontrada.</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Meus dados</h1>

      <Card>
        <p>
          <span className="font-semibold">Nome:</span> {usuario.nome}
        </p>
        <p>
          <span className="font-semibold">E-mail:</span> {usuario.email}
        </p>
        <p>
          <span className="font-semibold">Telefone:</span> {usuario.telefone}
        </p>
        <p>
          <span className="font-semibold">Perfil:</span> {usuario.perfil}
        </p>
        <p>
          <span className="font-semibold">Cadastrado em:</span>{" "}
          {new Date(usuario.dataCadastro).toLocaleString("pt-BR")}
        </p>
      </Card>
    </div>
  );
}
