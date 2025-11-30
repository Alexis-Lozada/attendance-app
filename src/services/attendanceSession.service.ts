import { api } from "@/services/api";

/** === Interfaces === */
export interface AttendanceSessionResponse {
  idSession: number;
  idGroupCourse: number;
  idSchedule: number;
  idProfessor: number;
  geoLatitude?: number;
  geoLongitude?: number;
  startTime: string;
  expiresAt: string;
  status: "OPEN" | "CLOSED";
}

export interface CanStartSessionResponse {
  canStart: boolean;
}

/** === Crear una nueva sesión (iniciar pase de lista) === */
export async function startAttendanceSession(payload: {
  idGroupCourse: number;
  idSchedule: number;
  idProfessor: number;
  geoLatitude?: number;
  geoLongitude?: number;
}): Promise<AttendanceSessionResponse> {
  const { data } = await api.post("/sessions/start", payload);
  return data;
}

/** === Verificar si se puede crear una nueva sesión para este horario === */
export async function canStartAttendanceSession(
  idGroupCourse: number,
  idSchedule: number
): Promise<boolean> {
  const { data } = await api.get<CanStartSessionResponse>(
    `/sessions/can-start`,
    {
      params: {
        groupCourse: idGroupCourse,
        schedule: idSchedule,
      },
    }
  );

  return data.canStart;
}
