import { academicApi } from "@/services/api";

// === Interface del curso ===
export interface CourseResponse {
  idCourse: number;
  idUniversity: number;
  idDivision: number;
  courseCode: string;
  courseName: string;
  semester?: string | null; // puede ser null si es curso general
  status: boolean;
}

// === Obtener cursos por universidad (opcionalmente solo activos o por semestre) ===
export async function getCoursesByUniversity(
  idUniversity: number,
  active?: boolean,
  semester?: string
): Promise<CourseResponse[]> {
  const params: Record<string, any> = {};
  if (active !== undefined) params.active = active;
  if (semester) params.semester = semester;

  const { data } = await academicApi.get(`/courses/university/${idUniversity}`, { params });
  return data;
}

// === Obtener cursos por división (opcionalmente solo activos o por semestre) ===
export async function getCoursesByDivision(
  idDivision: number,
  active?: boolean,
  semester?: string
): Promise<CourseResponse[]> {
  const params: Record<string, any> = {};
  if (active !== undefined) params.active = active;
  if (semester) params.semester = semester;

  const { data } = await academicApi.get(`/courses/division/${idDivision}`, { params });
  return data;
}

// === Crear nuevo curso ===
export async function createCourse(payload: {
  idUniversity: number;
  idDivision: number;
  courseCode: string;
  courseName: string;
  semester?: string | null;
  status: boolean;
}): Promise<CourseResponse> {
  const { data } = await academicApi.post("/courses", payload);
  return data;
}

// === Actualizar curso existente ===
export async function updateCourse(
  idCourse: number,
  payload: {
    idCourse?: number; // opcional para compatibilidad
    idUniversity: number;
    idDivision: number;
    courseCode: string;
    courseName: string;
    semester?: string | null;
    status: boolean;
  }
): Promise<CourseResponse> {
  const { data } = await academicApi.put(`/courses/${idCourse}`, payload);
  return data;
}

// === Cambiar estatus del curso (activar/desactivar) ===
export async function updateCourseStatus(idCourse: number, status: boolean): Promise<CourseResponse> {
  const { data } = await academicApi.put(`/courses/${idCourse}/status`, null, {
    params: { status },
  });
  return data;
}
