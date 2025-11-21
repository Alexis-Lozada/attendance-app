"use client";

import { Users, BookOpen } from "lucide-react";
import FilterSelect from "@/components/attendance/FilterSelect";
import { useAttendanceFilters } from "@/hooks/attendance/useAttendanceFilters";
import { useCourseSchedule } from "@/hooks/attendance/useCourseSchedule";

export default function AttendancePage() {
  const {
    loading,
    error,
    groups,
    courses,
    selectedGroup,     // idGroup
    selectedCourse,    // idGroupCourse
    setSelectedGroup,
    setSelectedCourse,
  } = useAttendanceFilters();

  // 🔁 SIEMPRE usar value (id) para buscar el grupo
  const groupInfo = groups.find((g) => g.value === selectedGroup);
  const puedePasarLista = groupInfo?.puedePasarLista ?? false;
  const esTutor = groupInfo?.esTutor ?? false;
  const groupLabel = groupInfo?.label ?? "Sin grupo";

  // Info del curso seleccionado (para mostrar el nombre)
  const courseInfo = courses.find((c) => c.value === selectedCourse);

  // Hook de horario, ahora recibe idGroupCourse
  const { schedule, loadingSchedule } = useCourseSchedule(
    puedePasarLista,
    selectedCourse
  );

  // Returns condicionales DESPUÉS de todos los hooks
  if (loading) return <p className="text-gray-700">Cargando filtros...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Columna izquierda */}
      <div className="space-y-6 min-w-[240px] flex-shrink-0 lg:w-1/4">
        {/* Filtro Grupo */}
        <FilterSelect
          title="Grupo"
          value={selectedGroup ?? ""}   // idGroup
          options={groups}
          onSelect={setSelectedGroup}
          icon={<Users className="w-4 h-4" />}
        />

        {/* Filtro Curso */}
        <FilterSelect
          title="Curso"
          value={selectedCourse ?? ""}  // idGroupCourse
          options={puedePasarLista ? courses : []}
          onSelect={setSelectedCourse}
          icon={<BookOpen className="w-4 h-4" />}
        />
      </div>

      {/* Columna derecha */}
      <div className="flex-1 space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Info del curso / grupo */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2 mb-1">
              {groupLabel}

              {esTutor && (
                <span className="bg-primary text-white px-2 py-0.5 rounded-sm font-medium text-xs">
                  Grupo tutorado
                </span>
              )}
            </h4>

            <p className="text-xs text-gray-500">
              {puedePasarLista
                ? courseInfo
                  ? `Curso: ${courseInfo.label}`
                  : "Selecciona un curso"
                : "No puedes pasar lista en este grupo"}
            </p>
          </div>

          {/* Horario real del backend */}
          {puedePasarLista && (
            <div className="md:border-l md:border-gray-200 md:pl-4">
              {loadingSchedule ? (
                <p className="text-sm text-gray-700">Cargando horario...</p>
              ) : schedule ? (
                <>
                  <h4 className="text-sm font-medium text-gray-900">
                    {schedule.startTime} a {schedule.endTime}
                  </h4>
                  <p className="text-xs text-gray-500 capitalize">
                    {schedule.dayOfWeek.toLowerCase()}
                  </p>
                </>
              ) : (
                <p className="text-xs text-gray-500 italic">
                  No hay clases próximas.
                </p>
              )}
            </div>
          )}

          {/* Botón */}
          <button
            disabled={!puedePasarLista}
            className={`
              text-sm font-medium rounded-md px-4 py-2 transition cursor-pointer
              ${
                puedePasarLista
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
