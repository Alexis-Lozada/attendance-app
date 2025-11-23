import { attendanceApi } from "@/services/api";

/** === Interfaces === */
export interface AttendanceResponse {
  idAttendance: number;
  idSchedule: number;
  idStudent: number;
  attendanceDate: string;
  status: string;
  comments?: string;
}

/** === Obtener asistencias por GroupCourse === */
export async function getAttendancesByGroupCourse(
  idGroupCourse: number
): Promise<AttendanceResponse[]> {
  const { data } = await attendanceApi.get(
    `/attendances/group-course/${idGroupCourse}`
  );
  return data;
}

/** === Crear nueva asistencia === */
export async function createAttendance(payload: {
  idSchedule: number;
  idStudent: number;
  attendanceDate: string;
  status: string;
  comments?: string;
}): Promise<AttendanceResponse> {
  const { data } = await attendanceApi.post("/attendances", payload);
  return data;
}

/** === Actualizar una asistencia existente === */
export async function updateAttendance(
  id: number,
  payload: {
    idSchedule: number;
    idStudent: number;
    attendanceDate: string;
    status: string;
    comments?: string;
  }
): Promise<AttendanceResponse> {
  const { data } = await attendanceApi.put(`/attendances/${id}`, payload);
  return data;
}

/** === Eliminar una asistencia === */
export async function deleteAttendance(id: number): Promise<void> {
  await attendanceApi.delete(`/attendances/${id}`);
}
