"use client";

import { useEffect, useState } from "react";
import api from "../../services/api";

interface ProblemaAcessibilidade {
  idProblemaAcessibilidade: number;
  descricao: string;
}

export default function ProblemasPage() {
  const [problemas, setProblemas] = useState<ProblemaAcessibilidade[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/ProblemasAcessibilidade/ListarProblemas")
      .then((response) => {
        console.log("RESPOSTA LISTAR PROBLEMAS:", response.data);

        // tenta várias formas de pegar os dados, dependendo da estrutura
        const dados =
          response.data?.dados ??
          response.data?.resultado ??
          response.data?.itens ??
          response.data ??
          [];

        if (Array.isArray(dados)) {
          setProblemas(dados as ProblemaAcessibilidade[]);
        } else {
          console.warn("Estrutura inesperada na resposta:", response.data);
          setProblemas([]);
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar problemas:", error);
        setErro("Erro ao carregar problemas.");
      })
      .finally(() => {
        setCarregando(false);
      });
  }, []);

  if (carregando) {
    return (
      <div className="p-10 min-h-screen bg-black text-white">
        <p>Carregando problemas de acessibilidade...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="p-10 min-h-screen bg-black text-white">
        <p className="text-red-400">{erro}</p>
      </div>
    );
  }

  return (
    <div className="p-10 min-h-screen bg-black text-white">
      <h1 className="text-2xl font-bold mb-6">
        Tipos de Problema de Acessibilidade
      </h1>

      {problemas.length === 0 ? (
        <p>Nenhum problema de acessibilidade encontrado.</p>
      ) : (
        <table className="border-collapse border border-gray-400 w-full text-left">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Descrição</th>
            </tr>
          </thead>

          <tbody>
            {problemas.map((p) => (
              <tr key={p.idProblemaAcessibilidade}>
                <td className="border border-gray-300 p-2">
                  {p.idProblemaAcessibilidade}
                </td>
                <td className="border border-gray-300 p-2">{p.descricao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
