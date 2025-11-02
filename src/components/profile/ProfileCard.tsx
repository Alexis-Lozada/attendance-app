"use client";

import { useRef } from "react";
import { Edit3, Mail, Loader2 } from "lucide-react";
import { UserRole, RoleLabels } from "@/types/roles";
import type { User } from "@/types/user";

interface ProfileCardProps {
  userData: User | null;
  profileUrl: string | null;
  uploading: boolean;
  onProfileImageChange: (file: File) => void;
}

export default function ProfileCard({
  userData,
  profileUrl,
  uploading,
  onProfileImageChange,
}: ProfileCardProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!userData)
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-center">
        <p className="text-sm text-red-500">No se encontró información del usuario.</p>
      </div>
    );

  const handleClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onProfileImageChange(file);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
      {/* === Imagen de perfil === */}
      <div
        className="relative w-24 h-24 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center cursor-pointer group"
        onClick={handleClick}
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
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* === Información principal === */}
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-base font-semibold text-gray-900">
          {userData.firstName} {userData.lastName}
        </h2>
        <p className="text-sm text-gray-500 flex items-center justify-center md:justify-start gap-2">
          <Mail size={14} /> {userData.email}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {RoleLabels[userData.role as UserRole] || "Usuario"}
        </p>
      </div>
    </div>
  );
}
