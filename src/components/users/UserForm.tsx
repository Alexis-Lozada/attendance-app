"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { UserRole, RoleLabels } from "@/types/roles";
import type { UserWithDetails, UserFormData } from "@/types/user";

interface Props {
  initialData?: UserWithDetails | null;
  onSave: (data: UserFormData, idUser?: number) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function UserForm({ 
  initialData, 
  onSave, 
  onCancel, 
  loading = false 
}: Props) {
  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    enrollmentNumber: "",
    firstName: "",
    lastName: "",
    role: UserRole.STUDENT,
    status: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load initial data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.email,
        enrollmentNumber: initialData.enrollmentNumber || "",
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        role: initialData.role,
        status: initialData.status,
      });
    } else {
      // Reset form for new user
      setFormData({
        email: "",
        enrollmentNumber: "",
        firstName: "",
        lastName: "",
        role: UserRole.STUDENT,
        status: true,
      });
    }
    setErrors({});
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El correo electrónico no tiene un formato válido";
    }

    // Names validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "El nombre debe tener al menos 2 caracteres";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Los apellidos son requeridos";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Los apellidos deben tener al menos 2 caracteres";
    }

    // Enrollment number validation (only for students)
    if (formData.role === UserRole.STUDENT) {
      if (!formData.enrollmentNumber?.trim()) {
        newErrors.enrollmentNumber = "La matrícula es requerida para estudiantes";
      } else if (formData.enrollmentNumber.length < 5) {
        newErrors.enrollmentNumber = "La matrícula debe tener al menos 5 caracteres";
      }
    }

    // Role validation
    if (!Object.values(UserRole).includes(formData.role as UserRole)) {
      newErrors.role = "Debe seleccionar un rol válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSave(formData, initialData?.idUser);
  };

  const isStudent = formData.role === UserRole.STUDENT;

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
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Nombre del usuario"
            className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none ${
              errors.firstName ? "border-red-300" : "border-gray-300"
            }`}
          />
          {errors.firstName && (
            <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apellido *
          </label>
          <input
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Apellidos del usuario"
            className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none ${
              errors.lastName ? "border-red-300" : "border-gray-300"
            }`}
          />
          {errors.lastName && (
            <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* === Correo electrónico === */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Correo electrónico *
        </label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="usuario@universidad.edu"
          className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none ${
            errors.email ? "border-red-300" : "border-gray-300"
          }`}
        />
        {errors.email && (
          <p className="text-xs text-red-600 mt-1">{errors.email}</p>
        )}
      </div>

      {/* === Matrícula === */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Matrícula {isStudent ? "*" : "(opcional)"}
        </label>
        <input
          name="enrollmentNumber"
          type="text"
          value={formData.enrollmentNumber}
          onChange={handleChange}
          placeholder={isStudent ? "Matrícula del estudiante" : "Opcional"}
          disabled={!isStudent}
          className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none ${
            errors.enrollmentNumber ? "border-red-300" : "border-gray-300"
          } ${!isStudent ? "bg-gray-50" : ""}`}
        />
        {errors.enrollmentNumber && (
          <p className="text-xs text-red-600 mt-1">{errors.enrollmentNumber}</p>
        )}
      </div>

      {/* === Rol del Usuario === */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rol del Usuario *
        </label>
        <div className="relative">
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 bg-white appearance-none cursor-pointer focus:ring-1 focus:ring-primary focus:outline-none pr-10 ${
              errors.role ? "border-red-300" : "border-gray-300"
            }`}
          >
            {Object.entries(RoleLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        {errors.role && (
          <p className="text-xs text-red-600 mt-1">{errors.role}</p>
        )}
      </div>

      {/* === Botones === */}
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
          type="submit"
          disabled={loading}
          className="bg-primary text-white text-sm font-medium rounded-md px-4 py-2 hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {initialData ? "Actualizar Usuario" : "Crear Usuario"}
        </button>
      </div>
    </form>
  );
}