"use client";

import { useEffect, useState } from "react";
import { User, Mail, IdCard } from "lucide-react";
import { RoleLabels, UserRole } from "@/types/roles";
import type { User as UserType } from "@/types/user";

interface UserWithImage extends UserType {
  profileImageUrl?: string;
  fullName: string;
}

interface Props {
  initialData?: UserWithImage | null;
  onSave: (data: Partial<UserType>, idUser?: number) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function UserForm({ 
  initialData, 
  onSave, 
  onCancel, 
  loading = false 
}: Props) {
  const [formData, setFormData] = useState<Partial<UserType>>({
    firstName: "",
    lastName: "",
    email: "",
    enrollmentNumber: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load initial data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        enrollmentNumber: initialData.enrollmentNumber,
      });
    } else {
      // Reset form for new user (though this component is mainly for editing)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        enrollmentNumber: "",
      });
    }
    setErrors({});
  }, [initialData]);

  const handleChange = (field: keyof UserType, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = "El nombre es requerido";
    } else if (formData.firstName.length > 50) {
      newErrors.firstName = "El nombre no puede exceder 50 caracteres";
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = "Los apellidos son requeridos";
    } else if (formData.lastName.length > 50) {
      newErrors.lastName = "Los apellidos no pueden exceder 50 caracteres";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El formato del email no es válido";
    }

    // Enrollment number is optional but should be validated if provided
    if (formData.enrollmentNumber && formData.enrollmentNumber.length > 20) {
      newErrors.enrollmentNumber = "La matrícula no puede exceder 20 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSave(formData, initialData?.idUser);
  };

  return (
    <div className="space-y-4">
      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            type="text"
            value={formData.firstName || ""}
            onChange={(e) => handleChange("firstName", e.target.value)}
            className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none ${
              errors.firstName ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Nombre del usuario"
            maxLength={50}
          />
          {errors.firstName && (
            <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apellidos *
          </label>
          <input
            type="text"
            value={formData.lastName || ""}
            onChange={(e) => handleChange("lastName", e.target.value)}
            className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none ${
              errors.lastName ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Apellidos del usuario"
            maxLength={50}
          />
          {errors.lastName && (
            <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            className={`w-full border rounded-md pl-10 pr-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none ${
              errors.email ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="correo@ejemplo.com"
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-600 mt-1">{errors.email}</p>
        )}
      </div>

      {/* Enrollment Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Matrícula / Número de Empleado
        </label>
        <div className="relative">
          <IdCard className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={formData.enrollmentNumber || ""}
            onChange={(e) => handleChange("enrollmentNumber", e.target.value)}
            className={`w-full border rounded-md pl-10 pr-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none ${
              errors.enrollmentNumber ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Ej: 2024001, EMP001"
            maxLength={20}
          />
        </div>
        {errors.enrollmentNumber && (
          <p className="text-xs text-red-600 mt-1">{errors.enrollmentNumber}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Opcional. Número de matrícula para estudiantes o número de empleado para personal.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="border border-gray-300 text-gray-700 text-sm font-medium rounded-md px-4 py-2 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="bg-primary text-white text-sm font-medium rounded-md px-4 py-2 hover:brightness-95 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}