"use client";

// Tela que lista apenas as denúncias do usuário logado,
// usando o idUsuario salvo no localStorage e o token JWT para autenticação.

import { useEffect, useState } from "react";
import { useAuthGuard } from "../../../hooks/useAuthGuard";
import api from "../../../services/api";

interface ProblemaAcessibilidade {
  descricao: string;
}

interface Denuncia {
  idDenuncia: number;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  status: string;
  dataDenuncia: string;
  problemaAcessibilidade?: ProblemaAcessibilidade | null;
}

interface ResponseModel<T> {
  dados: T;
  mensagem: string;
  status: boolean;
}

export default function MinhasDenunciasPage() {
  const { isChecking } = useAuthGuard();
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isChecking) return;

    const carregarDenuncias = async () => {
      try {
        const idUsuario = localStorage.getItem("idUsuario");

        if (!idUsuario) {
          alert("Usuário não identificado. Faça login novamente.");
          return;
        }

        const response = await api.get<ResponseModel<Denuncia[]>>(
          `/Denuncias/BuscarDenunciasPorUsuario/${idUsuario}`
        );

        if (response.data.status && response.data.dados) {
          setDenuncias(response.data.dados);
        } else {
          console.warn("Resposta sem dados válidos:", response.data);
        }
      } catch (error) {
        console.error("Erro ao carregar suas denúncias:", error);
        alert("Erro ao carregar suas denúncias.");
      } finally {
        setLoading(false);
      }
    };

    carregarDenuncias();
  }, [isChecking]);

  if (isChecking || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Carregando suas denúncias...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Minhas denúncias</h1>

      {denuncias.length === 0 ? (
        <p>Você ainda não possui denúncias cadastradas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse mt-4">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-700 p-2 text-left">
                  Protocolo
                </th>
                <th className="border border-gray-700 p-2 text-left">
                  Logradouro
                </th>
                <th className="border border-gray-700 p-2 text-left">Bairro</th>
                <th className="border border-gray-700 p-2 text-left">
                  Cidade/UF
                </th>
                <th className="border border-gray-700 p-2 text-left">
                  Problema
                </th>
                <th className="border border-gray-700 p-2 text-left">Status</th>
                <th className="border border-gray-700 p-2 text-left">Data</th>
              </tr>
            </thead>
            <tbody>
              {denuncias.map((denuncia) => (
                <tr key={denuncia.idDenuncia} className="hover:bg-gray-900">
                  <td className="border border-gray-800 p-2">
                    {denuncia.idDenuncia}
                  </td>
                  <td className="border border-gray-800 p-2">
                    {denuncia.logradouro}, {denuncia.numero}
                  </td>
                  <td className="border border-gray-800 p-2">
                    {denuncia.bairro}
                  </td>
                  <td className="border border-gray-800 p-2">
                    {denuncia.cidade} / {denuncia.estado}
                  </td>
                  <td className="border border-gray-800 p-2">
                    {denuncia.problemaAcessibilidade?.descricao ?? "-"}
                  </td>
                  <td className="border border-gray-800 p-2">
                    {denuncia.status}
                  </td>
                  <td className="border border-gray-800 p-2">
                    {new Date(denuncia.dataDenuncia).toLocaleString("pt-BR")}
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
