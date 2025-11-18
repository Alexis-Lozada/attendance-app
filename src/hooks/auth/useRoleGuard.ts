"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function useRoleGuard(requiredRole?: string) {
  const { user, initializing } = useAuth(); // <-- ahora recibimos initializing
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 1) Todavía no ha cargado AuthContext → no decidir nada todavía
    if (initializing) return;

    // 2) No autenticado → login
    if (!user) {
      router.replace("/login");
      return;
    }

    // 3) Si se requiere un rol y no coincide → dashboard
    if (requiredRole && user.role !== requiredRole) {
      router.replace("/dashboard");
      return;
    }

    // 4) Todo OK
    setReady(true);
  }, [user, initializing, requiredRole, router]);

  return { ready };
}
