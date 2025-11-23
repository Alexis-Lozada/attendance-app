"use client";

import { useEffect, useState } from "react";
import {
  getSchedulesByGroup,
  GroupCourseScheduleResponse,
} from "@/services/schedule.service";

export interface AttendanceCalendarDay {
  /** Letra del día: L, M, M, J, V, S, D */
  label: string;
  /** Número de día del mes: 1, 2, 3... */
  dayNumber: number;
  /** Fecha completa en formato YYYY-MM-DD */
  date: string;
}

export interface AttendanceCalendarWeek {
  /** Ej: "Semana 1" */
  label: string;
  days: AttendanceCalendarDay[];
}

interface UseAttendanceCalendarParams {
  idGroup: string | null;        // idGroup
  idGroupCourse: string | null;  // idGroupCourse
  moduleStartDate: string | null; // "2025-01-14"
  moduleEndDate: string | null;   // "2025-01-29"
}

interface UseAttendanceCalendarResult {
  weeks: AttendanceCalendarWeek[];
  monthLabel: string; // "ENERO 2025"
  loadingCalendar: boolean;
  calendarError: string | null;
}

const WEEKDAY_LABELS_ES = ["D", "L", "M", "M", "J", "V", "S"];

function mapDayOfWeekToJsIndex(day: string): number | null {
  switch (day) {
    case "MONDAY":
      return 1;
    case "TUESDAY":
      return 2;
    case "WEDNESDAY":
      return 3;
    case "THURSDAY":
      return 4;
    case "FRIDAY":
      return 5;
    case "SATURDAY":
      return 6;
    case "SUNDAY":
      return 0;
    default:
      return null;
  }
}

function buildWeeksFromRange(
  start: string,
  end: string,
  scheduledDays: number[]
): { weeks: AttendanceCalendarWeek[]; monthLabel: string } {
  const startDate = new Date(start + "T00:00:00");
  const endDate = new Date(end + "T00:00:00");

  const msPerDay = 24 * 60 * 60 * 1000;

  const monthNames = [
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
  const monthLabel = `${monthNames[startDate.getMonth()]} ${startDate.getFullYear()}`;

  const weeksMap = new Map<number, AttendanceCalendarWeek>();

  let index = 0;
  for (let t = startDate.getTime(); t <= endDate.getTime(); t += msPerDay) {
    const date = new Date(t);
    const dow = date.getDay(); // 0=D ... 6=S

    // Solo fechas que caen en días con clase
    if (!scheduledDays.includes(dow)) {
      index++;
      continue;
    }

    const weekIndex = Math.floor(index / 7) + 1;

    if (!weeksMap.has(weekIndex)) {
      weeksMap.set(weekIndex, {
        label: `Semana ${weekIndex}`,
        days: [],
      });
    }

    const week = weeksMap.get(weekIndex)!;
    week.days.push({
      label: WEEKDAY_LABELS_ES[dow],
      dayNumber: date.getDate(),
      date: date.toISOString().slice(0, 10),
    });

    index++;
  }

  const weeks = Array.from(weeksMap.values());
  return { weeks, monthLabel };
}

export function useAttendanceCalendar(
  params: UseAttendanceCalendarParams
): UseAttendanceCalendarResult {
  const { idGroup, idGroupCourse, moduleStartDate, moduleEndDate } = params;

  const [weeks, setWeeks] = useState<AttendanceCalendarWeek[]>([]);
  const [monthLabel, setMonthLabel] = useState<string>("");
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [calendarError, setCalendarError] = useState<string | null>(null);

  useEffect(() => {
    setWeeks([]);
    setMonthLabel("");
    setCalendarError(null);

    if (
      !idGroup ||
      !idGroupCourse ||
      !moduleStartDate ||
      !moduleEndDate
    ) {
      return;
    }

    const load = async () => {
      setLoadingCalendar(true);
      try {
        const scheduleData = await getSchedulesByGroup(Number(idGroup));

        const groupCourse = scheduleData.find(
          (gc: GroupCourseScheduleResponse) =>
            gc.idGroupCourse === Number(idGroupCourse)
        );

        if (!groupCourse || !groupCourse.schedules.length) {
          setWeeks([]);
          return;
        }

        const scheduledDays = groupCourse.schedules
          .map((s) => mapDayOfWeekToJsIndex(s.dayOfWeek))
          .filter((x): x is number => x !== null);

        if (!scheduledDays.length) {
          setWeeks([]);
          return;
        }

        const { weeks, monthLabel } = buildWeeksFromRange(
          moduleStartDate,
          moduleEndDate,
          scheduledDays
        );

        setWeeks(weeks);
        setMonthLabel(monthLabel);
      } catch (err) {
        console.error(err);
        setCalendarError(
          "No se pudo generar el calendario de asistencias para este módulo."
        );
      } finally {
        setLoadingCalendar(false);
      }
    };

    load();
  }, [idGroup, idGroupCourse, moduleStartDate, moduleEndDate]);

  return { weeks, monthLabel, loadingCalendar, calendarError };
}
