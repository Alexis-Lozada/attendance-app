"use client";

import { Edit3, Mail, Lock, Loader2 } from "lucide-react";
import Toast from "@/components/ui/Toast";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function ProfilePage() {
  const {
    user,
    userData,
    profileUrl,
    loading,
    uploading,
    toast,
    setToast,
    fileInputRef,
    handleProfileClick,
    handleFileChange,
  } = useUserProfile();

  if (!user) return <p className="text-gray-500">Iniciando sesión...</p>;
  if (loading) return <p className="text-gray-500">Cargando datos del usuario...</p>;
  if (!userData) return <p className="text-red-500">No se pudieron cargar los datos del usuario.</p>;

  return (
    <div className="flex flex-col gap-6 lg:mr-50">
      {toast && (
        <Toast
          title={toast.title}
          description={toast.description}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <header className="flex flex-col gap-1 mb-3">
        <h3 className="text-[15px] font-semibold text-gray-900">Configuración de cuenta</h3>
        <p className="text-[13px] text-gray-500">
          Administra los detalles de tu perfil e información personal.
        </p>
      </header>

      {/* === Perfil principal === */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div
          className="relative w-24 h-24 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center cursor-pointer group"
          onClick={handleProfileClick}
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
          ) : profileUrl ? (
            <img
              src={profileUrl}
              alt="Foto de perfil"
              className="w-full h-full object-cover group-hover:brightness-75 transition"
            />
          ) : (
            <div className="text-gray-400 text-sm">Sin foto</div>
          )}

          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition">
            <Edit3 className="text-white opacity-0 group-hover:opacity-100 transition w-5 h-5" />
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-base font-semibold text-gray-900">
            {userData.firstName} {userData.lastName}
          </h2>
          <p className="text-sm text-gray-500 flex items-center justify-center md:justify-start gap-2">
            <Mail size={14} /> {userData.email}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {userData.role === "ADMIN"
              ? "Administrador del sistema"
              : userData.role === "TEACHER"
              ? "Docente"
              : userData.role === "STUDENT"
              ? "Estudiante"
              : "Usuario del sistema"}
          </p>
        </div>

        <button className="flex items-center gap-2 text-sm text-gray-700 border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-100 transition">
          <Edit3 className="w-4 h-4" />
          Editar
        </button>
      </section>

      {/* === Información personal === */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Información personal</h4>
            <p className="text-sm text-gray-500">Detalles vinculados a tu cuenta.</p>
          </div>
          <button className="flex items-center gap-2 text-sm text-gray-700 border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-100 transition">
            <Edit3 className="w-4 h-4" />
            Editar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
          <Info label="Nombre" value={userData.firstName} />
          <Info label="Apellido" value={userData.lastName} />
          <Info label="Correo electrónico" value={userData.email} />
          <Info label="Número de matrícula" value={userData.enrollmentNumber} />
          <Info label="Universidad asociada" value={userData.idUniversity ? `ID ${userData.idUniversity}` : "—"} />
          <Info
            label="Fecha de registro"
            value={
              userData.createdAt
                ? new Date(userData.createdAt as any).toLocaleDateString()
                : "—"
            }
          />
        </div>
      </section>

      {/* === Cambio de contraseña === */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Cambio de contraseña</h4>
            <p className="text-sm text-gray-500">
              Actualiza tu contraseña para mantener tu cuenta segura.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
          <PasswordInput label="Contraseña actual" />
          <PasswordInput label="Nueva contraseña" />
          <PasswordInput label="Confirmar nueva contraseña" className="md:col-span-2" />
        </div>

        <div className="flex justify-end mt-6">
          <button
            disabled
            className="flex items-center gap-2 text-sm font-medium text-white bg-primary px-4 py-2 rounded-md opacity-60 cursor-not-allowed"
          >
            <Lock size={16} />
            Guardar cambios
          </button>
        </div>
      </section>
    </div>
  );
}

/* ────────────────────────────── */
/* 📦 Subcomponentes auxiliares  */
/* ────────────────────────────── */
function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm text-gray-900">{value || "—"}</p>
    </div>
  );
}

function PasswordInput({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-xs text-gray-500 mb-1">{label}</label>
      <input
        type="password"
        placeholder="••••••••"
        disabled
        className="border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-900 focus:outline-none"
      />
    </div>
  );
}
