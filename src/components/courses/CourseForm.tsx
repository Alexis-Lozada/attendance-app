"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { CourseWithDetails, CourseFormData } from "@/types/course";
import type { Division } from "@/types/division";

interface Props {
  initialData?: CourseWithDetails | null;
  divisions: Division[];
  onSave: (data: CourseFormData, idCourse?: number) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function CourseForm({ 
  initialData, 
  divisions, 
  onSave, 
  onCancel, 
  loading = false 
}: Props) {
  const [formData, setFormData] = useState<CourseFormData>({
    idUniversity: 0,
    idDivision: null,
    courseCode: "",
    courseName: "",
    semester: null,
    status: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load initial data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        idUniversity: initialData.idUniversity,
        idDivision: initialData.idDivision || null,
        courseCode: initialData.courseCode,
        courseName: initialData.courseName,
        semester: initialData.semester || null,
        status: initialData.status,
      });
    } else {
      // Reset form for new course
      setFormData({
        idUniversity: 0,
        idDivision: null,
        courseCode: "",
        courseName: "",
        semester: null,
        status: true,
      });
    }
    setErrors({});
  }, [initialData]);

  const handleChange = (field: keyof CourseFormData, value: string | number | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.courseCode.trim()) {
      newErrors.courseCode = "El código del curso es requerido";
    } else if (formData.courseCode.length > 10) {
      newErrors.courseCode = "El código no puede exceder 10 caracteres";
    }

    if (!formData.courseName.trim()) {
      newErrors.courseName = "El nombre del curso es requerido";
    } else if (formData.courseName.length > 100) {
      newErrors.courseName = "El nombre no puede exceder 100 caracteres";
    }

    // Semester is optional but if provided should be valid
    if (formData.semester && (isNaN(Number(formData.semester)) || Number(formData.semester) < 1 || Number(formData.semester) > 12)) {
      newErrors.semester = "El semestre debe ser un número entre 1 y 12";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSave(formData, initialData?.idCourse);
  };

  const semesterOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  return (
    <div className="space-y-4">
      {/* Course Code */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Código del Curso *
        </label>
        <input
          type="text"
          value={formData.courseCode}
          onChange={(e) => handleChange("courseCode", e.target.value.toUpperCase())}
          className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none ${
            errors.courseCode ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Ej: MAT101, PROG201, ADM101"
          maxLength={10}
        />
        {errors.courseCode && (
          <p className="text-xs text-red-600 mt-1">{errors.courseCode}</p>
        )}
      </div>

      {/* Course Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del Curso *
        </label>
        <input
          type="text"
          value={formData.courseName}
          onChange={(e) => handleChange("courseName", e.target.value)}
          className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none ${
            errors.courseName ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Ej: Matemáticas Discretas, Programación Orientada a Objetos"
          maxLength={100}
        />
        {errors.courseName && (
          <p className="text-xs text-red-600 mt-1">{errors.courseName}</p>
        )}
      </div>

      {/* Division Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          División Académica
        </label>
        <div className="relative">
          <select
            value={formData.idDivision || ""}
            onChange={(e) => handleChange("idDivision", e.target.value ? Number(e.target.value) : null)}
            className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 bg-white appearance-none cursor-pointer focus:ring-1 focus:ring-primary focus:outline-none pr-10 ${
              errors.idDivision ? "border-red-300" : "border-gray-300"
            }`}
          >
            <option value="">Curso general (sin división específica)</option>
            {divisions.map((division) => (
              <option key={division.idDivision} value={division.idDivision}>
                {division.code} - {division.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Opcional: Selecciona una división si el curso es específico para esa área
        </p>
        {errors.idDivision && (
          <p className="text-xs text-red-600 mt-1">{errors.idDivision}</p>
        )}
      </div>

      {/* Semester */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Semestre
        </label>
        <div className="relative">
          <select
            value={formData.semester || ""}
            onChange={(e) => handleChange("semester", e.target.value || null)}
            className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 bg-white appearance-none cursor-pointer focus:ring-1 focus:ring-primary focus:outline-none pr-10 ${
              errors.semester ? "border-red-300" : "border-gray-300"
            }`}
          >
            <option value="">Curso general (sin semestre específico)</option>
            {semesterOptions.map((semester) => (
              <option key={semester} value={semester}>
                {semester}° Semestre
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Opcional: Selecciona el semestre si el curso es para un semestre específico
        </p>
        {errors.semester && (
          <p className="text-xs text-red-600 mt-1">{errors.semester}</p>
        )}
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
          {initialData ? "Guardar Cambios" : "Guardar Curso"}
        </button>
      </div>
    </div>
  );
}
