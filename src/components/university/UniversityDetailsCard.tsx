"use client";

import { useRef, useState } from "react";
import { University } from "@/types/university";
import { Building2, Upload } from "lucide-react";
import { updateUniversityWithLogo } from "@/services/university.service";
import { useAuth } from "@/context/AuthContext";
import Toast from "@/components/ui/Toast";

interface Props {
  initialData: University;
  onSave: (data: University) => void;
}

export default function UniversityDetailsCard({ initialData, onSave }: Props) {
  const { user } = useAuth();
  const [university, setUniversity] = useState<University>(initialData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    type: "success" | "error";
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const inputBase =
    "w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-gray-400 focus:outline-none";

  const handleChange = (field: keyof University, value: string) => {
    setUniversity((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUniversity((prev) => ({ ...prev, logo: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!user?.idUniversity) {
      setToast({
        title: "Error",
        description: "No se pudo determinar la universidad del usuario.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const updated = await updateUniversityWithLogo(
        user.idUniversity,
        university,
        selectedFile || undefined
      );
      onSave(updated);
      setToast({
        title: "Universidad actualizada",
        description: "Los cambios se guardaron correctamente.",
        type: "success",
      });
    } catch (error) {
      console.error("Error actualizando universidad:", error);
      setToast({
        title: "Error al guardar",
        description: "No se pudieron aplicar los cambios.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast
          title={toast.title}
          description={toast.description}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

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

        {/* Contenido */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Logo */}
          <div className="flex flex-col items-center justify-center md:col-span-1">
            <div className="w-24 h-24 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
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
                onClick={() => fileInputRef.current?.click()}
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

          {/* Campos */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Nombre", field: "name" },
              { label: "Código", field: "code" },
              { label: "Campus", field: "campus" },
              { label: "Dirección", field: "address" },
            ].map(({ label, field }) => (
              <div key={field}>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <input
                  type="text"
                  value={university[field as keyof University] as string}
                  onChange={(e) =>
                    handleChange(field as keyof University, e.target.value)
                  }
                  className={inputBase}
                />
              </div>
            ))}

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Correo institucional
              </label>
              <input
                type="email"
                value={university.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={inputBase}
              />
            </div>
          </div>
        </div>

        {/* Botón Guardar */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            disabled={loading}
            className={`bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg transition ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:brightness-95"
            }`}
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </>
  );
}
