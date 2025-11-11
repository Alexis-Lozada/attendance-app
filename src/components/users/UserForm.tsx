"use client";

import { useEffect, useState } from "react";
import { User, Mail, IdCard, Eye, EyeOff } from "lucide-react";
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
    status: true,
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
        status: initialData.status,
      });
    } else {
      // Reset form for new user (though this component is mainly for editing)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        enrollmentNumber: "",
        status: true,
      });
    }
    setErrors({});
  }, [initialData]);

  const handleChange = (field: keyof UserType, value: string | boolean) => {
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
      {/* User Info Display (Read-only) */}
      {initialData && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            {initialData.profileImageUrl ? (
              <img
                src={initialData.profileImageUrl}
                alt={initialData.fullName}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-500" />
              </div>
            )}
            <div>
              <p className="font-medium text-gray-900">{initialData.fullName}</p>
              <p className="text-sm text-gray-600">
                {RoleLabels[initialData.role as UserRole] || initialData.role}
              </p>
            </div>
          </div>
          
          {initialData.enrollmentNumber && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Matrícula actual:</span> {initialData.enrollmentNumber}
            </div>
          )}
        </div>
      )}

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

      {/* Status Toggle */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2">
          {formData.status ? (
            <Eye className="w-4 h-4 text-green-600" />
          ) : (
            <EyeOff className="w-4 h-4 text-red-600" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">
            Estado del usuario
          </p>
          <p className="text-xs text-gray-500">
            {formData.status 
              ? "El usuario puede acceder al sistema"
              : "El usuario no puede acceder al sistema"
            }
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={formData.status || false}
            onChange={(e) => handleChange("status", e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>

      {/* Non-editable Fields Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500 mt-0.5 flex-shrink-0"></div>
          <div>
            <p className="text-sm font-medium text-blue-900">Información adicional</p>
            <p className="text-xs text-blue-700 mt-1">
              El rol y la contraseña del usuario no pueden ser modificados desde esta pantalla. 
              El usuario puede cambiar su contraseña desde su perfil.
            </p>
          </div>
        </div>
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