import { api } from "@/services/api";

// === Interfaces ===
export interface GroupCourseResponse {
  idGroupCourse: number;
  idGroup: number;
  idCourse: number;
  idProfessor: number;
  groupCode?: string;
  courseCode?: string;
  courseName?: string;
  professorName?: string;
}

// === Obtener todos los registros ===
export async function getAllGroupCourses(): Promise<GroupCourseResponse[]> {
  const { data } = await api.get("/group-courses");
  return data;
}

// === Obtener un registro por ID ===
export async function getGroupCourseById(id: number): Promise<GroupCourseResponse> {
  const { data } = await api.get(`/group-courses/${id}`);
  return data;
}

// === Obtener registros por grupo ===
export async function getGroupCoursesByGroup(idGroup: number): Promise<GroupCourseResponse[]> {
  const { data } = await api.get(`/group-courses/group/${idGroup}`);
  return data;
}

// === Obtener registros por profesor ===
export async function getGroupCoursesByProfessor(idProfessor: number): Promise<GroupCourseResponse[]> {
  const { data } = await api.get(`/group-courses/professor/${idProfessor}`);
  return data;
}

// === Contar registros por curso ===
export async function countGroupCoursesByCourse(idCourse: number): Promise<number> {
  const { data } = await api.get(`/group-courses/course/${idCourse}/count`);
  return data;
}

// === Crear o actualizar una asignación grupo-curso-profesor ===
// Este endpoint maneja tanto creación como actualización según si se incluye el ID
export async function saveGroupCourse(payload: {
  idGroupCourse?: number;
  idGroup: number;
  idCourse: number;
  idProfessor: number;
}): Promise<GroupCourseResponse> {
  const { idGroupCourse, ...body } = payload;
  const url = idGroupCourse
    ? `/group-courses/${idGroupCourse}`
    : `/group-courses`;
  const method = idGroupCourse ? "put" : "post";

  const { data } = await api.request({
    url,
    method,
    data: body,
  });

  return data;
}

// === Eliminar una asignación ===
export async function deleteGroupCourse(id: number): Promise<void> {
  await api.delete(`/group-courses/${id}`);
}
