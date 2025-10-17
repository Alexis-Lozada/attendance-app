"use client";

import { useRef, useState } from "react";
import { University } from "@/types/university";
import { Upload } from "lucide-react";

interface Props {
  initialData: University;
  onSave: (data: University, selectedFile?: File) => void;
  onCancel: () => void;
}

export default function UniversityEditForm({ initialData, onSave, onCancel }: Props) {
  const [formData, setFormData] = useState<University>(initialData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof University, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFormData((prev) => ({ ...prev, logo: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    onSave(formData, selectedFile || undefined);
  };

  return (
    <div className="space-y-4">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
          {formData.logo ? (
            <img src={formData.logo} alt="Logo" className="w-full h-full object-contain" />
          ) : (
            <span className="text-gray-400 text-sm">Sin logo</span>
          )}
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
        >
          <Upload className="w-4 h-4" />
          Subir logo
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Campos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Nombre", field: "name" },
          { label: "Código", field: "code" },
          { label: "Campus", field: "campus" },
          { label: "Dirección", field: "address" },
          { label: "Correo institucional", field: "email" },
        ].map(({ label, field }) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type="text"
              value={formData[field as keyof University] as string}
              onChange={(e) => handleChange(field as keyof University, e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>
        ))}
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
          Guardar
        </button>
      </div>
    </div>
  );
}
