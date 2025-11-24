"use client";

/**
 * Navbar principal da aplicação.
 * - Mostra links diferentes se o usuário estiver autenticado ou não.
 * - Diferencia perfil "Admin" de "Cidadao".
 * - Atualiza automaticamente após login/logout via evento global "auth-change".
 */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface NavLink {
  href: string;
  label: string;
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [perfil, setPerfil] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Função para ler estado atual de auth do localStorage
  const syncAuthState = () => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    const perfilLocal = localStorage.getItem("perfil");

    setIsAuthenticated(!!token);
    setPerfil(perfilLocal);
  };

  useEffect(() => {
    setMounted(true);
    syncAuthState();

    // Ouve mudanças de autenticação disparadas manualmente (login/logout)
    const handleAuthChange = () => {
      syncAuthState();
    };

    window.addEventListener("auth-change", handleAuthChange);

    // Opcional: se quiser reagir a mudanças de outra aba
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "token" || event.key === "perfil") {
        syncAuthState();
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("storage", handleStorage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("idUsuario");
      localStorage.removeItem("perfil");

      // Notifica a navbar e outros componentes
      window.dispatchEvent(new Event("auth-change"));
    }

    router.push("/login");
  };

  if (!mounted) {
    return null;
  }

  const authenticatedLinks: NavLink[] = [
    { href: "/", label: "Início" },
    { href: "/denuncias/minhas", label: "Minhas denúncias" },
    { href: "/denuncias/nova", label: "Nova denúncia" },
    ...(perfil === "Admin"
      ? [
          { href: "/denuncias", label: "Todas as denúncias" },
          { href: "/usuarios", label: "Usuários" },
        ]
      : []),
    { href: "/me", label: "Meus dados" },
    { href: "/alterar-senha", label: "Alterar senha" },
  ];

  const publicLinks: NavLink[] = [
    { href: "/", label: "Início" },
    { href: "/cadastro", label: "Cadastrar" },
  ];

  const linksToRender = isAuthenticated ? authenticatedLinks : publicLinks;

  return (
    <nav className="border-b border-gray-800 bg-black/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo / Nome do sistema */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-black font-bold">
            👤
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm md:text-base">
              Calçada Cidadã
            </span>
            <span className="text-xs text-gray-400 hidden sm:block">
              Portal do cidadão & área administrativa
            </span>
          </div>
        </div>

        {/* Links + Ações */}
        <div className="flex-1 flex items-center justify-end gap-4">
          {/* Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {linksToRender.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm px-3 py-1.5 rounded-full transition ${
                  isActive(pathname, link.href)
                    ? "bg-green-600 text-black"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile simples */}
          <div className="md:hidden flex items-center gap-2">
            {linksToRender.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs px-3 py-1.5 rounded-full transition ${
                  isActive(pathname, link.href)
                    ? "bg-green-600 text.black"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Botão de ação */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-xs md:text-sm px-3 py-1.5 rounded-full border border-red-500 text-red-400 hover:bg-red-600 hover:text-white transition"
            >
              Sair
            </button>
          ) : pathname !== "/login" ? (
            <Link
              href="/login"
              className="text-xs md:text-sm px-3 py-1.5 rounded-full bg-green-600 text-black hover:bg-green-500 transition"
            >
              Entrar
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
