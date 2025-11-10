"use client";

import { useEffect, useState } from "react";
import { ChevronDown, User, Calendar, Hash, GraduationCap } from "lucide-react";
import { RoleLabels, UserRole } from "@/types/roles";
import type { GroupWithDetails, GroupFormData } from "@/types/group";
import type { ProgramWithDivision } from "@/types/program";
import type { User as UserType } from "@/types/user";

interface UserWithImage extends UserType {
  profileImageUrl?: string;
}

interface Props {
  initialData?: GroupWithDetails | null;
  programs: ProgramWithDivision[];
  tutors: UserWithImage[];
  onSave: (data: GroupFormData, idGroup?: number) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function GroupForm({ 
  initialData, 
  programs, 
  tutors, 
  onSave, 
  onCancel, 
  loading = false 
}: Props) {
  const [formData, setFormData] = useState<GroupFormData>({
    idProgram: 0,
    idTutor: 0,
    groupCode: "",
    semester: "",
    academicYear: "",
    status: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load initial data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        idProgram: initialData.idProgram,
        idTutor: initialData.idTutor,
        groupCode: initialData.groupCode,
        semester: initialData.semester,
        academicYear: initialData.academicYear,
        status: initialData.status,
      });
    } else {
      // Reset form for new group
      const currentYear = new Date().getFullYear();
      const nextYear = currentYear + 1;
      
      setFormData({
        idProgram: 0,
        idTutor: 0,
        groupCode: "",
        semester: "",
        academicYear: `${currentYear}-${nextYear}`,
        status: true,
      });
    }
    setErrors({});
  }, [initialData]);

  const handleChange = (field: keyof GroupFormData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors((prev) => ({ ...prev, [field as string]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.groupCode.trim()) {
      newErrors.groupCode = "El código del grupo es requerido";
    } else if (formData.groupCode.length > 20) {
      newErrors.groupCode = "El código no puede exceder 20 caracteres";
    }

    if (!formData.semester.trim()) {
      newErrors.semester = "El semestre es requerido";
    } else if (isNaN(Number(formData.semester)) || Number(formData.semester) < 1 || Number(formData.semester) > 12) {
      newErrors.semester = "El semestre debe ser un número entre 1 y 12";
    }

    if (!formData.academicYear.trim()) {
      newErrors.academicYear = "El período académico es requerido";
    }

    if (formData.idProgram === 0 || !formData.idProgram) {
      newErrors.idProgram = "Debe seleccionar un programa educativo";
    }

    if (formData.idTutor === 0 || !formData.idTutor) {
      newErrors.idTutor = "Debe asignar un tutor al grupo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSave(formData, initialData?.idGroup);
  };

  const selectedProgram = programs.find((p) => p.idProgram === formData.idProgram);
  const selectedTutor = tutors.find((t) => t.idUser === formData.idTutor);

  // Generate suggested group code based on program
  const generateGroupCode = () => {
    if (selectedProgram && formData.semester) {
      const programCode = selectedProgram.programCode;
      const semester = formData.semester.padStart(2, '0');
      const suggestedCode = `${programCode}${semester}`;
      setFormData((prev) => ({ ...prev, groupCode: suggestedCode }));
    }
  };

  return (
    <div className="space-y-4">
      {/* Program Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Programa Educativo *
        </label>
        <div className="relative">
          <select
            value={formData.idProgram}
            onChange={(e) => handleChange("idProgram", Number(e.target.value))}
            className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 bg-white appearance-none cursor-pointer focus:ring-1 focus:ring-primary focus:outline-none pr-10 ${
              errors.idProgram ? "border-red-300" : "border-gray-300"
            }`}
          >
            <option value={0}>Seleccionar programa educativo...</option>
            {programs.map((program) => (
              <option key={program.idProgram} value={program.idProgram}>
                {program.programCode} - {program.programName}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        {errors.idProgram && (
          <p className="text-xs text-red-600 mt-1">{errors.idProgram}</p>
        )}
      </div>

      {/* Tutor Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tutor Asignado *
        </label>
        <div className="relative">
          <select
            value={formData.idTutor}
            onChange={(e) => handleChange("idTutor", Number(e.target.value))}
            className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 bg-white appearance-none cursor-pointer focus:ring-1 focus:ring-primary focus:outline-none pr-10 ${
              errors.idTutor ? "border-red-300" : "border-gray-300"
            }`}
          >
            <option value={0}>Seleccionar tutor...</option>
            {tutors.map((tutor) => (
              <option key={tutor.idUser} value={tutor.idUser}>
                {tutor.firstName} {tutor.lastName} - {RoleLabels[tutor.role as UserRole] || tutor.role}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        {errors.idTutor && (
          <p className="text-xs text-red-600 mt-1">{errors.idTutor}</p>
        )}
        
        {selectedTutor && (
          <div className="mt-2 p-2 bg-gray-50 rounded-md border border-gray-200">
            <div className="flex items-center gap-3">
              {selectedTutor.profileImageUrl ? (
                <img
                  src={selectedTutor.profileImageUrl}
                  alt={`${selectedTutor.firstName} ${selectedTutor.lastName}`}
                  className="w-8 h-8 rounded-md object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-md bg-gray-200 flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {selectedTutor.firstName} {selectedTutor.lastName}
                </p>
                <p className="text-xs text-gray-500">{RoleLabels[selectedTutor.role as UserRole] || selectedTutor.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Semester */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Semestre *
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
              placeholder="Ej: 10"
            />
          </div>
          {errors.semester && (
            <p className="text-xs text-red-600 mt-1">{errors.semester}</p>
          )}
        </div>

        {/* Academic Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Período Académico *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={formData.academicYear}
              onChange={(e) => handleChange("academicYear", e.target.value)}
              className={`w-full border rounded-md pl-10 pr-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none ${
                errors.academicYear ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Ej: 2024-2025"
            />
          </div>
          {errors.academicYear && (
            <p className="text-xs text-red-600 mt-1">{errors.academicYear}</p>
          )}
        </div>
      </div>

      {/* Group Code */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Código del Grupo *
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={formData.groupCode}
            onChange={(e) => handleChange("groupCode", e.target.value.toUpperCase())}
            className={`flex-1 border rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none ${
              errors.groupCode ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Ej: IDGS10-A, ISC08-B"
            maxLength={20}
          />
          <button
            type="button"
            onClick={generateGroupCode}
            disabled={!selectedProgram || !formData.semester}
            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Generar código automáticamente"
          >
            Auto
          </button>
        </div>
        {errors.groupCode && (
          <p className="text-xs text-red-600 mt-1">{errors.groupCode}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Ejemplo: IDGS10-A (código del programa + semestre + sección)
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
          {initialData ? "Guardar Cambios" : "Guardar Grupo"}
        </button>
      </div>
    </div>
  );
}