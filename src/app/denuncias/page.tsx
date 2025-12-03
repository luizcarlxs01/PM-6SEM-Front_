"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "@/utils/authHeaders";

type Denuncia = {
  idDenuncia: number;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
  status: string;
  protocoloPrefeitura?: string | null;
  dataDenuncia: string;
};

const API_BASE_URL = "https://pm-6sem-2025-d6gdgjhjg7b3f5dm.brazilsouth-01.azurewebsites.net/"; // API está nessa porta

export default function DenunciasPage() {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // estados para edição inline
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<string>("");
  const [editProtocolo, setEditProtocolo] = useState<string>("");

  async function carregarDenuncias() {
    try {
      setLoading(true);
      setErro(null);

      const resp = await axios.get(
        `${API_BASE_URL}/api/Denuncias/ListarDenuncias`,
        {
          headers: getAuthHeaders(), // se o endpoint for público, isso não atrapalha
        }
      );

      // Seu ResponseModel: { dados, mensagem, status }
      const lista: Denuncia[] = resp.data.dados ?? [];
      setDenuncias(lista);
    } catch (e: any) {
      console.error(e);
      setErro("Erro ao carregar denúncias.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDenuncias();
  }, []);

  function iniciarEdicao(denuncia: Denuncia) {
    setEditingId(denuncia.idDenuncia);
    setEditStatus(denuncia.status ?? "");
    setEditProtocolo(denuncia.protocoloPrefeitura ?? "");
  }

  function cancelarEdicao() {
    setEditingId(null);
    setEditStatus("");
    setEditProtocolo("");
  }

  async function salvarEdicao(idDenuncia: number) {
    try {
      await axios.put(
        `${API_BASE_URL}/api/Denuncias/AtualizarDenuncia`,
        {
          idDenuncia,
          protocoloPrefeitura: editProtocolo,
          status: editStatus,
        },
        {
          headers: getAuthHeaders(), // envia Bearer token
        }
      );

      // Atualiza localmente para não precisar recarregar tudo
      setDenuncias((prev) =>
        prev.map((d) =>
          d.idDenuncia === idDenuncia
            ? {
                ...d,
                status: editStatus,
                protocoloPrefeitura: editProtocolo,
              }
            : d
        )
      );

      cancelarEdicao();
    } catch (e: any) {
      console.error(e);
      alert("Erro ao atualizar denúncia.");
    }
  }

  async function excluirDenuncia(idDenuncia: number) {
    const confirma = confirm(
      `Tem certeza que deseja excluir a denúncia #${idDenuncia}?`
    );
    if (!confirma) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/api/Denuncias/ExcluirDenuncia/${idDenuncia}`,
        {
          headers: getAuthHeaders(), // 🔐 envia Bearer token
        }
      );

      // Remove da lista local
      setDenuncias((prev) =>
        prev.filter((d) => d.idDenuncia !== idDenuncia)
      );
    } catch (e: any) {
      console.error(e);
      alert("Erro ao excluir denúncia.");
    }
  }

  if (loading) {
    return <p className="p-4">Carregando denúncias...</p>;
  }

  if (erro) {
    return (
      <div className="p-4">
        <p className="text-red-600 mb-2">{erro}</p>
        <button
          onClick={carregarDenuncias}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 rounded-xl px-4 py-2 bg-black">
      <h1 className="text-2xl font-bold mb-4">Denúncias (Área Administrativa)</h1>

      <table className="w-full">
        <thead>
          <tr className="bg-gray-800">
            <th className="border border-gray-700 p-2 text-left">ID</th>
            <th className="border border-gray-700 p-2 text-left">Endereço</th>
            <th className="border border-gray-700 p-2 text-left">Cidade/UF</th>
            <th className="border border-gray-700 p-2 text-left">Status</th>
            <th className="border border-gray-700 p-2 text-left">Protocolo</th>
            <th className="border border-gray-700 p-2 text-left">Data</th>
            <th className="border border-gray-700 p-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {denuncias.map((d) => {
            const isEditing = editingId === d.idDenuncia;

            return (
              <tr key={d.idDenuncia}>
                <td className="border border-gray-700 p-2 text-left">
                  {d.idDenuncia}
                </td>

                <td className="border border-gray-700 p-2 text-left">
                  {d.logradouro} - {d.bairro}
                </td>

                <td className="border border-gray-700 p-2 text-left">
                  {d.cidade}/{d.estado}
                </td>

                {/* STATUS */}
                <td className="border border-gray-700 p-2 text-left">
                  {isEditing ? (
                    <input
                      className="border border-gray-700 p-2 text-left"
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                    />
                  ) : (
                    d.status
                  )}
                </td>

                {/* PROTOCOLO PREFEITURA */}
                <td className="border border-gray-700 p-2 text-left">
                  {isEditing ? (
                    <input
                      className="border rounded px-1 py-0.5 w-full"
                      value={editProtocolo}
                      onChange={(e) => setEditProtocolo(e.target.value)}
                    />
                  ) : (
                    d.protocoloPrefeitura || "-"
                  )}
                </td>

                <td className="border border-gray-700 p-2 text-left">
                  {new Date(d.dataDenuncia).toLocaleString("pt-BR")}
                </td>

                <td className="border border-gray-700 p-2 text-left space-x-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => salvarEdicao(d.idDenuncia)}
                        className="text-green-600 hover:underline"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={cancelarEdicao}
                        className="text-gray-600 hover:underline"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => iniciarEdicao(d)}
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => excluirDenuncia(d.idDenuncia)}
                        className="text-red-600 hover:underline"
                        title="Excluir denúncia"
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}

          {denuncias.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="border px-2 py-4 text-center text-gray-500"
              >
                Nenhuma denúncia cadastrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
