"use client";

import { List, User } from "lucide-react";
import type { AttendanceCalendarWeek } from "@/hooks/attendance/useAttendanceCalendar";

interface AttendanceRow {
  id: number;
  studentName: string;
  enrollment: string;
  studentImage?: string;
  totalAttendance: number;
  attendancePercent: number;
  absences: number;
  tardiness: number;
  justifications: number;
}

// Datos fake
const MOCK_ATTENDANCE_DATA: AttendanceRow[] = [
  {
    id: 1,
    studentName: "Alexis Lozada Salinas",
    enrollment: "2023371007",
    totalAttendance: 18,
    attendancePercent: 90,
    absences: 2,
    tardiness: 1,
    justifications: 1,
  },
  {
    id: 2,
    studentName: "María Fernanda López Hernández",
    enrollment: "2023371010",
    totalAttendance: 17,
    attendancePercent: 85,
    absences: 3,
    tardiness: 2,
    justifications: 0,
  },
  {
    id: 3,
    studentName: "Carlos Eduardo Hernández Ramírez",
    enrollment: "2023371015",
    totalAttendance: 16,
    attendancePercent: 80,
    absences: 4,
    tardiness: 1,
    justifications: 2,
  },
];

// Columnas de resumen (headers verticales)
const SUMMARY_COLUMNS = [
  { key: "totalAttendance", label: "ASISTENCIA" },
  { key: "attendancePercent", label: "% DE ASISTENCIA" },
  { key: "absences", label: "FALTAS" },
  { key: "tardiness", label: "TARDANZAS" },
  { key: "justifications", label: "JUSTIFICACIONES" },
] as const;

interface AttendanceTableProps {
  monthLabel: string;
  weeks: AttendanceCalendarWeek[];
}

export default function AttendanceTable({
  monthLabel,
  weeks,
}: AttendanceTableProps) {
  const students = MOCK_ATTENDANCE_DATA;
  const totalStudents = students.length;

  const totalDayColumns = weeks.reduce(
    (acc, w) => acc + w.days.length,
    0
  );

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

      {/* Tabla con scroll horizontal propio */}
      {totalStudents > 0 ? (
        <div className="w-full max-w-full overflow-x-auto rounded-md border border-gray-200">
          <div className="min-w-[900px]">
            <table className="w-full text-[13px] text-left text-gray-700">
              <thead>
                {/* Fila 0: Mes + columnas de resumen */}
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-5 py-2 text-left text-[12px] font-medium text-gray-700 border-r border-gray-200 whitespace-nowrap">
                    Alumno
                  </th>
                  <th
                    className="px-5 py-2 text-center text-[12px] font-semibold text-gray-900"
                    colSpan={totalDayColumns}
                  >
                    {monthLabel || "CALENDARIO"}
                  </th>

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
                {students.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    {/* Alumno */}
                    <td className="px-5 py-[10px] text-gray-700 border-r border-gray-200">
                      <div className="flex items-center gap-3">
                        {row.studentImage ? (
                          <img
                            src={row.studentImage}
                            alt={row.studentName}
                            className="w-8 h-8 aspect-square rounded-md object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 aspect-square rounded-md bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-gray-500" />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
                            {row.studentName}
                          </p>
                          <p className="text-xs text-gray-500 whitespace-nowrap">
                            Matrícula: {row.enrollment}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Celdas de días (por ahora vacías) */}
                    {weeks.flatMap((week, wi) =>
                      week.days.map((day, di) => (
                        <td
                          key={`cell-${row.id}-${wi}-${di}`}
                          className="px-2 py-2 text-center text-xs text-gray-700 border-l border-gray-200"
                        >
                          <span className="inline-block w-3 h-3 rounded-full border border-gray-300 bg-white" />
                        </td>
                      ))
                    )}

                    {/* Columnas de resumen */}
                    <td className="px-3 py-2 text-center text-xs text-gray-700 border-l border-gray-200">
                      {row.totalAttendance}
                    </td>
                    <td className="px-3 py-2 text-center text-xs text-gray-700 border-l border-gray-200">
                      {row.attendancePercent}%
                    </td>
                    <td className="px-3 py-2 text-center text-xs text-gray-700 border-l border-gray-200">
                      {row.absences}
                    </td>
                    <td className="px-3 py-2 text-center text-xs text-gray-700 border-l border-gray-200">
                      {row.tardiness}
                    </td>
                    <td className="px-3 py-2 text-center text-xs text-gray-700 border-l border-gray-200">
                      {row.justifications}
                    </td>
                  </tr>
                ))}
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
