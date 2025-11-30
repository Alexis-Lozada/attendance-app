import { api } from "@/services/api";

export interface CourseModuleResponse {
  idModule: number;
  idCourse: number;
  moduleNumber: number;
  title: string;
  startDate?: string | null;
  endDate?: string | null;
}

// === Obtener módulos por curso ===
export async function getModulesByCourse(idCourse: number): Promise<CourseModuleResponse[]> {
  const { data } = await api.get(`/course-modules/course/${idCourse}`);
  return data;
}

// === Obtener módulo por ID ===
export async function getModuleById(idModule: number): Promise<CourseModuleResponse> {
  const { data } = await api.get(`/course-modules/${idModule}`);
  return data;
}

// === Crear nuevo módulo ===
export async function createModule(payload: {
  idCourse: number;
  moduleNumber: number;
  title: string;
  startDate: string;
  endDate: string;
}): Promise<CourseModuleResponse> {
  const { data } = await api.post("/course-modules", payload);
  return data;
}

// === Actualizar módulo existente ===
export async function updateModule(
  idModule: number,
  payload: {
    idCourse: number;
    moduleNumber: number;
    title: string;
    startDate: string;
    endDate: string;
  }
): Promise<CourseModuleResponse> {
  const { data } = await api.put(`/course-modules/${idModule}`, payload);
  return data;
}

// === Eliminar módulo ===
export async function deleteModule(idModule: number): Promise<void> {
  await api.delete(`/course-modules/${idModule}`);
}
