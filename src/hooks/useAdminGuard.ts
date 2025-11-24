"use client";

// Hook de proteção para rotas administrativas.
// Verifica se o usuário está autenticado E se possui perfil Admin.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAdminGuard() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const perfil = localStorage.getItem("perfil");

    if (!token) {
      router.push("/login");
      return;
    }

    if (perfil !== "Admin") {
      router.push("/");
      return;
    }

    setIsChecking(false);
  }, [router]);

  return {
    isChecking,
  };
}
