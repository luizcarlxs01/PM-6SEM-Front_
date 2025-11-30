"use client";

/**
 * Tela de registro de nova denúncia.
 * - Acessível para qualquer usuário (logado ou não).
 * - Se o usuário estiver logado, enviamos IdUsuario.
 * - Se não estiver logado, a denúncia será anônima (IdUsuario = null).
 * - Suporta upload de imagem, enviada como base64 para a API.
 * - Integração com ViaCEP: CEP auto-preenche endereço.
 */

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import api from "../../../services/api";
import { useRouter } from "next/navigation";

interface ProblemaAcessibilidade {
  idProblemaAcessibilidade: number;
  descricao: string;
}

interface ResponseModel<T> {
  dados: T;
  mensagem: string;
  status: boolean;
}

// mesma ideia de "Denuncia" usada em outras telas
interface Denuncia {
  idDenuncia: number;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  status: string;
  dataDenuncia: string;
}

export default function NovaDenunciaPage() {
  const router = useRouter();

  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [cep, setCep] = useState(""); // guarda somente dígitos
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [pontoReferencia, setPontoReferencia] = useState("");
  const [existemObstaculos, setExistemObstaculos] = useState(false);
  const [idProblemaAcessibilidade, setIdProblemaAcessibilidade] =
    useState<number | null>(null);
  const [motivosPedido, setMotivosPedido] = useState("");
  const [descricao, setDescricao] = useState("");

  const [arquivoBase64, setArquivoBase64] = useState<string | null>(null);
  const [arquivoNome, setArquivoNome] = useState<string | null>(null);
  const [arquivoPreview, setArquivoPreview] = useState<string | null>(null);

  const [problemas, setProblemas] = useState<ProblemaAcessibilidade[]>([]);
  const [carregandoProblemas, setCarregandoProblemas] = useState(false);

  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  // CEP / ViaCEP
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [cepValido, setCepValido] = useState(false);

  // ID da denúncia gerada (para anônimos)
  const [idDenunciaGerada, setIdDenunciaGerada] = useState<number | null>(null);

  // CEP formatado para exibição (00000-000)
  const cepFormatado =
    cep.length <= 5 ? cep : `${cep.slice(0, 5)}-${cep.slice(5)}`;

  // Carrega lista de problemas de acessibilidade ao montar
  useEffect(() => {
    const carregarProblemas = async () => {
      try {
        setCarregandoProblemas(true);
        const response =
          await api.get<ResponseModel<ProblemaAcessibilidade[]>>(
            "/ProblemasAcessibilidade/ListarProblemas"
          );

        if (response.data.status && response.data.dados) {
          setProblemas(response.data.dados);
        } else {
          console.error("Falha ao carregar problemas:", response.data.mensagem);
        }
      } catch (error) {
        console.error("Erro ao carregar problemas:", error);
      } finally {
        setCarregandoProblemas(false);
      }
    };

    carregarProblemas();
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setArquivoBase64(null);
      setArquivoNome(null);
      setArquivoPreview(null);
      return;
    }

    setArquivoNome(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setArquivoBase64(result);
      setArquivoPreview(result);
    };
    reader.readAsDataURL(file);
  };

  // Máscara de CEP: só números, max 8 dígitos
  const handleCepChange = (event: ChangeEvent<HTMLInputElement>) => {
    let valor = event.target.value;

    // remove tudo que não for número
    valor = valor.replace(/\D/g, "");
    // limita a 8 dígitos
    valor = valor.slice(0, 8);

    setCep(valor);
    setCepValido(false);
    // se o usuário começa a alterar o CEP, limpamos endereço antigo
    setLogradouro("");
    setBairro("");
    setCidade("");
    setEstado("");
  };

  // Busca CEP automaticamente quando possuir 8 dígitos
  useEffect(() => {
    const buscarCep = async () => {
      if (cep.length !== 8) return;

      try {
        setBuscandoCep(true);
        setErro(null);

        const resposta = await fetch(
          `https://viacep.com.br/ws/${cep}/json/`
        );

        if (!resposta.ok) {
          throw new Error("Erro ao consultar CEP");
        }

        const dados = await resposta.json();

        if (dados.erro) {
          setCepValido(false);
          setErro("CEP não encontrado. Verifique o número digitado.");
          return;
        }

        setLogradouro(dados.logradouro || "");
        setBairro(dados.bairro || "");
        setCidade(dados.localidade || "");
        setEstado((dados.uf || "").toUpperCase());
        setCepValido(true);
      } catch (e) {
        console.error("Erro ao buscar CEP:", e);
        setCepValido(false);
        setErro(
          "Não foi possível buscar o CEP no momento. Tente novamente ou preencha o endereço manualmente."
        );
      } finally {
        setBuscandoCep(false);
      }
    };

    buscarCep();
  }, [cep]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErro(null);
    setMensagem(null);
    setIdDenunciaGerada(null);

    if (
      !logradouro.trim() ||
      !numero.trim() ||
      !cep.trim() ||
      !bairro.trim() ||
      !cidade.trim() ||
      !estado.trim()
    ) {
      setErro(
        "Preencha pelo menos endereço completo (logradouro, número, CEP, bairro, cidade e estado)."
      );
      return;
    }

    if (!idProblemaAcessibilidade) {
      setErro("Selecione o tipo de problema de acessibilidade.");
      return;
    }

    try {
      setEnviando(true);

      // Se o usuário estiver logado, usamos o IdUsuario; se não, mantemos null (denúncia anônima)
      let idUsuario: number | null = null;

      if (typeof window !== "undefined") {
        const idUsuarioLocal = localStorage.getItem("idUsuario");
        if (idUsuarioLocal) {
          const parsed = Number(idUsuarioLocal);
          if (!Number.isNaN(parsed)) {
            idUsuario = parsed;
          }
        }
      }

      const payload = {
        idUsuario, // pode ser null
        logradouro: logradouro.trim(),
        numero: numero.trim(),
        complemento: complemento.trim() || null,
        // envia o CEP formatado com hífen (00000-000)
        cep: cepFormatado.trim(),
        bairro: bairro.trim(),
        cidade: cidade.trim(),
        estado: estado.trim(),
        pontoReferencia: pontoReferencia.trim() || null,
        existemObstaculos,
        idProblemaAcessibilidade,
        motivosPedido: motivosPedido.trim() || null,
        descricao: descricao.trim() || null,
        arquivoFotoBase64: arquivoBase64, // pode ser null
      };

      const response = await api.post<ResponseModel<Denuncia[]>>(
        "/Denuncias/CriarDenuncia",
        payload
      );

      const lista = response.data.dados;

      if (!response.data.status || !lista || lista.length === 0) {
        setErro(
          response.data.mensagem ||
            "Não foi possível registrar a denúncia corretamente."
        );
        return;
      }

      // Como a API devolve uma lista de denúncias,
      // vamos pegar o MAIOR IdDenuncia, assumindo que é a recém-criada.
      const novoId = lista.reduce(
        (max, d) => (d.idDenuncia > max ? d.idDenuncia : max),
        lista[0].idDenuncia
      );

      if (idUsuario) {
        // Usuário logado: mantém comportamento de redirecionar,
        // mas já informa o ID da denúncia que acabou de ser criada.
        setMensagem(
          `Denúncia registrada com sucesso! ID da denúncia: ${novoId}. Redirecionando para suas denúncias...`
        );

        setTimeout(() => {
          router.push("/denuncias/minhas");
        }, 1500);
      } else {
        // Denúncia anônima: mostra o ID na tela para o usuário anotar
        setIdDenunciaGerada(novoId);
        setMensagem(
          "Denúncia registrada com sucesso! Guarde o ID abaixo para consultar o status depois."
        );
      }
    } catch (error: any) {
      console.error("Erro ao registrar denúncia:", error);
      if (error.response?.data?.mensagem) {
        setErro(error.response.data.mensagem);
      } else {
        setErro("Erro ao registrar a denúncia. Tente novamente mais tarde.");
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex justify-center px-4 py-8 bg-black text-white">
      <div className="w-full max-w-3xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold">Registrar nova denúncia</h1>
          <p className="text-sm text-gray-300">
            Você pode registrar esta denúncia como cidadão autenticado ou de
            forma anônima. As informações serão utilizadas para melhorar a
            acessibilidade na sua região.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-gray-900/50 border border-gray-800 rounded-xl p-4 md:p-6"
        >
          {/* Endereço */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1">Logradouro *</label>
              <input
                type="text"
                value={logradouro}
                onChange={(e) => setLogradouro(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 text-sm"
                placeholder="Ex: Avenida Paulista"
                disabled={!cepValido || buscandoCep}
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Número *</label>
              <input
                type="text"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 text-sm"
                placeholder="Ex: 1000"
                disabled={!cepValido}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-xs mb-1">Complemento</label>
              <input
                type="text"
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 text-sm"
                placeholder="Apto, bloco, etc."
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs mb-1">
                CEP *{" "}
                <span className="text-[10px] text-gray-400">
                  (ao digitar 8 números, buscamos automaticamente)
                </span>
              </label>
              <input
                type="text"
                value={cepFormatado}
                onChange={handleCepChange}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 text-sm"
                placeholder="00000-000"
                inputMode="numeric"
                maxLength={9} // 8 dígitos + hífen
              />
              {buscandoCep && (
                <p className="text-[11px] text-gray-400 mt-1">
                  Buscando CEP na base do ViaCEP...
                </p>
              )}
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs mb-1">Bairro *</label>
              <input
                type="text"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 text-sm"
                disabled={!cepValido || buscandoCep}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1">Cidade *</label>
              <input
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 text-sm"
                disabled={!cepValido || buscandoCep}
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Estado (UF) *</label>
              <input
                type="text"
                value={estado}
                onChange={(e) => setEstado(e.target.value.toUpperCase())}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 text-sm"
                maxLength={2}
                placeholder="SP, RJ, MG..."
                disabled={!cepValido || buscandoCep}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs mb-1">Ponto de referência</label>
            <input
              type="text"
              value={pontoReferencia}
              onChange={(e) => setPontoReferencia(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 text-sm"
              placeholder="Ex: perto da estação X"
            />
          </div>

          {/* Problema de acessibilidade */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1">Tipo de problema *</label>
              <select
                value={idProblemaAcessibilidade ?? ""}
                onChange={(e) =>
                  setIdProblemaAcessibilidade(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 text-sm"
                disabled={carregandoProblemas}
              >
                <option value="">
                  {carregandoProblemas
                    ? "Carregando opções..."
                    : "Selecione um tipo de problema"}
                </option>
                {problemas.map((p) => (
                  <option
                    key={p.idProblemaAcessibilidade}
                    value={p.idProblemaAcessibilidade}
                  >
                    {p.descricao}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center mt-4 md:mt-7">
              <label className="inline-flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={existemObstaculos}
                  onChange={(e) => setExistemObstaculos(e.target.checked)}
                  className="rounded border-gray-700 bg-gray-800"
                />
                Existem obstáculos que dificultam a locomoção
              </label>
            </div>
          </div>

          {/* Motivo / descrição */}
          <div>
            <label className="block text-xs mb-1">
              Motivo do pedido / impacto na acessibilidade
            </label>
            <textarea
              value={motivosPedido}
              onChange={(e) => setMotivosPedido(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 text-sm min-h-[60px]"
              placeholder="Explique por que esse problema prejudica a acessibilidade no local."
            />
          </div>

          <div>
            <label className="block text-xs mb-1">Descrição detalhada</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 text-sm min-h-[80px]"
              placeholder="Inclua detalhes adicionais que possam ajudar na análise."
            />
          </div>

          {/* Upload de imagem */}
          <div className="space-y-2">
            <label className="block text-xs mb-1">
              Foto do local (opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-xs text-gray-300 file:text-xs file:px-3 file:py-1.5 file:rounded-full file:border-0 file:bg-green-600 file:text-black hover:file:bg-green-500"
            />
            {arquivoNome && (
              <p className="text-xs text-gray-400">
                Arquivo selecionado:{" "}
                <span className="text-gray-200">{arquivoNome}</span>
              </p>
            )}

            {arquivoPreview && (
              <div className="mt-2">
                <p className="text-xs text-gray-400 mb-1">Pré-visualização:</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={arquivoPreview}
                  alt="Pré-visualização da foto da denúncia"
                  className="max-h-48 rounded border border-gray-700 object-contain"
                />
              </div>
            )}
          </div>

          {/* Mensagens */}
          {erro && <p className="text-sm text-red-400">{erro}</p>}
          {mensagem && <p className="text-sm text-green-400">{mensagem}</p>}

          {idDenunciaGerada && (
            <div className="mt-2 border border-green-500/40 bg-green-900/20 rounded-lg p-3 text-sm text-green-100 space-y-2">
              <p>
                <span className="font-semibold">ID da denúncia: </span>
                <span className="font-mono text-lg">{idDenunciaGerada}</span>
              </p>
              <p className="text-xs text-gray-200">
                Guarde este ID para consultar o andamento da sua denúncia na
                tela <span className="italic">“Buscar denúncia por ID”</span>.
              </p>
              <button
                type="button"
                onClick={() => router.push("/denuncias/buscar")}
                className="mt-1 inline-flex px-3 py-1.5 rounded-full bg-green-600 text-black text-xs font-semibold hover:bg-green-500 transition"
              >
                Ir para página de consulta
              </button>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="px-4 py-2 rounded-full border border-gray-700 text-sm text-gray-300 hover:bg-gray-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="px-4 py-2 rounded-full bg-green-600 text-black text-sm font-semibold hover:bg-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {enviando ? "Enviando..." : "Registrar denúncia"}
            </button>
          </div>

          <p className="mt-3 text-[11px] text-gray-400">
            Ao registrar uma denúncia, você concorda com o uso das informações e
            imagens fornecidas para fins cívicos e estatísticos na plataforma{" "}
            <span className="text-green-400">Calçada Cidadã</span>, conforme
            descrito nos{" "}
            <a
              href="/termos"
              className="text-green-400 underline hover:text-green-300"
            >
              Termos de Uso e Tratamento de Dados (LGPD)
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  );
}
