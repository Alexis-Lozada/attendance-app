"use client";

import { useState } from "react";
import { Edit3 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/context/AuthContext";

export default function ChangePasswordCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const idUser = user?.idUser ?? 0;

  const { handleChangePassword, changingPassword } = useProfile(idUser);

  return (
    <>
      {/* === Modal === */}
      <Modal
        title="Cambiar contraseña"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <ChangePasswordForm
          changing={changingPassword}
          onSave={async (data) => {
            await handleChangePassword({
              currentPassword: data.currentPassword,
              newPassword: data.newPassword,
            });
            setIsModalOpen(false);
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* === Tarjeta principal === */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-gray-900">
            Cambio de contraseña
          </h4>
          <p className="text-sm text-gray-500">
            Actualiza tu contraseña para mantener tu cuenta segura.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 text-sm text-gray-700 border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-100 transition"
        >
          <Edit3 className="w-4 h-4" />
          Editar
        </button>
      </div>
    </>
  );
}
