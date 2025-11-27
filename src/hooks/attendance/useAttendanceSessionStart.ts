"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  startAttendanceSession,
  canStartAttendanceSession,
  type AttendanceSessionResponse,
} from "@/services/attendanceSession.service";

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
  const [activeSession, setActiveSession] = useState<AttendanceSessionResponse | null>(null);

  // ✅ Nuevo: flag desde backend para evitar doble pase del día
  const [canStart, setCanStart] = useState<boolean>(true);
  const [loadingCanStart, setLoadingCanStart] = useState(false);

  const [toast, setToast] = useState<ToastState>(null);
  const clearToast = useCallback(() => setToast(null), []);

  const requestIdRef = useRef(0);

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

  // ✅ Nuevo: comprobar si se puede iniciar sesión (cuando cambie curso/horario)
  const refreshCanStart = useCallback(async () => {
    // Si faltan datos, no consultamos
    if (!idGroupCourse || !idSchedule) {
      setCanStart(true);
      return;
    }

    const reqId = ++requestIdRef.current;
    setLoadingCanStart(true);

    try {
      const ok = await canStartAttendanceSession(idGroupCourse, idSchedule);

      // Evitar race conditions si cambia rápido el curso/horario
      if (reqId === requestIdRef.current) {
        setCanStart(ok);
      }
    } catch (err) {
      // Si falla, no bloqueamos fuerte (pero podrías decidir lo contrario)
      if (reqId === requestIdRef.current) {
        setCanStart(true);
      }
      console.error("Error canStartAttendanceSession:", err);
    } finally {
      if (reqId === requestIdRef.current) {
        setLoadingCanStart(false);
      }
    }
  }, [idGroupCourse, idSchedule]);

  useEffect(() => {
    setActiveSession(null);
    refreshCanStart();
  }, [refreshCanStart]);

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

    if (startingSession) return null;

    // ✅ Bloqueo por backend (ya pasó lista hoy)
    if (!canStart) {
      setToast({
        type: "error",
        title: "Pase de lista ya realizado",
        description: "Ya se inició una sesión para este horario el día de hoy.",
      });
      return null;
    }

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

      // ✅ Ya no se puede iniciar otra vez hoy
      setCanStart(false);

      setToast({
        type: "success",
        title: "Pase de lista iniciado",
        description: "La sesión fue abierta correctamente.",
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

      // Re-consulta por si el backend respondió “ya existía”
      refreshCanStart();
      return null;
    } finally {
      setStartingSession(false);
    }
  }, [
    idGroupCourse,
    idSchedule,
    idProfessor,
    startingSession,
    canStart,
    refreshCanStart,
  ]);

  return {
    startingSession,
    activeSession,
    toast,
    clearToast,

    canStart,
    loadingCanStart,
    refreshCanStart,

    start,
    setActiveSession,
  };
}
