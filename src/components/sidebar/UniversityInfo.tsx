"use client";

import { useEffect, useState } from "react";
import { UniversityResponse, getUniversityById, getLogoUrl } from "@/services/university.service";
import { useAuth } from "@/context/AuthContext";

interface CachedUniversity {
  data: UniversityResponse;
  logoUrl: string | null;
}

export default function UniversityInfo() {
  const { user } = useAuth();
  const [university, setUniversity] = useState<UniversityResponse | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const storageKey = "university";

  // 👉 Detectar si "logo" es URL real o UUID
  const resolveLogoUrl = async (logo: string | null | undefined): Promise<string | null> => {
    if (!logo) return null;

    const isUrl = logo.startsWith("http://") || logo.startsWith("https://");

    if (isUrl) {
      return logo; // ya es una url real
    }

    // Si no es URL → asumimos UUID y pedimos al storage-ms
    try {
      return await getLogoUrl(logo);
    } catch (e) {
      console.warn("Error obteniendo logo desde storage-ms:", e);
      return null;
    }
  };

  useEffect(() => {
    if (!user?.idUniversity) return;

    // 1️⃣ Revisar localStorage
    const cached = localStorage.getItem(storageKey);

    if (cached) {
      try {
        const parsed: CachedUniversity = JSON.parse(cached);
        setUniversity(parsed.data);
        setLogoUrl(parsed.logoUrl);
      } catch (e) {
        console.warn("Error al leer universidad del localStorage:", e);
      }
    }

    // 2️⃣ Obtener siempre datos frescos en background
    const fetchUniversity = async () => {
      try {
        const data = await getUniversityById(user.idUniversity);

        // Resolver logo (UUID o URL)
        const realLogoUrl = await resolveLogoUrl(data.logo);

        setUniversity(data);
        setLogoUrl(realLogoUrl);

        // Guardar en localStorage
        const toStore: CachedUniversity = { data, logoUrl: realLogoUrl };
        localStorage.setItem(storageKey, JSON.stringify(toStore));
      } catch (error) {
        console.error("Error obteniendo universidad:", error);
      }
    };

    fetchUniversity();
  }, [user?.idUniversity]);

  if (!university) return null;

  return (
    <div
      className="mx-4 mb-3 rounded-lg px-3 py-3 flex items-center gap-3"
      style={{ backgroundColor: "#FDFDFD", border: "1px solid #F0F0F0" }}
    >
      <img
        src={logoUrl || "/images/university-placeholder.png"}
        alt={university.name}
        className="w-8 h-8 rounded-md object-contain"
      />

      <div className="flex flex-col min-w-0">
        <span
          className="text-sm font-medium text-gray-900 truncate whitespace-nowrap"
          title={university.name}
        >
          {university.name}
        </span>
        <span className="text-xs text-gray-500">{university.code}</span>
      </div>
    </div>
  );
}
