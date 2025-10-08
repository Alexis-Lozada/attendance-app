"use client";

import { useRef, useState } from "react";
import { University } from "@/types/university";
import { Building2, Upload } from "lucide-react";

interface Props {
  initialData: University;
  onSave: (data: University) => void;
}

export default function UniversityDetailsCard({ initialData, onSave }: Props) {
  const [university, setUniversity] = useState<University>(initialData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof University, value: string) => {
    setUniversity((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(university);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setUniversity((prev) => ({ ...prev, logo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Encabezado */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 bg-white">
          <Building2 className="w-4 h-4 text-gray-700" />
        </div>
        <h3 className="text-sm font-medium text-gray-900">
          Detalles de Universidad
        </h3>
      </div>

      {/* Contenido principal dividido en dos columnas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columna izquierda - Logo centrado verticalmente */}
        <div className="flex flex-col items-center justify-center md:col-span-1">
          <div className="w-24 h-24 rounded-lg border border-gray-200 flex items-center justify-center bg-gray-50 overflow-hidden">
            {university.logo ? (
              <img
                src={university.logo}
                alt="Logo Universidad"
                className="w-full h-full object-contain"
              />
            ) : (
              <Building2 className="w-10 h-10 text-gray-400" />
            )}
          </div>

          <div className="mt-3 flex flex-col items-center">
            <p className="text-xs text-gray-500 mb-1">Logo institucional</p>
            <button
              onClick={handleUploadClick}
              className="text-xs font-medium text-gray-700 border border-gray-200 rounded-md px-3 py-1.5 flex items-center gap-1 hover:bg-gray-100 transition"
            >
              <Upload className="w-3.5 h-3.5" />
              Subir imagen
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
            />
          </div>
        </div>

        {/* Columna derecha - Campos */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={university.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-gray-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Código
            </label>
            <input
              type="text"
              value={university.code}
              onChange={(e) => handleChange("code", e.target.value)}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-gray-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Campus
            </label>
            <input
              type="text"
              value={university.campus}
              onChange={(e) => handleChange("campus", e.target.value)}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-gray-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <input
              type="text"
              value={university.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-gray-400 focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Correo institucional
            </label>
            <input
              type="email"
              value={university.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-gray-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Botón guardar */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSave}
          className="bg-[#2B2B2B] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#3c3c3c] transition"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
