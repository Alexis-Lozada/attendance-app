"use client";

import { useEffect, useMemo, useState } from "react";
import { List, User } from "lucide-react";
import { AttendanceResponse } from "@/services/attendance.service";
import { getFileUrl } from "@/services/storage.service";

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
  monthLabel: string; // (no lo usamos visualmente por ahora)
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

// =====================
//  Utilidades de fecha
// =====================
function toDateKey(dateStr: string): string {
  // "2025-11-06T10:00:00" -> "2025-11-06"
  return dateStr.split("T")[0];
}

function normalizeDateOnly(dateStr: string): Date {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isFutureDate(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = normalizeDateOnly(dateStr);
  return d > today;
}

// Normalizamos estatus para ser más tolerantes
function normalizeStatus(
  status?: string
): "PRESENT" | "ABSENT" | "TARDY" | "JUSTIFIED" | "OTHER" {
  if (!status) return "OTHER";
  const s = status.toUpperCase().trim();

  if (s === "PRESENT" || s === "P" || s === "ASISTENCIA") return "PRESENT";
  if (s === "ABSENT" || s === "A" || s === "FALTA") return "ABSENT";
  if (s === "TARDY" || s === "LATE" || s === "RETARDO" || s === "R")
    return "TARDY";
  if (s === "JUSTIFIED" || s === "JUSTIFICADO" || s === "J")
    return "JUSTIFIED";

  return "OTHER";
}

export default function AttendanceTable({
  monthLabel, // eslint-disable-line @typescript-eslint/no-unused-vars
  weeks,
  attendances,
}: AttendanceTableProps) {
  // ==============================
  //  Construir alumnos únicos (memoizado)
  // ==============================
  interface StudentInfo {
    idStudent: number;
    studentName: string;
    enrollmentNumber: string;
    profileImage?: string; // aquí viene UUID o URL
  }

  const students = useMemo<StudentInfo[]>(() => {
    const map = new Map<number, StudentInfo>();

    attendances.forEach((a) => {
      if (!map.has(a.idStudent)) {
        map.set(a.idStudent, {
          idStudent: a.idStudent,
          studentName: a.studentName || "Alumno sin nombre",
          enrollmentNumber: a.enrollmentNumber || "",
          profileImage: a.profileImage,
        });
      }
    });

    return Array.from(map.values()).sort((a, b) =>
      a.studentName.localeCompare(b.studentName)
    );
  }, [attendances]);

  const totalStudents = students.length;

  // ==============================
  //  Mapa asistencia por alumno+fecha
  // ==============================
  const attendanceByStudentAndDate = useMemo(() => {
    const map = new Map<string, AttendanceResponse[]>();

    attendances.forEach((a) => {
      const dateKey = toDateKey(a.attendanceDate); // "YYYY-MM-DD"
      const key = `${a.idStudent}-${dateKey}`;
      const current = map.get(key) || [];
      current.push(a);
      map.set(key, current);
    });

    return map;
  }, [attendances]);

  // Todas las fechas del calendario (para contar sesiones)
  const allCalendarDays = useMemo(
    () => weeks.flatMap((w) => w.days),
    [weeks]
  );

  // ==============================
  //  Segmentos por mes
  // ==============================
  const MONTHS_ES = [
    "ENERO",
    "FEBRERO",
    "MARZO",
    "ABRIL",
    "MAYO",
    "JUNIO",
    "JULIO",
    "AGOSTO",
    "SEPTIEMBRE",
    "OCTUBRE",
    "NOVIEMBRE",
    "DICIEMBRE",
  ];

  interface MonthSegment {
    label: string;   // "NOVIEMBRE 2025"
    colSpan: number; // cuántos días de ese mes
  }

  const monthSegments: MonthSegment[] = useMemo(() => {
    const segments: MonthSegment[] = [];
    allCalendarDays.forEach((day) => {
      const d = new Date(day.date);
      const label = `${MONTHS_ES[d.getMonth()]} ${d.getFullYear()}`;
      const last = segments[segments.length - 1];

      if (!last || last.label !== label) {
        segments.push({ label, colSpan: 1 });
      } else {
        last.colSpan += 1;
      }
    });
    return segments;
  }, [allCalendarDays]);

  const totalDayColumns = allCalendarDays.length;

  // ==============================
  //  Cálculo de resumen por alumno
  // ==============================
  function getStudentStats(idStudent: number) {
    let totalSessions = 0; // todas las fechas del calendario (pasadas + futuras)
    let realPresents = 0; // solo PRESENT de días pasados/actuales
    let absences = 0; // faltas "puras"
    let tardiness = 0; // total de retardos
    let justifications = 0; // asistencias justificadas

    allCalendarDays.forEach((day) => {
      const dateKey = toDateKey(day.date);
      const key = `${idStudent}-${dateKey}`;
      const records = attendanceByStudentAndDate.get(key) || [];
      totalSessions++;

      const future = isFutureDate(day.date);

      // 🔹 Fechas futuras: cuentan como presentes para el %,
      // pero no afectan contadores visibles
      if (future) {
        return;
      }

      if (records.length === 0) {
        // Día pasado sin registro → falta
        absences++;
        return;
      }

      let hasPresent = false;
      let hasAbsent = false;
      let hasJustified = false;
      let tardiesForDay = 0;

      records.forEach((r) => {
        const st = normalizeStatus(r.status);

        if (st === "PRESENT") {
          hasPresent = true;
        } else if (st === "ABSENT") {
          hasAbsent = true;
        } else if (st === "TARDY") {
          tardiesForDay++;
        } else if (st === "JUSTIFIED") {
          hasJustified = true;
        }
      });

      if (hasPresent) {
        realPresents++;
      } else if (hasJustified) {
        justifications++;
      } else if (hasAbsent) {
        absences++;
      }

      tardiness += tardiesForDay;
    });

    // 3 retardos = 1 falta
    const equivalentAbsencesFromTardies = Math.floor(tardiness / 3);
    const effectiveAbsences = absences + equivalentAbsencesFromTardies;

    let effectivePresents = totalSessions - effectiveAbsences;
    if (effectivePresents < 0) effectivePresents = 0;

    const attendancePercent =
      totalSessions > 0
        ? Math.round((effectivePresents / totalSessions) * 100)
        : 0;

    return {
      totalAttendance: realPresents,
      absences,
      tardiness,
      justifications,
      attendancePercent,
    };
  }

  // ==============================
  //  Letra por celda (P/F/R/J)
  // ==============================
  function getCellLetter(idStudent: number, dateIso: string): string {
    const dateKey = toDateKey(dateIso);
    const key = `${idStudent}-${dateKey}`;
    const records = attendanceByStudentAndDate.get(key) || [];

    const future = isFutureDate(dateIso);

    // 🔹 FUTURO sin registro → vacío (circulito)
    if (future && records.length === 0) {
      return "";
    }

    // 🔹 PASADO sin registro → F (falta)
    if (!future && records.length === 0) {
      return "F";
    }

    let hasPresent = false;
    let hasAbsent = false;
    let hasJustified = false;
    let hasTardy = false;

    records.forEach((r) => {
      const st = normalizeStatus(r.status);
      if (st === "PRESENT") hasPresent = true;
      else if (st === "ABSENT") hasAbsent = true;
      else if (st === "JUSTIFIED") hasJustified = true;
      else if (st === "TARDY") hasTardy = true;
    });

    if (hasPresent) return "P";
    if (hasJustified) return "J";
    if (hasAbsent) return "F";
    if (hasTardy) return "R";
    return "";
  }

  // ==============================
  //  Resolver imágenes (UUID → URL)
  // ==============================
  const [imageUrls, setImageUrls] = useState<Record<number, string>>({});

  useEffect(() => {
    let cancelled = false;

    async function loadImages() {
      const newMap: Record<number, string> = {};

      await Promise.all(
        students.map(async (student) => {
          const raw = student.profileImage;
          if (!raw) return;

          // Si ya viene como URL, úsala directo
          if (raw.startsWith("http://") || raw.startsWith("https://")) {
            newMap[student.idStudent] = raw;
            return;
          }

          // Si parece UUID, pedimos al storage-ms
          const url = await getFileUrl(raw);
          if (url) {
            newMap[student.idStudent] = url;
          }
        })
      );

      if (!cancelled) {
        setImageUrls(newMap);
      }
    }

    if (students.length > 0) {
      loadImages();
    } else {
      setImageUrls({});
    }

    return () => {
      cancelled = true;
    };
  }, [students]);

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
                  const stats = getStudentStats(student.idStudent);
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

                      {/* Celdas de días con letras P / F / R / J o circulito */}
                      {weeks.flatMap((week, wi) =>
                        week.days.map((day, di) => {
                          const letter = getCellLetter(
                            student.idStudent,
                            day.date
                          );

                          return (
                            <td
                              key={`cell-${student.idStudent}-${wi}-${di}`}
                              className="px-2 py-2 text-center text-xs text-gray-700 border-l border-gray-200"
                            >
                              {letter ? (
                                <span className="inline-flex items-center justify-center w-5 h-5 text-[11px] font-semibold border border-gray-300 rounded">
                                  {letter}
                                </span>
                              ) : (
                                <span className="inline-block w-3 h-3 rounded-full border border-gray-200 bg-white" />
                              )}
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
