"use client";

import { useEffect, useState } from "react";
import { User, Mail, IdCard, Shield, Building2, Key } from "lucide-react";
import { RoleLabels, UserRole } from "@/types/roles";
import type { User as UserType } from "@/types/user";

interface UserWithImage extends UserType {
  profileImageUrl?: string;
  fullName: string;
}

interface Division {
  idDivision: number;
  code: string;
  name: string;
}

interface Props {
  initialData?: UserWithImage | null;
  onSave: (data: Partial<UserType> & { password?: string }, idUser?: number) => void;
  onCancel: () => void;
  loading?: boolean;
  isAdmin?: boolean;
  isCoordinator?: boolean;
  userDivision?: number | null;
  divisions?: Division[];
}

export default function UserForm({ 
  initialData, 
  onSave, 
  onCancel, 
  loading = false,
  isAdmin = false,
  isCoordinator = false,
  userDivision = null,
  divisions = []
}: Props) {
  const [formData, setFormData] = useState<Partial<UserType> & { password?: string }>({
    firstName: "",
    lastName: "",
    email: "",
    enrollmentNumber: "",
    role: isCoordinator ? UserRole.TUTOR : UserRole.COORDINATOR,
    idDivision: isCoordinator ? userDivision : undefined,
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEditMode = !!initialData;

  // Definir roles permitidos según el usuario actual
  const allowedRoles = isAdmin 
    ? [UserRole.COORDINATOR] 
    : [UserRole.TUTOR, UserRole.TEACHER, UserRole.STUDENT];

  // Load initial data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        enrollmentNumber: initialData.enrollmentNumber,
        role: initialData.role,
        idDivision: initialData.idDivision,
      });
    } else {
      // Reset form for new user
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        enrollmentNumber: "",
        role: isCoordinator ? UserRole.TUTOR : UserRole.COORDINATOR,
        idDivision: isCoordinator ? userDivision : undefined,
        password: "",
      });
    }
    setErrors({});
  }, [initialData, isCoordinator, userDivision]);

  const handleChange = (field: keyof (UserType & { password?: string }), value: string | number) => {
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

    // Password validation only for new users
    if (!isEditMode) {
      if (!formData.password?.trim()) {
        newErrors.password = "La contraseña es requerida";
      } else if (formData.password.length < 6) {
        newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      }
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = "El rol es requerido";
    }

    // Division validation for admin creating coordinators
    if (isAdmin && formData.role === UserRole.COORDINATOR && !formData.idDivision) {
      newErrors.idDivision = "La división es requerida para coordinadores";
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
    
    // Remove password from data if editing
    const dataToSave = isEditMode 
      ? { ...formData, password: undefined }
      : formData;
    
    onSave(dataToSave, initialData?.idUser);
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

      {/* Password - Only for new users */}
      {!isEditMode && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña *
          </label>
          <div className="relative">
            <Key className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="password"
              value={formData.password || ""}
              onChange={(e) => handleChange("password", e.target.value)}
              className={`w-full border rounded-md pl-10 pr-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none ${
                errors.password ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Mínimo 6 caracteres"
              minLength={6}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-red-600 mt-1">{errors.password}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            La contraseña debe tener al menos 6 caracteres.
          </p>
        </div>
      )}

      {/* Role Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rol *
        </label>
        <div className="relative">
          <Shield className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <select
            value={formData.role || ""}
            onChange={(e) => handleChange("role", e.target.value)}
            disabled={isEditMode}
            className={`w-full border rounded-md pl-10 pr-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed ${
              errors.role ? "border-red-300" : "border-gray-300"
            }`}
          >
            <option value="">Selecciona un rol</option>
            {allowedRoles.map((role) => (
              <option key={role} value={role}>
                {RoleLabels[role]}
              </option>
            ))}
          </select>
        </div>
        {errors.role && (
          <p className="text-xs text-red-600 mt-1">{errors.role}</p>
        )}
        {isEditMode && (
          <p className="text-xs text-gray-500 mt-1">
            El rol no puede ser modificado después de crear el usuario.
          </p>
        )}
      </div>

      {/* Division Selection - Only for Admin creating Coordinators */}
      {isAdmin && formData.role === UserRole.COORDINATOR && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            División *
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <select
              value={formData.idDivision || ""}
              onChange={(e) => handleChange("idDivision", Number(e.target.value))}
              disabled={isEditMode}
              className={`w-full border rounded-md pl-10 pr-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.idDivision ? "border-red-300" : "border-gray-300"
              }`}
            >
              <option value="">Selecciona una división</option>
              {divisions.map((division) => (
                <option key={division.idDivision} value={division.idDivision}>
                  {division.code} - {division.name}
                </option>
              ))}
            </select>
          </div>
          {errors.idDivision && (
            <p className="text-xs text-red-600 mt-1">{errors.idDivision}</p>
          )}
          {isEditMode && (
            <p className="text-xs text-gray-500 mt-1">
              La división no puede ser modificada después de crear el usuario.
            </p>
          )}
        </div>
      )}

      {/* Division Info - For Coordinators (read-only) */}
      {isCoordinator && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            División
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={divisions.find(d => d.idDivision === userDivision)?.name || "Tu división"}
              disabled
              className="w-full border border-gray-300 bg-gray-100 rounded-md pl-10 pr-3 py-2 text-sm text-gray-600 cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Los usuarios que crees pertenecerán automáticamente a tu división.
          </p>
        </div>
      )}

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
          {isEditMode ? "Guardar Cambios" : "Crear Usuario"}
        </button>
      </div>
    </div>
  );
}