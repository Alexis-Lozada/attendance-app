import { attendanceApi } from "@/services/api";

// === Interfaces ===

export interface ScheduleResponse {
  idSchedule: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  classroom: string;
  idGroupCourse: number;
}

export interface GroupCourseScheduleResponse {
  idGroupCourse: number;
  idGroup: number;
  idCourse: number;
  idProfessor: number;
  schedules: ScheduleResponse[];
}

export interface ScheduleRequest {
  idSchedule?: number; // opcional para detectar si es update o create
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  classroom: string;
}

export interface GroupCourseScheduleRequest {
  idGroupCourse?: number;
  idCourse: number;
  idProfessor: number;
  schedules: ScheduleRequest[];
}

export interface ScheduleGroupRequest {
  idGroup: number;
  groupCourses: GroupCourseScheduleRequest[];
}

// === Obtener el horario completo de un grupo ===
export async function getSchedulesByGroup(
  idGroup: number
): Promise<GroupCourseScheduleResponse[]> {
  const { data } = await attendanceApi.get(`/schedules/group/${idGroup}`);
  return data;
}

// === Crear o actualizar el horario completo de un grupo ===
export async function createOrUpdateGroupSchedules(
  payload: ScheduleGroupRequest
): Promise<GroupCourseScheduleResponse[]> {
  const { data } = await attendanceApi.post("/schedules/group", payload);
  return data;
}
