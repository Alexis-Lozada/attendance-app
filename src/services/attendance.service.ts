import { api } from "@/services/api";

/** === Interfaces === */
export interface AttendanceResponse {
  idAttendance: number;
  idSchedule: number;
  idStudent: number;
  attendanceDate: string;
  status: string;
  comments?: string;
  studentName?: string;
  enrollmentNumber?: string;
  profileImage?: string;
}

/** === Obtener asistencias por GroupCourse === */
export async function getAttendancesByGroupCourse(
  idGroupCourse: number
): Promise<AttendanceResponse[]> {
  const { data } = await api.get(
    `/attendances/group-course/${idGroupCourse}`
  );
  return data;
}

/** === Obtener asistencias por Schedule === */
export async function getAttendancesBySchedule(
  idSchedule: number
): Promise<AttendanceResponse[]> {
  const { data } = await api.get(`/attendances/schedule/${idSchedule}`);
  return data;
}

/** === Obtener asistencias por Student === */
export async function getAttendancesByStudent(
  idStudent: number
): Promise<AttendanceResponse[]> {
  const { data } = await api.get(`/attendances/student/${idStudent}`);
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
  const { data } = await api.post("/attendances", payload);
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
  const { data } = await api.put(`/attendances/${id}`, payload);
  return data;
}

/** === Eliminar una asistencia === */
export async function deleteAttendance(id: number): Promise<void> {
  await api.delete(`/attendances/${id}`);
}
