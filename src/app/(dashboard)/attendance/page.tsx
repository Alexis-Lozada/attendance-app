"use client";

import FilterSelect from "@/components/attendance/FilterSelect";
import { Users, BookOpen } from "lucide-react";
import { useAttendanceFilters } from "@/hooks/attendance/useAttendanceFilters";

export default function AttendancePage() {
  const {
    loading,
    error,
    groups,
    courses,
    selectedGroup,
    selectedCourse,
    setSelectedGroup,
    setSelectedCourse,
  } = useAttendanceFilters();

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="flex flex-col lg:flex-row gap-6">

      {/* FILTROS */}
      <div className="space-y-6 min-w-[240px] flex-shrink-0 lg:w-1/4">

        <FilterSelect
          title="Grupo"
          value={selectedGroup ?? ""}
          options={groups}
          onSelect={setSelectedGroup}
          icon={<Users className="w-4 h-4" />}
        />

        <FilterSelect
          title="Curso"
          value={selectedCourse ?? ""}
          options={courses}
          onSelect={setSelectedCourse}
          icon={<BookOpen className="w-4 h-4" />}
        />
      </div>

      {/* ENCABEZADO */}
      <div className="flex-1 space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

          <div>
            <h4 className="text-sm font-medium text-gray-900">
              {selectedCourse}
            </h4>
            <p className="text-xs text-gray-500">
              Grupo {selectedGroup}
            </p>
          </div>

          <div className="md:border-l md:border-gray-200 md:pl-4">
            <h4 className="text-sm font-medium text-gray-900">
              Hora - 10:00 AM a 10:45 AM
            </h4>
            <p className="text-xs text-gray-500">
              Semana 3 - Martes 17 de enero 2020
            </p>
          </div>

          <button className="bg-[#2B2B2B] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#3c3c3c] transition">
            Pasar Asistencia
          </button>

        </div>
      </div>
    </div>
  );
}
