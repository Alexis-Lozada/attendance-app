import { academicApi } from "@/services/api";

export interface GroupResponse {
  idGroup: number;
  idProgram: number;
  programName: string;
  idTutor: number;
  tutorName: string;
  groupCode: string;
  groupName: string;
  semester: string;
  academicYear: string;
  status: boolean;
}

// === Obtener todos los grupos ===
export async function getAllGroups(): Promise<GroupResponse[]> {
  const { data } = await academicApi.get("/groups");
  return data;
}

// === Obtener grupos activos ===
export async function getActiveGroups(): Promise<GroupResponse[]> {
  const { data } = await academicApi.get("/groups/active");
  return data;
}

// === Obtener grupo por ID ===
export async function getGroupById(id: number): Promise<GroupResponse> {
  const { data } = await academicApi.get(`/groups/${id}`);
  return data;
}

// === Obtener grupos por programa ===
export async function getGroupsByProgram(idProgram: number): Promise<GroupResponse[]> {
  const { data } = await academicApi.get(`/groups/program/${idProgram}`);
  return data;
}

// === Obtener grupos activos por programa ===
export async function getActiveGroupsByProgram(idProgram: number): Promise<GroupResponse[]> {
  const { data } = await academicApi.get(`/groups/program/${idProgram}/active`);
  return data;
}

// === Obtener grupos por universidad ===
export async function getGroupsByUniversity(idUniversity: number): Promise<GroupResponse[]> {
  const { data } = await academicApi.get(`/groups/university/${idUniversity}`);
  return data;
}

// === Obtener grupos activos por universidad ===
export async function getActiveGroupsByUniversity(idUniversity: number): Promise<GroupResponse[]> {
  const { data } = await academicApi.get(`/groups/university/${idUniversity}/active`);
  return data;
}

// === Crear nuevo grupo ===
export async function createGroup(payload: {
  idProgram: number;
  idTutor: number;
  groupCode: string;
  groupName: string;
  semester: string;
  academicYear: string;
  status: boolean;
}): Promise<GroupResponse> {
  const { data } = await academicApi.post("/groups", payload);
  return data;
}

// === Actualizar grupo existente ===
export async function updateGroup(
  id: number,
  payload: {
    idGroup?: number;
    idProgram: number;
    idTutor: number;
    groupCode: string;
    groupName: string;
    semester: string;
    academicYear: string;
    status: boolean;
  }
): Promise<GroupResponse> {
  try {
    const { data } = await academicApi.put(`/groups/${id}`, payload);
    return data;
  } catch (error: any) {
    throw error;
  }
}

// === Actualizar estado del grupo ===
export async function updateGroupStatus(id: number, status: boolean): Promise<GroupResponse> {
  try {
    const { data } = await academicApi.put(`/groups/${id}/status?status=${status}`);
    return data;
  } catch (error: any) {
    throw error;
  }
}

// === Eliminar grupo (PERMANENTE) ===
export async function deleteGroup(id: number): Promise<void> {
  try {
    const { data } = await academicApi.delete(`/groups/${id}`);
    return data;
  } catch (error: any) {
    throw error;
  }
}
