"use client";

import { useMemo } from "react";
import { List, User } from "lucide-react";
import { AttendanceResponse } from "@/services/attendance.service";
import {
  buildStudents,
  buildAttendanceMap,
  buildMonthSegments,
  getStudentStatsForCalendar,
  getCellLetterForCalendar,
  type StudentInfo,
} from "@/utils/attendance/AttendanceTableUtils";
import { useStudentImageUrls } from "@/hooks/attendance/useStudentImageUrls";

// === Tipos que vienen del hook useAttendanceCalendar ===
interface CalendarDay {
  label: string;      // L, M, M, J, V
  date: string;       // "2025-11-06" (ISO sin hora)
  dayNumber: number;  // 6, 7, 8...
}

interface CalendarWeek {
  label: string;      // "Semana 1", "Semana 2", ...
  days: CalendarDay[];
}

interface AttendanceTableProps {
  monthLabel: string; // (ya no lo usamos directamente)
  weeks: CalendarWeek[];
  attendances: AttendanceResponse[];
}

// Columnas de resumen (headers escritos de lado)
const SUMMARY_COLUMNS = [
  { key: "totalAttendance", label: "ASISTENCIA" },
  { key: "attendancePercent", label: "% DE ASISTENCIA" },
  { key: "absences", label: "FALTAS" },
  { key: "tardiness", label: "TARDANZAS" },
  { key: "justifications", label: "JUSTIFICACIONES" },
] as const;

