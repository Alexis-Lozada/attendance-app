import { api } from "@/services/api";

export interface EnrollmentResponse {
  idEnrollment: number;
  idStudent: number;
  studentName: string;
  idGroup: number;
  groupCode: string;
  enrollmentDate: string;
  status: boolean;
}

// === Obtener todas las inscripciones ===
export async function getAllEnrollments(): Promise<EnrollmentResponse[]> {
  const { data } = await api.get("/enrollments");
  return data;
}

// === Obtener inscripción por ID ===
export async function getEnrollmentById(id: number): Promise<EnrollmentResponse> {
  const { data } = await api.get(`/enrollments/${id}`);
  return data;
}

// === Obtener inscripciones por estudiante ===
export async function getEnrollmentsByStudent(idStudent: number): Promise<EnrollmentResponse[]> {
  const { data } = await api.get(`/enrollments/student/${idStudent}`);
  return data;
}

// === Obtener inscripciones por grupo ===
export async function getEnrollmentsByGroup(idGroup: number): Promise<EnrollmentResponse[]> {
  const { data } = await api.get(`/enrollments/group/${idGroup}`);
  return data;
}

// === Crear nueva inscripción ===
export async function createEnrollment(payload: {
  idStudent: number;
  idGroup: number;
  enrollmentDate?: string;
  status?: boolean;
}): Promise<EnrollmentResponse> {
  const { data } = await api.post("/enrollments", payload);
  return data;
}

// === Actualizar estado (activar / desactivar inscripción) ===
export async function updateEnrollmentStatus(id: number, status: boolean): Promise<EnrollmentResponse> {
  try {
    const { data } = await api.put(`/enrollments/${id}/status?status=${status}`);
    return data;
  } catch (error: any) {
    throw error;
  }
}

// === Eliminar inscripción (permanente) ===
export async function deleteEnrollment(id: number): Promise<void> {
  try {
    const { data } = await api.delete(`/enrollments/${id}`);
    return data;
  } catch (error: any) {
    throw error;
  }
}
