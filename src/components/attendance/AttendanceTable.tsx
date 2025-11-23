"use client";

import { List, User } from "lucide-react";
import { AttendanceResponse } from "@/services/attendance.service";

interface CalendarDay {
  label: string;      // L, M, M, J, V
  dayNumber: number;  // 6, 7, 8, ...
  date: string;       // "2025-01-06" (ISO sin hora)
}

interface CalendarWeek {
  label: string;      // "Semana 1", "Semana 2", ...
  days: CalendarDay[];
}

interface AttendanceTableProps {
  monthLabel: string;
  weeks: CalendarWeek[];
  attendances: AttendanceResponse[];
}

type NormalizedStatus = "PRESENT" | "ABSENT" | "LATE" | "JUSTIFIED" | "UNKNOWN";

function normalizeStatus(status: string): NormalizedStatus {
  if (!status) return "UNKNOWN";
  const s = status.toUpperCase();

  if (["PRESENT", "P"].includes(s)) return "PRESENT";
  if (["ABSENT", "A", "FALTA", "FALTÓ"].includes(s)) return "ABSENT";
  if (["LATE", "TARDY", "T", "TARDANZA"].includes(s)) return "LATE";
  if (["JUSTIFIED", "J", "JUSTIFICADA", "JUSTIFICADO"].includes(s))
    return "JUSTIFIED";

  return "UNKNOWN";
}

interface StudentRow {
  idStudent: number;
  studentName: string;
  enrollmentNumber: string;
  profileImage?: string;
  // attendanceDate (YYYY-MM-DD) -> registro
  attendancesByDate: Record<string, AttendanceResponse | undefined>;
  totalAttendance: number;
  attendancePercent: number;
  absences: number;
  tardiness: number;
  justifications: number;
}

