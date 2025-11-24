// src/app/layout.tsx
// Layout raiz da aplicação. Aplica tema escuro e inclui a Navbar em todas as páginas.

import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import Navbar from "../components/layout/Navbar";

export const metadata: Metadata = {
  title: "Portal de Denúncias de Acessibilidade",
  description: "Sistema para registro e acompanhamento de denúncias de acessibilidade em calçadas.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-black text-white min-h-screen">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
