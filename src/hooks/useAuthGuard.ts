"use client";

// Hook responsável por proteger páginas que exigem usuário autenticado.
// Se não existir token no localStorage, o usuário é redirecionado para /login.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuthGuard() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Executa apenas no lado do cliente
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    setIsChecking(false);
  }, [router]);

    // isChecking indica se ainda estamos verificando a autenticação.
  return {
    isChecking,
  };
}
