"use client";

import { useEffect, useState } from "react";
import type { User } from "@/types/user";

interface Props {
  initialData: User;
  onSave: (data: Partial<User>) => void;
  onCancel: () => void;
}

export default function ProfileEditForm({ initialData, onSave, onCancel }: Props) {
  const [formData, setFormData] = useState<Partial<User>>({
    firstName: "",
    lastName: "",
    email: "",
    enrollmentNumber: "",
  });

  useEffect(() => {
    setFormData({
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      email: initialData.email,
      enrollmentNumber: initialData.enrollmentNumber,
    });
  }, [initialData]);

  const handleChange = (field: keyof User, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none"
            placeholder="Tu nombre"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none"
            placeholder="Tu apellido"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico *</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none"
          placeholder="ejemplo@correo.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Número de matrícula</label>
        <input
          type="text"
          value={formData.enrollmentNumber || ""}
          onChange={(e) => handleChange("enrollmentNumber", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none"
          placeholder="Opcional"
        />
      </div>

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
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
