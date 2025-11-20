"use client";

import { Users, BookOpen } from "lucide-react";
import FilterSelect from "@/components/attendance/FilterSelect";
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

  if (loading) return <p className="text-gray-700">Cargando filtros...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const groupInfo = groups.find((g) => g.label === selectedGroup);
  const puedePasarLista = groupInfo?.puedePasarLista ?? false;
  const esTutor = groupInfo?.esTutor ?? false;

  return (
    <div className="flex flex-col lg:flex-row gap-6">

      {/* Columna izquierda */}
      <div className="space-y-6 min-w-[240px] flex-shrink-0 lg:w-1/4">
        
        {/* Filtro Grupo */}
        <FilterSelect
          title="Grupo"
          value={selectedGroup ?? ""}
          options={groups.map((g) => ({
            label: g.label,
            value: g.value,
            esTutor: g.esTutor, // 🔥
          }))}
          onSelect={setSelectedGroup}
          icon={<Users className="w-4 h-4" />}
        />

        {/* Filtro Curso */}
        <FilterSelect
          title="Curso"
          value={selectedCourse ?? "N/A"}
          options={puedePasarLista ? courses : []}
          onSelect={setSelectedCourse}
          icon={<BookOpen className="w-4 h-4" />}
        />
      </div>

      {/* Columna derecha */}
      <div className="flex-1 space-y-6">

        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

          {/* Info del curso */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2 mb-1">
              {selectedGroup}

              {/* 🔥 BADGE TUTORADO ARRIBA */}
              {esTutor && (
                <span className="bg-primary text-white px-2 py-0.5 rounded-sm font-medium text-xs">
                  Grupo tutorado
                </span>
              )}
            </h4>

            <p className="text-xs text-gray-500">
              {puedePasarLista
                ? `Curso: ${selectedCourse}`
                : "No puedes pasar lista en este grupo"}
            </p>
          </div>

          {puedePasarLista && (
            <div className="md:border-l md:border-gray-200 md:pl-4">
              <h4 className="text-sm font-medium text-gray-900">
                Hora - 10:00 AM a 10:45 AM
              </h4>
              <p className="text-xs text-gray-500">
                Semana 3 - Martes 17 de enero 2020
              </p>
            </div>
          )}

          <button
            disabled={!puedePasarLista}
            className={`
              text-sm font-medium rounded-md px-4 py-2 transition cursor-pointer
              ${puedePasarLista
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            Pasar Asistencia
          </button>
        </div>
      </div>
    </div>
  );
}
