import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { AttendanceSessionResponse } from "@/services/attendanceSession.service";

/**
 * Hook para obtener en tiempo real el estado de la sesión de asistencia.
 *
 * @param idGroupCourse ID del grupo-curso
 */
export function useRealtimeSession(idGroupCourse?: number) {
  const [session, setSession] = useState<AttendanceSessionResponse | null>(null);
  const [isActive, setIsActive] = useState(false);
  const stompClient = useRef<Client | null>(null);

  // Verificar expiración en cliente (seguridad extra)
  const checkExpiration = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) > new Date();
  };

  useEffect(() => {
    if (!idGroupCourse) return;

    const socketURL = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL!.replace("/api", "")}/ws`;

    const socket = new SockJS(socketURL);

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (msg) => console.log("[WS-SESSIONS]", msg),
      onConnect: () => {
        console.log("✅ Conectado al WebSocket de sesiones");

        client.subscribe(
          `/topic/sessions/group-course/${idGroupCourse}`,
          (message) => {
            const event: AttendanceSessionResponse = JSON.parse(message.body);

            setSession(event);

            // Estado OPEN / CLOSED desde backend
            const backendActive = event.status === "OPEN";

            // Validar también fecha expiración local
            const notExpiredYet = checkExpiration(event.expiresAt);

            const active = backendActive && notExpiredYet;

            setIsActive(active);

            if (!active) {
              console.log("⚠️ Sesión cerrada o expirada");
            } else {
              console.log("🟢 Sesión activa recibida");
            }
          }
        );
      },
    });

    client.activate();
    stompClient.current = client;

    // Cleanup al desmontar
    return () => {
      if (client.connected) client.deactivate();
      console.log("🔌 WebSocket de sesiones desconectado");
    };
  }, [idGroupCourse]);

  return { session, isActive };
}
