"use client";

import { useEffect, useState } from "react";
import UniversityDetailsCard from "@/components/university/UniversityDetailsCard";
import ThemeColorCard from "@/components/university/ThemeColorCard";
import SystemSettingsCard from "@/components/university/SystemSettingsCard";
import { University } from "@/types/university";
import { getUniversityById, getLogoUrl } from "@/services/university.service";

export default function UniversityPage() {
  const [selectedColor, setSelectedColor] = useState("#2B2B2B");
  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1️⃣ Obtener datos base
        const data = await getUniversityById(1);

        // 2️⃣ Si el logo es UUID, resolver la URL
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
        console.error("Error al cargar universidad:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSave = (data: University) => {
    console.log("Datos actualizados:", data);
    // Aquí podrías implementar PUT /universities/{id}
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  if (loading) return <p className="text-gray-500">Cargando...</p>;
  if (!university) return <p className="text-red-500">No se pudo cargar la universidad.</p>;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="space-y-6 min-w-[240px] flex-shrink-0 lg:w-1/4">
        <SystemSettingsCard />
      </div>

      <div className="flex-1 space-y-6">
        <UniversityDetailsCard initialData={university} onSave={handleSave} />
        <ThemeColorCard initialColor={selectedColor} onColorSelect={handleColorSelect} />
      </div>
    </div>
  );
}
