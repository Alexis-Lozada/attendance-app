"use client";

import { useState } from "react";
import { Edit3 } from "lucide-react";
import { University } from "@/types/university";
import Modal from "@/components/ui/Modal";
import UniversityEditForm from "@/components/university/UniversityEditForm";
import Toast from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import { getLogoUrl, updateUniversityWithLogo } from "@/services/university.service";

interface Props {
  university: University;
}

export default function UniversityDetailsCard({ university }: Props) {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentData, setCurrentData] = useState(university);
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    type: "success" | "error";
  } | null>(null);

  const handleSave = async (data: University, selectedFile?: File) => {
    if (!user?.idUniversity) {
      setToast({
        title: "Error",
        description: "No se pudo determinar la universidad del usuario.",
        type: "error",
      });
      return;
    }

    try {
      // 1️⃣ Guardar cambios en el backend
      const updated = await updateUniversityWithLogo(
        user.idUniversity,
        data,
        selectedFile
      );

      // 2️⃣ Obtener la URL real del logo si es necesario
      let logoUrl = updated.logo;
      if (updated.logo && !updated.logo.startsWith("http")) {
        const url = await getLogoUrl(updated.logo);
        if (url) logoUrl = url;
      }

      // 3️⃣ Actualizar los datos en la vista
      setCurrentData({
        ...updated,
        logo: logoUrl,
      });

      // 4️⃣ Mostrar mensaje y cerrar modal
      setToast({
        title: "Universidad actualizada",
        description: "Los cambios se guardaron correctamente.",
        type: "success",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error actualizando universidad:", error);
      setToast({
        title: "Error al guardar",
        description: "No se pudieron aplicar los cambios.",
        type: "error",
      });
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

      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Izquierda: Logo + Información */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
            {currentData.logo ? (
              <img
                src={currentData.logo}
                alt="Logo universidad"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-gray-400 text-sm">Sin logo</div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              {currentData.name}
              <span className="text-xs text-gray-500 font-normal">
                ({currentData.code})
              </span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {currentData.campus} • {currentData.address}
            </p>
            <a
              href={`mailto:${currentData.email}`}
              className="text-sm text-primary hover:underline mt-1 block"
            >
              {currentData.email}
            </a>
          </div>
        </div>

        {/* Derecha: solo botón Editar */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-100 transition"
          >
            <Edit3 className="w-4 h-4" />
            Editar
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal
        title="Editar información de la universidad"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <UniversityEditForm
          initialData={currentData}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
}
