// utils/attendance/AttendanceTableUtils.ts
import { AttendanceResponse } from "@/services/attendance.service";

/** === Tipos compartidos === */
export interface StudentInfo {
  idStudent: number;
  studentName: string;
  enrollmentNumber: string;
  profileImage?: string; // UUID o URL
}

export interface MonthSegment {
  label: string;   // "NOVIEMBRE 2025"
  colSpan: number; // cuántos días de ese mes
}

/** === Utilidades de fecha === */
export function toDateKey(dateStr: string): string {
  // "2025-11-06T10:00:00" -> "2025-11-06"
  return dateStr.split("T")[0];
}

function normalizeDateOnly(dateStr: string): Date {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isFutureDate(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = normalizeDateOnly(dateStr);
  return d > today;
}

/** === Normalizar status === */
export function normalizeStatus(
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

/** === Construir alumnos únicos a partir de asistencias === */
export function buildStudents(
  attendances: AttendanceResponse[]
): StudentInfo[] {
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
}

/** === Mapa alumno+fecha -> asistencias === */
export function buildAttendanceMap(
  attendances: AttendanceResponse[]
): Map<string, AttendanceResponse[]> {
  const map = new Map<string, AttendanceResponse[]>();

  attendances.forEach((a) => {
    const dateKey = toDateKey(a.attendanceDate); // "YYYY-MM-DD"
    const key = `${a.idStudent}-${dateKey}`;
    const current = map.get(key) || [];
    current.push(a);
    map.set(key, current);
  });

  return map;
}

/** === Segmentos por mes (NOVIEMBRE 2025, DICIEMBRE 2025, etc.) === */
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

export function buildMonthSegments(
  allCalendarDays: { date: string }[]
): MonthSegment[] {
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
}

/** === Stats por alumno para el calendario === */
export function getStudentStatsForCalendar(
  idStudent: number,
  allCalendarDays: { date: string }[],
  attendanceByStudentAndDate: Map<string, AttendanceResponse[]>
) {
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

    // Fechas futuras: cuentan para el total pero no afectan contadores visibles
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

/** === Letra por celda (P/F/R/J) === */
export function getCellLetterForCalendar(
  idStudent: number,
  dateIso: string,
  attendanceByStudentAndDate: Map<string, AttendanceResponse[]>
): string {
  const dateKey = toDateKey(dateIso);
  const key = `${idStudent}-${dateKey}`;
  const records = attendanceByStudentAndDate.get(key) || [];

  const future = isFutureDate(dateIso);

  // FUTURO sin registro → vacío
  if (future && records.length === 0) {
    return "";
  }

  // PASADO sin registro → F
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
