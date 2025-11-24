"use client";

// Tela de listagem de usuários do sistema.
// Requer autenticação via useAuthGuard.

import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAdminGuard } from "../../hooks/useAdminGuard";

interface Usuario {
  idUsuario: number;
  nome: string;
  email: string;
  telefone: string;
  dataCadastro: string;
}

interface ResponseModel<T> {
  dados: T;
  mensagem: string;
  status: boolean;
}

export default function UsuariosPage() {
  const { isChecking } = useAdminGuard();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isChecking) return;

    const carregarUsuarios = async () => {
      try {
        const response = await api.get<ResponseModel<Usuario[]>>(
          "/Usuarios/ListarUsuarios"
        );

        if (response.data.status && response.data.dados) {
          setUsuarios(response.data.dados);
        }
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        alert("Erro ao carregar lista de usuários.");
      } finally {
        setLoading(false);
      }
    };

    carregarUsuarios();
  }, [isChecking]);

  if (isChecking || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Carregando usuários...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Lista de Usuários</h1>

      {usuarios.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse mt-4">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-700 p-2 text-left">Nome</th>
                <th className="border border-gray-700 p-2 text-left">E-mail</th>
                <th className="border border-gray-700 p-2 text-left">
                  Telefone
                </th>
                <th className="border border-gray-700 p-2 text-left">
                  Data de cadastro
                </th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.idUsuario} className="hover:bg-gray-900">
                  <td className="border border-gray-800 p-2">{usuario.nome}</td>
                  <td className="border border-gray-800 p-2">
                    {usuario.email}
                  </td>
                  <td className="border border-gray-800 p-2">
                    {usuario.telefone}
                  </td>
                  <td className="border border-gray-800 p-2">
                    {new Date(usuario.dataCadastro).toLocaleString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
