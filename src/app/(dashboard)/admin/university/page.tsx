"use client";

import { useEffect, useState } from "react";
import UniversityDetailsCard from "@/components/university/UniversityDetailsCard";
import ThemeColorCard from "@/components/university/ThemeColorCard";
import SystemSettingsCard from "@/components/university/SystemSettingsCard";
import { University } from "@/types/university";
import { getUniversityById, getLogoUrl } from "@/services/university.service";
import { useAuth } from "@/context/AuthContext";

export default function UniversityPage() {
  const { user } = useAuth();
  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.idUniversity) return;

    const loadUniversity = async () => {
      try {
        const data = await getUniversityById(user.idUniversity);

        let logoUrl = data.logo;
        if (data.logo && !data.logo.startsWith("http")) {
          const url = await getLogoUrl(data.logo);
          if (url) logoUrl = url;
        }

        setUniversity({
          name: data.name,
          code: data.code,
          campus: data.campus,
          address: data.address,
          email: data.email,
          logo: logoUrl,
        });
      } catch (error) {
        console.error("Error al cargar la universidad:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUniversity();
  }, [user?.idUniversity]);

  if (!user) return <p className="text-gray-500">Iniciando sesión...</p>;
  if (loading) return <p className="text-gray-500">Cargando...</p>;
  if (!university)
    return <p className="text-red-500">No se pudo cargar la universidad.</p>;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <aside className="space-y-6 min-w-[240px] flex-shrink-0 lg:w-1/4">
        <SystemSettingsCard />
      </aside>

      <main className="flex-1 space-y-6">
        <UniversityDetailsCard initialData={university} onSave={setUniversity} />
        <ThemeColorCard />
      </main>
    </div>
  );
}
