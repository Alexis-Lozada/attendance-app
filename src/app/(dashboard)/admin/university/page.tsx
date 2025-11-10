"use client";

import { useEffect, useState } from "react";
import UniversityDetailsCard from "@/components/university/UniversityDetailsCard";
import ThemeColorCard from "@/components/university/ThemeColorCard";
import SystemSettingsCard from "@/components/university/SystemSettingsCard";
import Spinner from "@/components/ui/Spinner";
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

  if (loading) return <Spinner text="Cargando universidad..." fullScreen />;
  if (!university)
    return <p className="text-red-500">No se pudo cargar la universidad.</p>;

  return (
    <div className="flex flex-col gap-8">
      {/* === Encabezado con info de la universidad === */}
      <UniversityDetailsCard university={university} />

      {/* === Contenido principal (dos columnas) === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna izquierda - Configuración del sistema */}
        <section className="space-y-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Configuración del sistema
            </h3>
            <p className="text-sm text-gray-500">
              Ajusta los parámetros de operación del sistema, como reportes y
              correos automáticos.
            </p>
          </div>
          <div>
            <SystemSettingsCard />
          </div>
        </section>

        {/* Columna derecha - Tema visual */}
        <section className="space-y-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Personalización del tema
            </h3>
            <p className="text-sm text-gray-500">
              Cambia los colores y apariencia de la plataforma para reflejar la
              identidad visual de tu institución.
            </p>
          </div>
          <div>
            <ThemeColorCard />
          </div>
        </section>
      </div>
    </div>
  );
}