export default function AttendanceTable({
  monthLabel, // eslint-disable-line @typescript-eslint/no-unused-vars
  weeks,
  attendances,
}: AttendanceTableProps) {
  // ==============================
  //  Alumnos únicos
  // ==============================
  const students: StudentInfo[] = useMemo(
    () => buildStudents(attendances),
    [attendances]
  );

  const totalStudents = students.length;

  // ==============================
  //  Mapa alumno+fecha y días del calendario
  // ==============================
  const attendanceByStudentAndDate = useMemo(
    () => buildAttendanceMap(attendances),
    [attendances]
  );

  const allCalendarDays = useMemo(
    () => weeks.flatMap((w) => w.days),
    [weeks]
  );

  const monthSegments = useMemo(
    () => buildMonthSegments(allCalendarDays),
    [allCalendarDays]
  );

  // ==============================
  //  Imágenes de alumnos (UUID → URL)
  // ==============================
  const imageUrls = useStudentImageUrls(students);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {/* Encabezado superior */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200">
            <List className="w-4 h-4 text-gray-700" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-[14px] font-medium text-gray-900">
              Asistencias del grupo
            </h3>
            <p className="text-[12px] text-gray-500">
              Vista tipo calendario para las sesiones del módulo.
            </p>
          </div>
        </div>
      </div>

      {/* Tabla con scroll horizontal SOLO en la tabla */}
      {totalStudents > 0 ? (
        <div className="w-full rounded-md border border-gray-200 overflow-x-auto">
          <div className="min-w-[900px]">
            <table className="w-full text-[13px] text-left text-gray-700">
              <thead>
                {/* Fila 0: Meses + columnas de resumen laterales */}
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-5 py-2 text-left text-[12px] font-medium text-gray-700 border-r border-gray-200 whitespace-nowrap">
                    Alumno
                  </th>

                  {monthSegments.map((segment, idx) => (
                    <th
                      key={`${segment.label}-${idx}`}
                      className="px-5 py-2 text-center text-[12px] font-semibold text-gray-900 border-l border-gray-200"
                      colSpan={segment.colSpan}
                    >
                      {segment.label}
                    </th>
                  ))}

                  {SUMMARY_COLUMNS.map((col) => (
                    <th
                      key={col.key}
                      rowSpan={4}
                      className="px-2 py-2 text-center text-[11px] font-medium text-gray-700 border-l border-gray-200 align-middle"
                    >
                      <span className="inline-block [writing-mode:vertical-rl] rotate-180">
                        {col.label}
                      </span>
                    </th>
                  ))}
                </tr>

                {/* Fila 1: Semanas */}
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-5 py-2 text-left text-[12px] font-medium text-gray-700 border-r border-gray-200" />
                  {weeks.map((week, i) => (
                    <th
                      key={`week-${i}`}
                      className="px-2 py-1 text-center text-[11px] font-medium text-gray-700 border-l border-gray-200"
                      colSpan={week.days.length}
                    >
                      {week.label.toUpperCase()}
                    </th>
                  ))}
                </tr>

                {/* Fila 2: letras de día */}
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-5 py-1 text-left text-[12px] font-medium text-gray-700 border-r border-gray-200" />
                  {weeks.flatMap((week, wi) =>
                    week.days.map((day, di) => (
                      <th
                        key={`weekday-${wi}-${di}`}
                        className="px-2 py-1 text-center text-[11px] font-medium text-gray-600 border-l border-gray-200"
                      >
                        {day.label}
                      </th>
                    ))
                  )}
                </tr>

                {/* Fila 3: números de día */}
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-5 py-1 text-left text-[12px] font-medium text-gray-700 border-r border-gray-200" />
                  {weeks.flatMap((week, wi) =>
                    week.days.map((day, di) => (
                      <th
                        key={`daynum-${wi}-${di}`}
                        className="px-2 py-1 text-center text-[11px] text-gray-700 border-l border-gray-200"
                      >
                        {day.dayNumber}
                      </th>
                    ))
                  )}
                </tr>
              </thead>

              <tbody>
                {students.map((student) => {
                  const stats = getStudentStatsForCalendar(
                    student.idStudent,
                    allCalendarDays,
                    attendanceByStudentAndDate
                  );
                  const imgSrc = imageUrls[student.idStudent];

                  return (
                    <tr
                      key={student.idStudent}
                      className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors"
                    >
                      {/* Alumno */}
                      <td className="px-5 py-[10px] text-gray-700 border-r border-gray-200">
                        <div className="flex items-center gap-3">
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={student.studentName}
                              className="w-8 h-8 aspect-square rounded-md object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 aspect-square rounded-md bg-gray-200 flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-gray-500" />
                            </div>
                          )}
                          <div className="flex flex-col">
                            <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
                              {student.studentName}
                            </p>
                            <p className="text-xs text-gray-500 whitespace-nowrap">
                              Matrícula: {student.enrollmentNumber}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Celdas de días: PRESENT = celda completa en bg-primary */}
                      {weeks.flatMap((week, wi) =>
                        week.days.map((day, di) => {
                          const letter = getCellLetterForCalendar(
                            student.idStudent,
                            day.date,
                            attendanceByStudentAndDate
                          );
                          const isPresent = letter === "P";

                          let cellClasses =
                            "px-2 py-2 text-center text-xs border-l border-gray-200";
                          let cellContent: React.ReactNode = null;

                          if (isPresent) {
                            cellClasses += " bg-primary text-white";
                          } else if (letter) {
                            cellClasses += " text-gray-700";
                            cellContent = (
                              <span className="inline-flex items-center justify-center w-5 h-5 text-[11px] font-semibold border border-gray-300 rounded">
                                {letter}
                              </span>
                            );
                          } else {
                            cellContent = (
                              <span className="inline-block w-3 h-3 rounded-full border border-gray-200 bg-white" />
                            );
                          }

                          return (
                            <td
                              key={`cell-${student.idStudent}-${wi}-${di}`}
                              className={cellClasses}
                            >
                              {cellContent}
                            </td>
                          );
                        })
                      )}

                      {/* Columnas de resumen al final */}
                      <td className="px-3 py-2 text-center text-xs text-gray-700 border-l border-gray-200">
                        {stats.totalAttendance}
                      </td>
                      <td className="px-3 py-2 text-center text-xs text-gray-700 border-l border-gray-200">
                        {stats.attendancePercent}%
                      </td>
                      <td className="px-3 py-2 text-center text-xs text-gray-700 border-l border-gray-200">
                        {stats.absences}
                      </td>
                      <td className="px-3 py-2 text-center text-xs text-gray-700 border-l border-gray-200">
                        {stats.tardiness}
                      </td>
                      <td className="px-3 py-2 text-center text-xs text-gray-700 border-l border-gray-200">
                        {stats.justifications}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-sm text-center py-4">
          No hay registros de asistencia para mostrar.
        </p>
      )}

      {/* Total de alumnos */}
      {totalStudents > 0 && (
        <div className="px-2 py-3 border-t border-gray-200 mt-4">
          <p className="text-gray-700 font-medium text-[13px]">
            Total de alumnos: {totalStudents}
          </p>
        </div>
      )}
    </div>
  );
}
