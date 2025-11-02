"use client";

import type { User } from "@/types/user";
import { useState } from "react";

interface ProfileEditFormProps {
  initialData: User;
  onSave: (data: Partial<User>) => void;
  onCancel: () => void;
}

export default function ProfileEditForm({
  initialData,
  onSave,
  onCancel,
}: ProfileEditFormProps) {
  const [formData, setFormData] = useState<Partial<User>>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* === Nombre y Apellido === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            name="firstName"
            type="text"
            value={formData.firstName || ""}
            onChange={handleChange}
            placeholder="Tu nombre"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apellido *
          </label>
          <input
            name="lastName"
            type="text"
            value={formData.lastName || ""}
            onChange={handleChange}
            placeholder="Tu apellido"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>
      </div>

      {/* === Correo === */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Correo electrónico *
        </label>
        <input
          name="email"
          type="email"
          value={formData.email || ""}
          onChange={handleChange}
          placeholder="ejemplo@correo.com"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none"
        />
      </div>

      {/* === Matrícula === */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Número de matrícula
        </label>
        <input
          name="enrollmentNumber"
          type="text"
          value={formData.enrollmentNumber || ""}
          onChange={handleChange}
          placeholder="Opcional"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none"
        />
      </div>

      {/* === Botones === */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="border border-gray-300 text-gray-700 text-sm font-medium rounded-md px-4 py-2 hover:bg-gray-100 transition cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-primary text-white text-sm font-medium rounded-md px-4 py-2 hover:bg-primary/90 transition cursor-pointer"
        >
          Guardar cambios
        </button>
      </div>
    </form>
  );
}
