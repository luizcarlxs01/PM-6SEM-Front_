"use client";

/**
 * Tela de autoanálise de calçada.
 * - Usuário envia uma imagem da calçada (obrigatório).
 * - Responde um checklist baseado na cartilha da Prefeitura de SP.
 * - Recebe um parecer se faz sentido ou não registrar denúncia.
 * - Link para a cartilha oficial.
 */

import { useState, ChangeEvent, FormEvent } from "react";

type ProblemasState = {
  faixaLivreObstruida: boolean;
  pisoIrregularOuEscorregadio: boolean;
  calcadaViraRampaDeCarro: boolean;
  degrausAoLongoDaCalcada: boolean;
  vegetacaoOuMobiliarioObstrui: boolean;
};

export default function AvaliarCalcadaPage() {
  const [arquivoNome, setArquivoNome] = useState<string | null>(null);
  const [arquivoPreview, setArquivoPreview] = useState<string | null>(null);

  const [problemas, setProblemas] = useState<ProblemasState>({
    faixaLivreObstruida: false,
    pisoIrregularOuEscorregadio: false,
    calcadaViraRampaDeCarro: false,
    degrausAoLongoDaCalcada: false,
    vegetacaoOuMobiliarioObstrui: false,
  });

  const [resultadoTitulo, setResultadoTitulo] = useState<string | null>(null);
  const [resultadoTexto, setResultadoTexto] = useState<string | null>(null);
  const [resultadoPontos, setResultadoPontos] = useState<string[]>([]);

  const [erroImagem, setErroImagem] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setArquivoNome(null);
      setArquivoPreview(null);
      return;
    }

    setArquivoNome(file.name);
    setErroImagem(null);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setArquivoPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleProblemaToggle = (field: keyof ProblemasState) => {
    setProblemas((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const getDescricaoProblema = (key: keyof ProblemasState): string => {
    switch (key) {
      case "faixaLivreObstruida":
        return "Faixa livre de circulação estreita, com obstáculos ou desníveis importantes.";
      case "pisoIrregularOuEscorregadio":
        return "Piso muito irregular, quebrado ou escorregadio.";
      case "calcadaViraRampaDeCarro":
        return "Calçada muito inclinada, parecendo rampa para carro entrar na garagem.";
      case "degrausAoLongoDaCalcada":
        return "Degraus no meio da calçada, quebrando a continuidade do passeio.";
      case "vegetacaoOuMobiliarioObstrui":
        return "Árvores, postes, lixeiras ou outros elementos bloqueando o caminho.";
      default:
        return "";
    }
  };

  const handleAnalise = (e: FormEvent) => {
    e.preventDefault();

    setErroImagem(null);
    setResultadoTitulo(null);
    setResultadoTexto(null);
    setResultadoPontos([]);

    // agora a imagem é obrigatória
    if (!arquivoPreview) {
      setErroImagem("Envie uma foto da calçada antes de realizar a análise.");
      return;
    }

    const marcados = (Object.entries(problemas) as [keyof ProblemasState, boolean][])
      .filter(([_, val]) => val)
      .map(([key]) => key);

    if (marcados.length === 0) {
      setResultadoTitulo("Pela imagem e pelas respostas, parece próxima do padrão adequado.");
      setResultadoTexto(
        "Com base na foto enviada e no checklist que você marcou, não foi identificado nenhum problema grave típico de irregularidade. Se ainda assim você perceber risco à segurança ou dificuldade real de circulação, pode ser válido registrar a denúncia, principalmente se a situação se repetir em vários trechos da rua."
      );
      setResultadoPontos([]);
      return;
    }

    let titulo: string;
    let texto: string;

    if (marcados.length === 1) {
      titulo = "A imagem indica um possível ponto de irregularidade.";
      texto =
        "Pela foto enviada e pela seleção do checklist, há pelo menos um item que foge das regras básicas de acessibilidade para calçadas. Se esse problema realmente dificulta a circulação (principalmente de pessoas idosas, com deficiência ou com carrinho de bebê), pode fazer sentido registrar uma denúncia.";
    } else if (marcados.length <= 3) {
      titulo = "A imagem mostra vários indícios de irregularidade.";
      texto =
        "Foram marcados alguns problemas relevantes ao analisar a foto. Isso indica que a calçada provavelmente não atende aos padrões de acessibilidade previstos na cartilha da Prefeitura. Nesse caso, há um bom argumento para registrar uma denúncia formal.";
    } else {
      titulo = "A imagem sugere alta chance de irregularidade séria.";
      texto =
        "Você marcou diversos problemas graves ao mesmo tempo ao olhar para a foto. Esse cenário geralmente representa forte risco de queda e bloqueio da circulação, o que fortalece bastante a justificativa para registrar uma denúncia.";
    }

    const pontos = marcados.map((key) => getDescricaoProblema(key));

    setResultadoTitulo(titulo);
    setResultadoTexto(texto);
    setResultadoPontos(pontos);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex justify-center px-4 py-8 bg-black text-white">
      <div className="w-full max-w-4xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold">
            Avaliar calçada antes de fazer denúncia
          </h1>
          <p className="text-sm text-gray-300">
            Use esta ferramenta para ter uma noção inicial se a situação da
            calçada, pela imagem que você enviar, parece ou não compatível com
            as regras de acessibilidade da Prefeitura de São Paulo. Ela não
            substitui uma avaliação técnica, mas ajuda você a decidir se vale a
            pena registrar uma denúncia.
          </p>

          <a
            href="https://www.prefeitura.sp.gov.br/cidade/secretarias/upload/subprefeituras/calcadas/arquivos/cartilha_-_draft_10.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-green-400 underline hover:text-green-300"
          >
            Ver cartilha oficial da Prefeitura de São Paulo (PDF)
          </a>
        </header>

        <form
          onSubmit={handleAnalise}
          className="space-y-6 bg-gray-900/50 border border-gray-800 rounded-xl p-4 md:p-6"
        >
          {/* Upload da imagem */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold">1. Foto da calçada (obrigatória)</h2>
            <p className="text-xs text-gray-400">
              Envie uma foto nítida da calçada que você está avaliando. Ela não
              é enviada automaticamente para nenhum órgão público; serve como
              base visual para esta análise.
            </p>

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
                  Pré-visualização da imagem:
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={arquivoPreview}
                  alt="Pré-visualização da calçada"
                  className="max-h-64 rounded border border-gray-700 object-contain"
                />
              </div>
            )}

            {erroImagem && (
              <p className="text-xs text-red-400 mt-1">{erroImagem}</p>
            )}
          </section>

          {/* Checklist baseado na cartilha */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold">
              2. Checklist rápido da situação observada na imagem
            </h2>
            <p className="text-xs text-gray-400">
              As perguntas abaixo são baseadas na cartilha “Conheça as regras
              para arrumar a sua calçada” da Prefeitura de São Paulo, que define
              faixa livre mínima de 1,20 m, piso regular, firme, contínuo e
              antiderrapante, além de evitar que a calçada vire rampa de carro
              ou tenha degraus no meio do caminho.
            </p>

            <div className="space-y-2 text-xs">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={problemas.faixaLivreObstruida}
                  onChange={() =>
                    handleProblemaToggle("faixaLivreObstruida")
                  }
                  className="mt-[2px] rounded border-gray-700 bg-gray-800"
                />
                <span>
                  Na imagem, a faixa central por onde as pessoas andam parece
                  estreita (menos de 1,20 m) ou cheia de obstáculos fixos
                  (postes, lixeiras, mesas, degraus, etc.).
                </span>
              </label>

              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={problemas.pisoIrregularOuEscorregadio}
                  onChange={() =>
                    handleProblemaToggle("pisoIrregularOuEscorregadio")
                  }
                  className="mt-[2px] rounded border-gray-700 bg-gray-800"
                />
                <span>
                  O piso da calçada na foto é muito irregular, quebrado, com
                  buracos ou aparenta ser escorregadio quando molhado.
                </span>
              </label>

              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={problemas.calcadaViraRampaDeCarro}
                  onChange={() =>
                    handleProblemaToggle("calcadaViraRampaDeCarro")
                  }
                  className="mt-[2px] rounded border-gray-700 bg-gray-800"
                />
                <span>
                  A calçada parece ter sido moldada principalmente para o carro
                  entrar na garagem, com uma inclinação forte que dificulta a
                  passagem de cadeirantes, idosos ou carrinhos de bebê.
                </span>
              </label>

              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={problemas.degrausAoLongoDaCalcada}
                  onChange={() =>
                    handleProblemaToggle("degrausAoLongoDaCalcada")
                  }
                  className="mt-[2px] rounded border-gray-700 bg-gray-800"
                />
                <span>
                  Há degraus no meio da calçada (não apenas no portão), que
                  quebram a continuidade do caminho e obrigam a subir e descer.
                </span>
              </label>

              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={problemas.vegetacaoOuMobiliarioObstrui}
                  onChange={() =>
                    handleProblemaToggle("vegetacaoOuMobiliarioObstrui")
                  }
                  className="mt-[2px] rounded border-gray-700 bg-gray-800"
                />
                <span>
                  Árvores, arbustos, mobiliário urbano ou placas ocupam boa
                  parte do caminho e atrapalham a circulação, principalmente
                  para quem tem mobilidade reduzida.
                </span>
              </label>
            </div>
          </section>

          {/* Resultado da análise */}
          <section className="space-y-3">
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-green-600 text-black text-sm font-semibold hover:bg-green-500 transition"
            >
              Analisar situação da calçada
            </button>

            {resultadoTitulo && (
              <div className="mt-3 border border-gray-800 rounded-lg p-3 bg-gray-900/60 text-xs space-y-2">
                <h3 className="font-semibold text-sm text-green-300">
                  {resultadoTitulo}
                </h3>
                {resultadoTexto && (
                  <p className="text-gray-200">{resultadoTexto}</p>
                )}

                {resultadoPontos.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-gray-300">
                      Itens que você marcou como problemáticos na imagem:
                    </p>
                    <ul className="list-disc ml-4 space-y-1">
                      {resultadoPontos.map((ponto, idx) => (
                        <li key={idx}>{ponto}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-[11px] text-gray-400 pt-1">
                  Importante: esta análise é apenas uma orientação inicial, com
                  base na imagem enviada e nas respostas do checklist. Se a
                  situação representar risco real de queda ou impedir a
                  circulação de pedestres, registrar a denúncia continua sendo
                  um direito importante.
                </p>
              </div>
            )}
          </section>
        </form>
      </div>
    </div>
  );
}