export default function AttendanceTable({
  monthLabel,
  weeks,
  attendances,
}: AttendanceTableProps) {
  // Si no hay calendario todavía, mostramos mensaje vacío
  const hasCalendar = weeks && weeks.length > 0;

  // =========================
  //  Construir filas por alumno
  // =========================
  const sessionsDates: string[] = hasCalendar
    ? weeks.flatMap((w) => w.days.map((d) => d.date))
    : [];

  const totalSessions = sessionsDates.length;

  const studentsMap = new Map<number, StudentRow>();

  attendances.forEach((a) => {
    const dateOnly = a.attendanceDate.substring(0, 10); // "YYYY-MM-DD"
    const normalized = normalizeStatus(a.status);

    if (!studentsMap.has(a.idStudent)) {
      studentsMap.set(a.idStudent, {
        idStudent: a.idStudent,
        studentName: a.studentName || "Sin nombre",
        enrollmentNumber: a.enrollmentNumber || "Sin matrícula",
        profileImage: a.profileImage,
        attendancesByDate: {},
        totalAttendance: 0,
        attendancePercent: 0,
        absences: 0,
        tardiness: 0,
        justifications: 0,
      });
    }

    const row = studentsMap.get(a.idStudent)!;

    // Guardar registro por fecha
    row.attendancesByDate[dateOnly] = a;

    // Contabilizar por tipo
    switch (normalized) {
      case "PRESENT":
        row.totalAttendance += 1;
        break;
      case "JUSTIFIED":
        // Si quieres que la justificada cuente como asistencia, descomenta:
        // row.totalAttendance += 1;
        row.justifications += 1;
        break;
      case "ABSENT":
        row.absences += 1;
        break;
      case "LATE":
        row.tardiness += 1;
        break;
      default:
        break;
    }
  });

  // Calcular % de asistencia por alumno
  const studentRows: StudentRow[] = Array.from(studentsMap.values()).map(
    (row) => {
      if (totalSessions > 0) {
        row.attendancePercent = Math.round(
          (row.totalAttendance / totalSessions) * 100
        );
      } else {
        row.attendancePercent = 0;
      }
      return row;
    }
  );

  const totalStudents = studentRows.length;

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

      {/* Tabla con scroll horizontal solo en la tabla */}
      {hasCalendar && totalStudents > 0 ? (
        <div className="w-full max-w-full overflow-x-auto rounded-md border border-gray-200">
          <div className="min-w-[900px]">
            <table className="w-full text-[13px] text-left text-gray-700">
              <thead>
                {/* Fila 0: Mes + columnas de resumen laterales */}
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-5 py-2 text-left text-[12px] font-medium text-gray-700 border-r border-gray-200 whitespace-nowrap">
                    Alumno
                  </th>

                  <th
                    className="px-5 py-2 text-center text-[12px] font-semibold text-gray-900"
                    colSpan={sessionsDates.length}
                  >
                    {monthLabel || "CALENDARIO"}
                  </th>

                  {/* Columnas resumen, texto vertical */}
                  <th
                    rowSpan={4}
                    className="px-2 py-2 text-center text-[11px] font-medium text-gray-700 border-l border-gray-200 align-middle"
                  >
                    <span className="inline-block [writing-mode:vertical-rl] rotate-180">
                      ASISTENCIA
                    </span>
                  </th>
                  <th
                    rowSpan={4}
                    className="px-2 py-2 text-center text-[11px] font-medium text-gray-700 border-l border-gray-200 align-middle"
                  >
                    <span className="inline-block [writing-mode:vertical-rl] rotate-180">
                      % DE ASISTENCIA
                    </span>
                  </th>
                  <th
                    rowSpan={4}
                    className="px-2 py-2 text-center text-[11px] font-medium text-gray-700 border-l border-gray-200 align-middle"
                  >
                    <span className="inline-block [writing-mode:vertical-rl] rotate-180">
                      FALTAS
                    </span>
                  </th>
                  <th
                    rowSpan={4}
                    className="px-2 py-2 text-center text-[11px] font-medium text-gray-700 border-l border-gray-200 align-middle"
                  >
                    <span className="inline-block [writing-mode:vertical-rl] rotate-180">
                      TARDANZAS
                    </span>
                  </th>
                  <th
                    rowSpan={4}
                    className="px-2 py-2 text-center text-[11px] font-medium text-gray-700 border-l border-gray-200 align-middle"
                  >
                    <span className="inline-block [writing-mode:vertical-rl] rotate-180">
                      JUSTIFICACIONES
                    </span>
                  </th>
                </tr>

                {/* Fila 1: Semanas */}
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-5 py-2 text-left text-[12px] font-medium text-gray-700 border-r border-gray-200" />
                  {weeks.map((week, wi) => (
                    <th
                      key={`week-${wi}`}
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
                {studentRows.map((row) => (
                  <tr
                    key={row.idStudent}
                    className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    {/* Alumno */}
                    <td className="px-5 py-[10px] text-gray-700 border-r border-gray-200">
                      <div className="flex items-center gap-3">
                        {row.profileImage ? (
                          <img
                            src={row.profileImage}
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
                            Matrícula: {row.enrollmentNumber}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Celdas de días */}
                    {weeks.flatMap((week, wi) =>
                      week.days.map((day, di) => {
                        const rec =
                          row.attendancesByDate[day.date] || undefined;
                        const norm = rec
                          ? normalizeStatus(rec.status)
                          : "UNKNOWN";

                        let symbol = "";
                        switch (norm) {
                          case "PRESENT":
                            symbol = "P";
                            break;
                          case "ABSENT":
                            symbol = "A";
                            break;
                          case "LATE":
                            symbol = "T";
                            break;
                          case "JUSTIFIED":
                            symbol = "J";
                            break;
                          default:
                            symbol = "";
                            break;
                        }

                        return (
                          <td
                            key={`cell-${row.idStudent}-${wi}-${di}`}
                            className="px-2 py-2 text-center text-xs text-gray-700 border-l border-gray-200"
                          >
                            {symbol ? (
                              <span className="inline-block min-w-[14px]">
                                {symbol}
                              </span>
                            ) : (
                              <span className="inline-block w-3 h-3 rounded-full border border-gray-300 bg-white" />
                            )}
                          </td>
                        );
                      })
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
