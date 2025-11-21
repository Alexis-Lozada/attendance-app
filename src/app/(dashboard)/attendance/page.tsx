"use client";

import { Users, BookOpen } from "lucide-react";
import FilterSelect from "@/components/attendance/FilterSelect";
import { useAttendanceFilters } from "@/hooks/attendance/useAttendanceFilters";
import { useCourseSchedule } from "@/hooks/attendance/useCourseSchedule";
import {
  formatTimeAMPM,
  formatClassDateEs,
  isNowWithinClass,
} from "@/utils/attendance/DateUtils";

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

  const groupInfo = groups.find((g) => g.value === selectedGroup);
  const puedePasarLista = groupInfo?.puedePasarLista ?? false;
  const esTutor = groupInfo?.esTutor ?? false;
  const groupLabel = groupInfo?.label ?? "Sin grupo";

  const courseInfo = courses.find((c) => c.value === selectedCourse);

  const { schedule, loadingSchedule } = useCourseSchedule(
    puedePasarLista,
    selectedCourse
  );

  // ✅ Solo se puede pasar lista si:
  // - puedePasarLista (es profesor del grupo)
  // - hay horario
  // - y AHORA está dentro del rango de la clase
  const canMarkNow =
    !!schedule &&
    isNowWithinClass(
      schedule.dayOfWeek,
      schedule.startTime,
      schedule.endTime
    );

  const isButtonEnabled = puedePasarLista && canMarkNow;

  if (loading) return <p className="text-gray-700">Cargando filtros...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Columna izquierda */}
      <div className="space-y-6 min-w-[240px] flex-shrink-0 lg:w-1/4">
        {/* Filtro Grupo */}
        <FilterSelect
          title="Grupo"
          value={selectedGroup ?? ""}  // idGroup
          options={groups}
          onSelect={setSelectedGroup}
          icon={<Users className="w-4 h-4" />}
        />

        {/* Filtro Curso */}
        <FilterSelect
          title="Curso"
          value={selectedCourse ?? ""} // idGroupCourse
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
                  {/* Hora - 10:00 AM a 10:45 AM */}
                  <h4 className="text-sm font-medium text-gray-900">
                    Hora - {formatTimeAMPM(schedule.startTime)} a{" "}
                    {formatTimeAMPM(schedule.endTime)}
                  </h4>

                  {/* Ej: Martes 17 de enero 2020 */}
                  <p className="text-xs text-gray-500">
                    {formatClassDateEs(
                      schedule.dayOfWeek,
                      schedule.startTime,
                      schedule.endTime
                    )}
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
            disabled={!isButtonEnabled}
            className={`
              text-sm font-medium rounded-md px-4 py-2 transition bg-primary text-white
              ${isButtonEnabled ? "hover:bg-primary/90 cursor-pointer" : "opacity-60 cursor-not-allowed"}
            `}
          >
            Pasar Asistencia
          </button>
        </div>
      </div>
    </div>
  );
}
