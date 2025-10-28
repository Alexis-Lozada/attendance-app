"use client";

import { useEffect, useState } from "react";
import type { Division } from "@/components/divisions/DivisionsTypes";

interface Props {
  initialData?: Division | null; // 🔹 null → nuevo registro
  onSave: (data: Omit<Division, "id">, id?: number) => void;
  onCancel: () => void;
}

export default function DivisionForm({ initialData, onSave, onCancel }: Props) {
  const [formData, setFormData] = useState<Omit<Division, "id">>({
    idUniversity: 0,
    code: "",
    name: "",
    description: "",
    status: true,
  });

  // 🔹 Si hay datos iniciales, los cargamos al abrir
  useEffect(() => {
    if (initialData) {
      setFormData({
        idUniversity: initialData.idUniversity,
        code: initialData.code,
        name: initialData.name,
        description: initialData.description,
        status: initialData.status,
      });
    } else {
      setFormData({
        idUniversity: 0,
        code: "",
        name: "",
        description: "",
        status: true,
      });
    }
  }, [initialData]);

  const handleChange = (field: keyof Omit<Division, "id">, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.code || !formData.name || !formData.description) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }
    onSave(formData, initialData?.id); // 🔹 si tiene id, es edición
  };

  return (
    <div className="space-y-4">
      {/* Campos principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código Académico *
          </label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => handleChange("code", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none"
            placeholder="Ej: ING, DS, MC"
            maxLength={10}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de División *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none"
            placeholder="Ej: Área de Ingeniería"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none resize-none"
          placeholder="Breve descripción de la división académica"
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          onClick={onCancel}
          className="border border-gray-300 text-gray-700 text-sm font-medium rounded-md px-4 py-2 hover:bg-gray-100 transition"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          className="bg-primary text-white text-sm font-medium rounded-md px-4 py-2 hover:brightness-95 transition"
        >
          {initialData ? "Guardar Cambios" : "Guardar División"}
        </button>
      </div>
    </div>
  );
}
