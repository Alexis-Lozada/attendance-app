"use client";

import { useCallback, useState } from "react";
import { startAttendanceSession } from "@/services/attendanceSession.service";
import type { AttendanceSessionResponse } from "@/services/attendanceSession.service";

type ToastState = {
  title: string;
  description?: string;
  type?: "success" | "error";
} | null;

interface UseAttendanceSessionStartParams {
  idGroupCourse: number | null;
  idSchedule: number | null;
  idProfessor: number | null;
}

export function useAttendanceSessionStart({
  idGroupCourse,
  idSchedule,
  idProfessor,
}: UseAttendanceSessionStartParams) {
  const [startingSession, setStartingSession] = useState(false);
  const [activeSession, setActiveSession] = useState<AttendanceSessionResponse | null>(
    null
  );
  const [toast, setToast] = useState<ToastState>(null);

  const clearToast = useCallback(() => setToast(null), []);

  const getGeo = () => {
    if (typeof window === "undefined") return Promise.resolve(null);
    if (!("geolocation" in navigator)) return Promise.resolve(null);

    return new Promise<{ lat: number; lng: number } | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
      );
    });
  };

  const start = useCallback(async () => {
    if (!idProfessor) {
      setToast({
        type: "error",
        title: "Sesión no iniciada",
        description: "Necesitas iniciar sesión otra vez.",
      });
      return null;
    }

    if (!idGroupCourse || !idSchedule) {
      setToast({
        type: "error",
        title: "Faltan datos",
        description: "Selecciona un curso y espera a que cargue el horario.",
      });
      return null;
    }

    if (startingSession || activeSession?.status === "OPEN") return activeSession;

    try {
      setStartingSession(true);

      const geo = await getGeo();

      const session = await startAttendanceSession({
        idGroupCourse,
        idSchedule,
        idProfessor,
        geoLatitude: geo?.lat,
        geoLongitude: geo?.lng,
      });

      setActiveSession(session);

      setToast({
        type: "success",
        title: "Pase de lista iniciado",
        description: session.expiresAt
          ? `La sesión estará abierta hasta: ${new Date(session.expiresAt).toLocaleString()}`
          : "La sesión fue abierta correctamente.",
      });

      return session;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "No se pudo iniciar la sesión.";

      setToast({
        type: "error",
        title: "No se pudo iniciar el pase de lista",
        description: message,
      });

      return null;
    } finally {
      setStartingSession(false);
    }
  }, [idGroupCourse, idSchedule, idProfessor, startingSession, activeSession]);

  const isSessionOpen = activeSession?.status === "OPEN";

  return {
    startingSession,
    activeSession,
    isSessionOpen,
    toast,
    clearToast,
    start,
    setActiveSession, // por si luego quieres setearla desde un fetch "get current session"
  };
}
