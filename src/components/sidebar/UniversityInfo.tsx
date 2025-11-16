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

  useEffect(() => {
    if (!user?.idUniversity) return;

    // 1Intentar cargar desde localStorage
    const cached = localStorage.getItem(storageKey);

    if (cached) {
      try {
        const parsed: CachedUniversity = JSON.parse(cached);

        setUniversity(parsed.data);
        setLogoUrl(parsed.logoUrl);
      } catch (e) {
        console.warn("Error al leer universidad en localStorage:", e);
      }
    }

    // Pedir datos frescos en background
    const fetchUniversity = async () => {
      try {
        const data = await getUniversityById(user.idUniversity);

        // obtener URL real del logo
        const url = data.logo ? await getLogoUrl(data.logo) : null;

        setUniversity(data);
        setLogoUrl(url);

        // Guardar en localStorage
        const toStore: CachedUniversity = { data, logoUrl: url };
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
