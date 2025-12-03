"use client";

/**
 * Página inicial (home) do portal.
 * - Acessível para qualquer usuário (logado ou não).
 * - Explica o propósito do sistema.
 * - Traz atalhos para:
 *   - Nova denúncia
 *   - Minhas denúncias (se o usuário estiver logado)
 *   - Buscar denúncia por ID (qualquer usuário)
 *   - Área administrativa (se o usuário for Admin)
 */

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [perfil, setPerfil] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const perfilLocal = localStorage.getItem("perfil");
      setIsAuthenticated(!!token);
      setPerfil(perfilLocal);
    }
  }, []);

  if (!mounted) return null;

  return (
    <main className="rounded-xl min-h-[calc(100vh-64px)] text-white px-4 py-8 flex justify-center">
      <div className="w-full rounded-xl px-4 py-2 bg-black max-w-6xl space-y-8">
        {/* Hero */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              Portal de Denúncias de{" "}
              <span className="text-green-400">Acessibilidade Urbana</span>
            </h1>
            <p className="text-gray-300 text-sm md:text-base">
              Registre problemas de acessibilidade em calçadas, vias públicas e
              espaços urbanos. Você pode denunciar como cidadão autenticado ou,
              se preferir, de forma anônima.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link
                href="/denuncias/nova"
                className="px-4 py-2 rounded-full bg-green-600 text-black text-sm md:text-base font-semibold hover:bg-green-500 transition"
              >
                Registrar nova denúncia
              </Link>

              {isAuthenticated && (
                <Link
                  href="/denuncias/minhas"
                  className="px-4 py-2 rounded-full border border-green-500 text-green-400 text-sm md:text-base hover:bg-green-900/40 transition"
                >
                  Ver minhas denúncias
                </Link>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-green-400/5 border border-green-500/30 rounded-2xl p-4 md:p-6 text-sm text-gray-200 space-y-3">
            <h2 className="text-lg font-semibold text-green-300 mb-1">
              Como funciona?
            </h2>
            <ol className="list-decimal ml-5 space-y-1">
              <li>Informe o endereço e descreva o problema de acessibilidade.</li>
              <li>Você pode anexar foto do local (quando disponível).</li>
              <li>
                Acompanhe o status pela sua área do cidadão (se estiver logado).
              </li>
            </ol>
            <p className="text-xs text-gray-400 pt-2">
              As informações ajudam na priorização de ações e na construção de
              uma cidade mais acessível.
            </p>
          </div>
        </section>

                {/* Sessão de atalhos / cards */}
        <section className="grid md:grid-cols-4 gap-4">
          {/* CARD 1 — Denunciar anonimamente */}
          <div className="border border-gray-800 rounded-xl p-4 bg-gray-900/40">
            <h3 className="font-semibold mb-1 text-sm md:text-base">
              Denunciar anonimamente
            </h3>
            <p className="text-xs text-gray-400 mb-3">
              Você não precisa estar logado para registrar uma denúncia. Basta
              informar o endereço e o tipo de problema.
            </p>
            <Link
              href="/denuncias/nova"
              className="inline-block text-xs px-3 py-1.5 rounded-full bg-green-600 text-black hover:bg-green-500 transition"
            >
              Fazer denúncia agora
            </Link>
          </div>

          {/* CARD 2 — Minhas denúncias */}
          <div className="border border-gray-800 rounded-xl p-4 bg-gray-900/40">
            <h3 className="font-semibold mb-1 text-sm md:text-base">
              Acompanhar meus registros
            </h3>
            <p className="text-xs text-gray-400 mb-3">
              Entre com sua conta para visualizar o histórico de denúncias e o
              status de cada uma.
            </p>
            {isAuthenticated ? (
              <Link
                href="/denuncias/minhas"
                className="inline-block text-xs px-3 py-1.5 rounded-full bg-green-600 text-black hover:bg-green-500 transition"
              >
                Ver minhas denúncias
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-block text-xs px-3 py-1.5 rounded-full border border-green-500 text-green-400 hover:bg-green-900/40 transition"
              >
                Entrar no portal
              </Link>
            )}
          </div>

          {/* CARD 3 — Buscar denúncia por ID */}
          <div className="border border-gray-800 rounded-xl p-4 bg-gray-900/40">
            <h3 className="font-semibold mb-1 text-sm md:text-base">
              Buscar denúncia por ID
            </h3>
            <p className="text-xs text-gray-400 mb-3">
              Consulte rapidamente o status de uma denúncia usando o protocolo.
            </p>
            <Link
              href="/denuncias/buscar"
              className="inline-block text-xs px-3 py-1.5 rounded-full border border-green-500 text-green-400 hover:bg-green-900/40 transition"
            >
              Acessar busca
            </Link>
          </div>

          {/* CARD 4 — Autoavaliação da calçada */}
          <div className="border border-gray-800 rounded-xl p-4 bg-gray-900/40">
            <h3 className="font-semibold mb-1 text-sm md:text-base">
              Avaliar calçada antes de denunciar
            </h3>
            <p className="text-xs text-gray-400 mb-3">
              Envie uma foto e confira um checklist baseado na cartilha oficial
              da Prefeitura de São Paulo.
            </p>
            <Link
              href="/denuncias/avaliar"
              className="inline-block text-xs px-3 py-1.5 rounded-full border border-green-500 text-green-400 hover:bg-green-900/40 transition"
            >
              Avaliar minha calçada
            </Link>
          </div>

          {/* CARD 5 — Área administrativa */}
          <div className="border border-gray-800 rounded-xl p-4 bg-gray-900/40">
            <h3 className="font-semibold mb-1 text-sm md:text-base">
              Área administrativa
            </h3>
            <p className="text-xs text-gray-400 mb-3">
              Visualização consolidada de denúncias e usuários. Acesso restrito
              a administradores.
            </p>
            {perfil === "Admin" ? (
              <Link
                href="/denuncias"
                className="inline-block text-xs px-3 py-1.5 rounded-full bg-green-600 text-black hover:bg-green-500 transition"
              >
                Acessar área administrativa
              </Link>
            ) : (
              <span className="inline-block text-xs px-3 py-1.5 rounded-full border border-gray-700 text-gray-400">
                Disponível apenas para administradores
              </span>
            )}
          </div>
        </section>
        
              <footer className="pt-4 border-t border-gray-800 mt-4 text-xs text-center text-gray-400">
          <p>
            Ao utilizar o portal <span className="text-green-400">Calçada Cidadã</span>, você declara
            estar ciente e de acordo com os{" "}
            <a
              href="/termos"
              className="text-green-400 underline hover:text-green-300"
            >
              Termos de Uso e Tratamento de Dados (LGPD)
            </a>
            .
          </p>
        </footer>

      </div>
    </main>
  );
  
}
