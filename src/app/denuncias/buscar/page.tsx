"use client";

// Tela para buscar uma denúncia específica pelo ID (protocolo),
// exibindo no mesmo formato da tela "Minhas denúncias".

import { useState } from "react";
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

export default function BuscarDenunciaPorIdPage() {
  const [idBusca, setIdBusca] = useState<string>("");
  const [denuncia, setDenuncia] = useState<Denuncia | null>(null);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  async function handleBuscar(event: React.FormEvent) {
    event.preventDefault();

    setMensagem(null);
    setDenuncia(null);

    const id = parseInt(idBusca, 10);
    if (isNaN(id) || id <= 0) {
      setMensagem("Informe um ID de denúncia válido.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.get<ResponseModel<Denuncia>>(
        `/Denuncias/BuscarDenunciaPorId/${id}`
      );

      if (response.data.status && response.data.dados) {
        setDenuncia(response.data.dados);
      } else {
        setMensagem(
          response.data.mensagem || "Nenhuma denúncia encontrada para este ID."
        );
      }
    } catch (error) {
      console.error("Erro ao buscar denúncia por ID:", error);
      setMensagem("Erro ao buscar denúncia. Verifique o ID informado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Buscar denúncia por ID</h1>

      <form onSubmit={handleBuscar} className="mb-6 flex flex-wrap gap-2">
        <input
          type="number"
          min={1}
          value={idBusca}
          onChange={(e) => setIdBusca(e.target.value)}
          placeholder="Informe o ID da denúncia (protocolo)"
          className="px-3 py-2 rounded border border-gray-700 bg-gray-900 text-sm w-full md:w-64"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded bg-green-600 text-black text-sm font-semibold hover:bg-green-500 transition disabled:opacity-50"
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {mensagem && (
        <p className="mb-4 text-sm text-gray-300">{mensagem}</p>
      )}

      {!denuncia && !mensagem && !loading && (
        <p className="text-sm text-gray-500">
          Informe o ID da denúncia para visualizar os detalhes.
        </p>
      )}

      {denuncia && (
        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-700 p-2 text-left">
                  Protocolo
                </th>
                <th className="border border-gray-700 p-2 text-left">
                  Logradouro
                </th>
                <th className="border border-gray-700 p-2 text-left">
                  Bairro
                </th>
                <th className="border border-gray-700 p-2 text-left">
                  Cidade/UF
                </th>
                <th className="border border-gray-700 p-2 text-left">
                  Problema
                </th>
                <th className="border border-gray-700 p-2 text-left">
                  Status
                </th>
                <th className="border border-gray-700 p-2 text-left">
                  Data
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-900">
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
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
