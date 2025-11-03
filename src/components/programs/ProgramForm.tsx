"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Program, ProgramWithDivision, Division, ProgramFormData } from "@/types/program";

interface Props {
  initialData?: ProgramWithDivision | null;
  divisions: Division[];
  onSave: (data: ProgramFormData, idProgram?: number) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ProgramForm({ 
  initialData, 
  divisions, 
  onSave, 
  onCancel, 
  loading = false 
}: Props) {
  const [formData, setFormData] = useState<ProgramFormData>({
    idDivision: 0,
    programCode: "",
    programName: "",
    description: "",
    status: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load initial data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        idDivision: initialData.idDivision,
        programCode: initialData.programCode,
        programName: initialData.programName,
        description: initialData.description,
        status: initialData.status,
      });
    } else {
      // Reset form for new program
      setFormData({
        idDivision: 0,
        programCode: "",
        programName: "",
        description: "",
        status: true,
      });
    }
    setErrors({});
  }, [initialData]);

  const handleChange = (field: keyof ProgramFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.programCode.trim()) {
      newErrors.programCode = "El código es requerido";
    } else if (formData.programCode.length > 10) {
      newErrors.programCode = "El código no puede exceder 10 caracteres";
    }

    if (!formData.programName.trim()) {
      newErrors.programName = "El nombre del programa es requerido";
    } else if (formData.programName.length > 100) {
      newErrors.programName = "El nombre no puede exceder 100 caracteres";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es requerida";
    } else if (formData.description.length > 500) {
      newErrors.description = "La descripción no puede exceder 500 caracteres";
    }

    if (formData.idDivision === 0 || !formData.idDivision) {
      newErrors.idDivision = "Debe seleccionar una división";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSave(formData, initialData?.idProgram);
  };

  return (
    <div className="space-y-4">
      {/* Division Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          División Académica *
        </label>
        <div className="relative">
          <select
            value={formData.idDivision}
            onChange={(e) => handleChange("idDivision", Number(e.target.value))}
            className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 bg-white appearance-none cursor-pointer focus:ring-1 focus:ring-primary focus:outline-none pr-10 ${
              errors.idDivision ? "border-red-300" : "border-gray-300"
            }`}
          >
            <option value={0}>Seleccionar división...</option>
            {divisions.map((division) => (
              <option key={division.idDivision} value={division.idDivision}>
                {division.code} - {division.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        {errors.idDivision && (
          <p className="text-xs text-red-600 mt-1">{errors.idDivision}</p>
        )}
      </div>

      {/* Form Fields */}
      <div>
        {/* Program Code */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código del Programa *
          </label>
          <input
            type="text"
            value={formData.programCode}
            onChange={(e) => handleChange("programCode", e.target.value.toUpperCase())}
            className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none ${
              errors.programCode ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Ej: IDGS, ISC, LAE"
            maxLength={10}
          />
          {errors.programCode && (
            <p className="text-xs text-red-600 mt-1">{errors.programCode}</p>
          )}
        </div>
      </div>

      {/* Program Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del Programa *
        </label>
        <input
          type="text"
          value={formData.programName}
          onChange={(e) => handleChange("programName", e.target.value)}
          className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none ${
            errors.programName ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Ej: Ingeniería en Desarrollo y Gestión de Software"
          maxLength={100}
        />
        {errors.programName && (
          <p className="text-xs text-red-600 mt-1">{errors.programName}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={3}
          className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none resize-none ${
            errors.description ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Describe el programa educativo, sus objetivos y características principales..."
          maxLength={500}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.description ? (
            <p className="text-xs text-red-600">{errors.description}</p>
          ) : (
            <span className="text-xs text-gray-500">
              {formData.description.length}/500 caracteres
            </span>
          )}
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
          {initialData ? "Guardar Cambios" : "Guardar Programa"}
        </button>
      </div>
    </div>
  );
}