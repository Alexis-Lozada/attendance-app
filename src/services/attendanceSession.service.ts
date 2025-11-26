import { attendanceApi } from "@/services/api";

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

/** === Crear una nueva sesión (iniciar pase de lista) === */
export async function startAttendanceSession(payload: {
  idGroupCourse: number;
  idSchedule: number;
  idProfessor: number;
  geoLatitude?: number;
  geoLongitude?: number;
}): Promise<AttendanceSessionResponse> {
  const { data } = await attendanceApi.post("/sessions/start", payload);
  return data;
}
