"use client";

import { useState } from "react";
import { Edit3 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import type { User } from "@/types/user";
import { useProfile } from "@/hooks/useProfile";

interface PersonalInfoCardProps {
  userData: User | null;
  universityName: string | null;
  handleSaveProfile: (data: Partial<User>) => Promise<void>; // 👈 nuevo prop
}

export default function PersonalInfoCard({
  userData,
  universityName,
  handleSaveProfile,
}: PersonalInfoCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!userData)
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-center">
        <p className="text-sm text-red-500">No se encontraron datos del usuario.</p>
      </div>
    );

  return (
    <>
      <Modal
        title="Editar información del perfil"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <ProfileEditForm
          initialData={userData}
          onSave={async (data) => {
            await handleSaveProfile(data);
            setIsModalOpen(false);
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Información personal</h4>
            <p className="text-sm text-gray-500">Detalles vinculados a tu cuenta.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 text-sm text-gray-700 border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-100 transition cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            Editar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">Nombre</p>
            <p className="text-sm text-gray-900">{userData.firstName || "—"}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Apellido</p>
            <p className="text-sm text-gray-900">{userData.lastName || "—"}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Correo electrónico</p>
            <p className="text-sm text-gray-900">{userData.email || "—"}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Número de matrícula</p>
            <p className="text-sm text-gray-900">{userData.enrollmentNumber || "—"}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Universidad asociada</p>
            <p className="text-sm text-gray-900">{universityName || "—"}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Fecha de registro</p>
            <p className="text-sm text-gray-900">
              {userData.createdAt
                ? new Date(userData.createdAt).toLocaleDateString()
                : "—"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
