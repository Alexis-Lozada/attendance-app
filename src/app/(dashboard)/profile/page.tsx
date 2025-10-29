"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Mail, Image as ImageIcon, Edit3 } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState(user?.profileImage || "/images/user.jpg");

  if (!user) return <p className="text-gray-500">Iniciando sesión...</p>;

  return (
    <div className="flex flex-col gap-6">
      {/* === Encabezado === */}
      <header className="flex flex-col gap-1 mb-3">
        <h3 className="text-[15px] font-semibold text-gray-900">Perfil de usuario</h3>
        <p className="text-[13px] text-gray-500">
          Administra tu información personal y preferencias de cuenta.
        </p>
      </header>

      {/* === Sección de perfil principal === */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 grid grid-cols-1 lg:grid-cols-[1fr_2fr_auto] gap-8 items-start">
        {/* === Columna Izquierda: descripción === */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-1">Perfil</h4>
          <p className="text-sm text-gray-500">
            Configura los detalles de tu cuenta y mantén tu información actualizada.
          </p>
        </div>

        {/* === Columna Central: formulario visual === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Nombre */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Nombre</label>
            <input
              type="text"
              value={user.firstName || ""}
              disabled
              className="border border-gray-200 rounded-md px-3 py-2 bg-gray-50 text-sm text-gray-900 focus:outline-none"
            />
          </div>

          {/* Apellido */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Apellido</label>
            <input
              type="text"
              value={user.lastName || ""}
              disabled
              className="border border-gray-200 rounded-md px-3 py-2 bg-gray-50 text-sm text-gray-900 focus:outline-none"
            />
          </div>

          {/* Correo */}
          <div className="flex flex-col col-span-1 md:col-span-2">
            <label className="text-xs text-gray-500 mb-1">Correo electrónico</label>
            <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2 bg-gray-50">
              <Mail size={16} className="text-gray-500" />
              <span className="text-sm text-gray-900 truncate">{user.email}</span>
            </div>
          </div>
        </div>

        {/* === Columna Derecha: Foto de perfil === */}
        <div className="flex flex-col items-center lg:items-end">
          <div
            className="relative w-28 h-28 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center cursor-pointer group"
            onClick={() => console.log("Cambiar foto (aquí irá el modal o input)")}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Foto de perfil"
                className="w-full h-full object-cover group-hover:brightness-75 transition"
              />
            ) : (
              <ImageIcon className="w-10 h-10 text-gray-400" />
            )}

            {/* Overlay de hover con ícono */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition">
              <Edit3 className="text-white opacity-0 group-hover:opacity-100 transition w-6 h-6" />
            </div>
          </div>
        </div>
      </section>

      {/* === Información adicional === */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col lg:flex-row gap-10">
        {/* Descripción izquierda */}
        <div className="lg:w-1/3">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">
            Información adicional
          </h4>
          <p className="text-sm text-gray-500">
            Datos vinculados a tu registro institucional.
          </p>
        </div>

        {/* Datos */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">Número de matrícula</p>
            <p className="text-sm text-gray-900 border border-gray-200 rounded-md px-3 py-2 bg-gray-50">
              {user.enrollmentNumber || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Universidad asociada</p>
            <p className="text-sm text-gray-900 border border-gray-200 rounded-md px-3 py-2 bg-gray-50">
              {user.idUniversity ? `ID ${user.idUniversity}` : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Fecha de registro</p>
            <p className="text-sm text-gray-900 border border-gray-200 rounded-md px-3 py-2 bg-gray-50">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "—"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
