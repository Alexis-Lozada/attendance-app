import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import {
  AttendanceResponse,
  getAttendancesByGroupCourse,
} from "@/services/attendance.service";

/**
 * Hook para obtener asistencias en tiempo real, filtradas por rango de fechas.
 * 
 * @param idGroupCourse ID del grupo-curso
 * @param startDate Fecha inicial (formato ISO: "2025-11-01")
 * @param endDate Fecha final (formato ISO: "2025-11-30")
 */
export function useRealtimeAttendance(
  idGroupCourse?: number,
  startDate?: string,
  endDate?: string
) {
  const [attendances, setAttendances] = useState<AttendanceResponse[]>([]);
  const stompClient = useRef<Client | null>(null);

  // Función auxiliar: comprobar si la fecha está dentro del rango
  const isWithinRange = (date: string) => {
    if (!startDate || !endDate) return true;
    const d = new Date(date);
    return d >= new Date(startDate) && d <= new Date(endDate);
  };

  useEffect(() => {
    if (!idGroupCourse) return;

    // 1️⃣ Cargar asistencias iniciales
    const fetchAttendances = async () => {
      try {
        const data = await getAttendancesByGroupCourse(idGroupCourse);
        const filtered = data.filter((a) => isWithinRange(a.attendanceDate));
        setAttendances(filtered);
      } catch (error) {
        console.error("Error al cargar asistencias:", error);
      }
    };

    fetchAttendances();

    // 2️⃣ Conectar al WebSocket
    const socket = new SockJS(`${process.env.NEXT_PUBLIC_ATTENDANCE_MS_URL!.replace("/api", "")}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log("[WebSocket]", str),
      onConnect: () => {
        console.log("✅ Conectado al WebSocket");

        // Suscribirse al topic del curso
        client.subscribe(
          `/topic/attendances/group-course/${idGroupCourse}`,
          (message) => {
            const newAttendance = JSON.parse(message.body);

            // Ignorar si no está dentro del rango
            if (!isWithinRange(newAttendance.attendanceDate)) return;

            setAttendances((prev) => {
              const exists = prev.some(
                (a) => a.idAttendance === newAttendance.idAttendance
              );
              return exists
                ? prev.map((a) =>
                    a.idAttendance === newAttendance.idAttendance
                      ? newAttendance
                      : a
                  )
                : [...prev, newAttendance];
            });
          }
        );
      },
    });

    client.activate();
    stompClient.current = client;

    // 3️⃣ Limpiar conexión al desmontar
    return () => {
      if (client.connected) client.deactivate();
      console.log("🔌 Desconectado del WebSocket");
    };
  }, [idGroupCourse, startDate, endDate]);

  return { attendances };
}
