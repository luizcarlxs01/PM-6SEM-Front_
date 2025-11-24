"use client";

/**
 * Tela de registro de nova denúncia.
 * - Acessível para qualquer usuário (logado ou não).
 * - Se o usuário estiver logado, enviamos IdUsuario.
 * - Se não estiver logado, a denúncia será anônima (IdUsuario = null).
 * - Suporta upload de imagem, enviada como base64 para a API.
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

export default function NovaDenunciaPage() {
  const router = useRouter();

  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [cep, setCep] = useState(""); // guarda só dígitos
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

  // Estados para controle do CEP / ViaCEP
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [cepMensagem, setCepMensagem] = useState<string | null>(null);
  const [cepValido, setCepValido] = useState(false);

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
          console.error(
            "Falha ao carregar problemas:",
            response.data.mensagem
          );
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

  // Máscara de CEP: só números, max 8 dígitos, exibe como 00000-000
  const handleCepChange = (event: ChangeEvent<HTMLInputElement>) => {
    let valor = event.target.value;

    valor = valor.replace(/\D/g, ""); // só números
    valor = valor.slice(0, 8); // máximo 8 dígitos

    setCep(valor);
    setCepValido(false);
    setCepMensagem(null);
    // limpa endereço anterior se usuário trocar CEP
    setLogradouro("");
    setBairro("");
    setCidade("");
    setEstado("");
  };

  // Buscar CEP na API pública ViaCEP
  const buscarCep = async () => {
    setCepMensagem(null);
    setCepValido(false);

    if (cep.length !== 8) {
      setCepMensagem("Informe um CEP válido com 8 dígitos.");
      return;
    }

    try {
      setBuscandoCep(true);

      const response = await fetch(
        `https://viacep.com.br/ws/${cep}/json/`
      );

      if (!response.ok) {
        throw new Error("Erro ao consultar CEP.");
      }

      const data = await response.json();

      if (data.erro) {
        setCepMensagem("CEP não encontrado. Verifique e tente novamente.");
        setLogradouro("");
        setBairro("");
        setCidade("");
        setEstado("");
        setCepValido(false);
        return;
      }

      // Preenche campos com o retorno do ViaCEP
      setLogradouro(data.logradouro || "");
      setBairro(data.bairro || "");
      setCidade(data.localidade || "");
      setEstado((data.uf || "").toUpperCase());

      setCepValido(true);
      setCepMensagem("Endereço preenchido automaticamente pelo CEP.");
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      setCepMensagem("Erro ao buscar CEP. Tente novamente.");
      setCepValido(false);
    } finally {
      setBuscandoCep(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErro(null);
    setMensagem(null);

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

      const response = await api.post<ResponseModel<any>>(
        "/Denuncias/CriarDenuncia",
        payload
      );

      if (!response.data.status) {
        setErro(
          response.data.mensagem || "Não foi possível registrar a denúncia."
        );
        return;
      }

      setMensagem(
        "Denúncia registrada com sucesso! Obrigado pela contribuição."
      );
      setErro(null);

      // Redireciona gentilmente após alguns segundos
      setTimeout(() => {
        if (idUsuario) {
          router.push("/denuncias/minhas");
        } else {
          router.push("/");
        }
      }, 1200);
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
    <div className="min-h-[calc(100vh-64px)] flex justify-center px-4 py-8 bg.black text-white">
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
                disabled={!cepValido}
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
              <label className="block text-xs mb-1">CEP *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cepFormatado}
                  onChange={handleCepChange}
                  className="w-full p-2 rounded bg-gray-800 text.white border border-gray-700 text-sm flex-1"
                  placeholder="00000-000"
                  inputMode="numeric"
                  maxLength={9} // 8 dígitos + hífen
                />
                <button
                  type="button"
                  onClick={buscarCep}
                  disabled={cep.length !== 8 || buscandoCep}
                  className="px-3 py-2 rounded bg-green-600 text-black text-xs font-semibold hover:bg-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {buscandoCep ? "Buscando..." : "Buscar"}
                </button>
              </div>
              {cepMensagem && (
                <p className="text-[11px] text-gray-300 mt-1">
                  {cepMensagem}
                </p>
              )}
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs mb-1">Bairro *</label>
              <input
                type="text"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text.white border border-gray-700 text-sm"
                disabled={!cepValido}
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
                className="w-full p-2 rounded bg-gray-800 text.white border border-gray-700 text-sm"
                disabled={!cepValido}
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Estado (UF) *</label>
              <input
                type="text"
                value={estado}
                onChange={(e) => setEstado(e.target.value.toUpperCase())}
                className="w-full p-2 rounded bg-gray-800 text.white border border-gray-700 text-sm"
                maxLength={2}
                placeholder="SP, RJ, MG..."
                disabled={!cepValido}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs mb-1">Ponto de referência</label>
            <input
              type="text"
              value={pontoReferencia}
              onChange={(e) => setPontoReferencia(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text.white border border-gray-700 text-sm"
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
                className="w-full p-2 rounded bg-gray-800 text.white border border-gray-700 text-sm"
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
              className="w-full p-2 rounded bg-gray-800 text.white border border-gray-700 text-sm min-h-[60px]"
              placeholder="Explique por que esse problema prejudica a acessibilidade no local."
            />
          </div>

          <div>
            <label className="block text-xs mb-1">Descrição detalhada</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text.white border border-gray-700 text-sm min-h-[80px]"
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
                <p className="text-xs text-gray-400 mb-1">
                  Pré-visualização:
                </p>
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
              className="px-4 py-2 rounded-full bg-green-600 text.black text-sm font-semibold hover:bg-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {enviando ? "Enviando..." : "Registrar denúncia"}
            </button>
          </div>
          <p className="mt-3 text-[11px] text-gray-400">
            Ao registrar uma denúncia, você concorda com o uso das informações e imagens
            fornecidas para fins cívicos e estatísticos na plataforma{" "}
            <span className="text-green-400">Calçada Cidadã</span>, conforme descrito nos{" "}
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
