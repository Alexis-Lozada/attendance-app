"use client";

import { useEffect, useState } from "react";
import { getClosestSchedule, ScheduleResponse } from "@/services/schedule.service";

export function useCourseSchedule(
  puedePasarLista: boolean,
  selectedGroupCourseId: string | null // idGroupCourse
) {
  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  useEffect(() => {
    setSchedule(null);

    if (!puedePasarLista || !selectedGroupCourseId) return;

    const load = async () => {
      setLoadingSchedule(true);

      try {
        const now = new Date();
        const formatted =
          now.getFullYear() +
          "-" +
          String(now.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(now.getDate()).padStart(2, "0") +
          "T" +
          String(now.getHours()).padStart(2, "0") +
          ":" +
          String(now.getMinutes()).padStart(2, "0") +
          ":" +
          String(now.getSeconds()).padStart(2, "0");

        const s = await getClosestSchedule(
          Number(selectedGroupCourseId),
          formatted
        );

        setSchedule(s ?? null);
      } catch (err) {
        console.error(err);
      }

      setLoadingSchedule(false);
    };

    load();
  }, [puedePasarLista, selectedGroupCourseId]);

  return { schedule, loadingSchedule };
}
