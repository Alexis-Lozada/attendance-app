"use client";

import UniversityDetailsCard from "@/components/university/UniversityDetailsCard";
import ThemeColorCard from "@/components/university/ThemeColorCard";
import SystemSettingsCard from "@/components/university/SystemSettingsCard";
import { University } from "@/types/university";
import { useState } from "react";

export default function UniversityPage() {
  const [selectedColor, setSelectedColor] = useState("#2B2B2B");

  const initialUniversity: University = {
    name: "Universidad Autónoma de Querétaro",
    code: "UTEQ",
    campus: "Campus Norte",
    address: "Av. Pie de la Cuesta 2501, Santiago de Querétaro, Qro.",
    email: "contacto@uteq.edu.mx",
  };

  const handleSave = (data: University) => {
    console.log("Datos actualizados:", data);
  };

  const handleColorSelect = (color: string) => {
    console.log("Color seleccionado:", color);
    setSelectedColor(color);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Columna izquierda */}
      <div className="space-y-6 min-w-[240px] flex-shrink-0 lg:w-1/4">
        <SystemSettingsCard />
      </div>

      {/* Columna derecha */}
      <div className="flex-1 space-y-6">
        <UniversityDetailsCard
          initialData={initialUniversity}
          onSave={handleSave}
        />
        <ThemeColorCard
          initialColor={selectedColor}
          onColorSelect={handleColorSelect}
        />
      </div>
    </div>
  );
}
