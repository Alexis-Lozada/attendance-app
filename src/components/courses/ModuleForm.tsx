"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import type { CourseModule, CourseModuleFormData } from "@/types/course";

interface Props {
  initialData?: CourseModule | null;
  idCourse: number;
  existingModules: CourseModule[];
  onSave: (data: CourseModuleFormData, idModule?: number) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ModuleForm({ 
  initialData, 
  idCourse,
  existingModules,
  onSave, 
  onCancel, 
  loading = false 
}: Props) {
  const [formData, setFormData] = useState<CourseModuleFormData>({
    idCourse,
    moduleNumber: 1,
    title: "",
    startDate: null,
    endDate: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load initial data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        idCourse: initialData.idCourse,
        moduleNumber: initialData.moduleNumber,
        title: initialData.title,
        startDate: initialData.startDate || null,
        endDate: initialData.endDate || null,
      });
    } else {
      // Auto-suggest next module number
      const maxModuleNumber = existingModules.length > 0
        ? Math.max(...existingModules.map(m => m.moduleNumber))
        : 0;
      
      setFormData({
        idCourse,
        moduleNumber: maxModuleNumber + 1,
        title: "",
        startDate: null,
        endDate: null,
      });
    }
    setErrors({});
  }, [initialData, idCourse, existingModules]);

  const handleChange = (field: keyof CourseModuleFormData, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.moduleNumber || formData.moduleNumber < 1) {
      newErrors.moduleNumber = "El número de módulo debe ser mayor a 0";
    } else {
      // Check if module number already exists (only when creating or changing number)
      const isDuplicate = existingModules.some(
        m => m.moduleNumber === formData.moduleNumber && m.idModule !== initialData?.idModule
      );
      if (isDuplicate) {
        newErrors.moduleNumber = "Ya existe un módulo con este número";
      }
    }

    if (!formData.title.trim()) {
      newErrors.title = "El título del módulo es requerido";
    } else if (formData.title.length > 200) {
      newErrors.title = "El título no puede exceder 200 caracteres";
    }

    // Validate dates if both are provided
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (end <= start) {
        newErrors.endDate = "La fecha de fin debe ser posterior a la fecha de inicio";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSave(formData, initialData?.idModule);
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      {/* Module Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Número de Módulo *
        </label>
        <input
          type="number"
          min="1"
          value={formData.moduleNumber}
          onChange={(e) => handleChange("moduleNumber", parseInt(e.target.value) || 1)}
          className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none ${
            errors.moduleNumber ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="1, 2, 3..."
        />
        {errors.moduleNumber && (
          <p className="text-xs text-red-600 mt-1">{errors.moduleNumber}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Orden del módulo en el curso (ej: 1, 2, 3...)
        </p>
      </div>

      {/* Module Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Título del Módulo *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none ${
            errors.title ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Ej: Introducción a la Programación, Estructuras de Datos"
          maxLength={200}
        />
        {errors.title && (
          <p className="text-xs text-red-600 mt-1">{errors.title}</p>
        )}
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Inicio
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.startDate || ""}
              onChange={(e) => handleChange("startDate", e.target.value || null)}
              className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none ${
                errors.startDate ? "border-red-300" : "border-gray-300"
              }`}
            />
            <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          {errors.startDate && (
            <p className="text-xs text-red-600 mt-1">{errors.startDate}</p>
          )}
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Fin
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.endDate || ""}
              onChange={(e) => handleChange("endDate", e.target.value || null)}
              min={formData.startDate || today}
              className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none ${
                errors.endDate ? "border-red-300" : "border-gray-300"
              }`}
            />
            <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          {errors.endDate && (
            <p className="text-xs text-red-600 mt-1">{errors.endDate}</p>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Las fechas son opcionales y ayudan a organizar el calendario académico
      </p>

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
          {initialData ? "Guardar Cambios" : "Crear Módulo"}
        </button>
      </div>
    </div>
  );
}