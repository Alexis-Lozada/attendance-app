"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Hash } from "lucide-react";
import Modal from "@/components/ui/Modal";
import type { Division } from "@/types/division";

interface CourseFormData {
  idDivision?: number | null;
  courseCode: string;
  courseName: string;
  semester: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  divisions: Division[];
  initialData?: {
    idCourse: number;
    idDivision?: number | null;
    courseCode: string;
    courseName: string;
    semester?: string | null;
  } | null;
  onSave: (data: CourseFormData, idCourse?: number) => void;
  loading?: boolean;
}

export default function CourseModal({
  isOpen,
  onClose,
  divisions,
  initialData,
  onSave,
  loading = false,
}: Props) {
  const [formData, setFormData] = useState<CourseFormData>({
    idDivision: null,
    courseCode: "",
    courseName: "",
    semester: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar datos iniciales
  useEffect(() => {
    if (initialData) {
      setFormData({
        idDivision: initialData.idDivision ?? null,
        courseCode: initialData.courseCode,
        courseName: initialData.courseName,
        semester: initialData.semester ?? "",
      });
    } else {
      setFormData({
        idDivision: null,
        courseCode: "",
        courseName: "",
        semester: "",
      });
    }
    setErrors({});
  }, [initialData]);

  // Validación
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.courseName.trim()) {
      newErrors.courseName = "El nombre del curso es requerido";
    }

    if (!formData.courseCode.trim()) {
      newErrors.courseCode = "El código del curso es requerido";
    } else if (formData.courseCode.length > 15) {
      newErrors.courseCode = "El código no puede exceder 15 caracteres";
    }

    if (formData.semester && (isNaN(Number(formData.semester)) || Number(formData.semester) < 1)) {
      newErrors.semester = "El semestre debe ser un número válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejador de cambios
  const handleChange = (field: keyof CourseFormData, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSave(formData, initialData?.idCourse);
  };

  return (
    <Modal
      title={initialData ? "Editar curso" : "Agregar nuevo curso"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-4">
        {/* Nombre y código en una misma fila */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nombre del curso */}
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
              placeholder="Ej: Matemáticas Discretas"
            />
            {errors.courseName && (
              <p className="text-xs text-red-600 mt-1">{errors.courseName}</p>
            )}
          </div>

          {/* Código del curso */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código del Curso *
            </label>
            <input
              type="text"
              value={formData.courseCode}
              onChange={(e) =>
                handleChange("courseCode", e.target.value.toUpperCase())
              }
              className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none ${
                errors.courseCode ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Ej: IDGS03"
              maxLength={15}
            />
            {errors.courseCode && (
              <p className="text-xs text-red-600 mt-1">{errors.courseCode}</p>
            )}
          </div>
        </div>

        {/* Semestre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Semestre
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="number"
              min="1"
              max="12"
              value={formData.semester}
              onChange={(e) => handleChange("semester", e.target.value)}
              className={`w-full border rounded-md pl-10 pr-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none ${
                errors.semester ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Ej: 3"
            />
          </div>
          {errors.semester && (
            <p className="text-xs text-red-600 mt-1">{errors.semester}</p>
          )}
        </div>

        {/* División (opcional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            División Asignada (opcional)
          </label>
          <div className="relative">
            <select
              value={formData.idDivision ?? 0}
              onChange={(e) =>
                handleChange(
                  "idDivision",
                  e.target.value === "0" ? null : Number(e.target.value)
                )
              }
              className={`w-full border rounded-md pl-3 pr-10 py-2 text-sm text-gray-900 bg-white appearance-none focus:ring-1 focus:ring-primary focus:outline-none border-gray-300`}
            >
              <option value={0}>Sin división</option>
              {divisions.map((division) => (
                <option key={division.idDivision} value={division.idDivision}>
                  {division.code} - {division.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
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
    </Modal>
  );
}
