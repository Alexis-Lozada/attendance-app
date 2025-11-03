import { academicApi } from "@/services/api";

export interface ProgramResponse {
    idProgram: number;
    idDivision: number;
    programCode: string;
    programName: string;
    description: string;
    status: boolean;
}

// === Obtener todos los programas de una universidad ===
export async function getProgramsByUniversity(idUniversity: number): Promise<ProgramResponse[]> {
    const { data } = await academicApi.get(`/programs/university/${idUniversity}`);
    return data;
}

// === Obtener programas activos de una universidad ===
export async function getActiveProgramsByUniversity(idUniversity: number): Promise<ProgramResponse[]> {
    const { data } = await academicApi.get(`/programs/university/${idUniversity}/active`);
    return data;
}

// === Obtener un programa por ID ===
export async function getProgramById(id: number): Promise<ProgramResponse> {
    const { data } = await academicApi.get(`/programs/${id}`);
    return data;
}

// === Crear nuevo programa ===
export async function createProgram(payload: {
    idDivision: number;
    programCode: string;
    programName: string;
    description: string;
    status: boolean;
}): Promise<ProgramResponse> {
    const { data } = await academicApi.post("/programs", payload);
    return data;
}

// === Actualizar programa existente ===
export async function updateProgram(id: number, payload: {
    idProgram?: number;
    idDivision: number;
    programCode: string;
    programName: string;
    description: string;
    status: boolean;
}): Promise<ProgramResponse> {
    try {
        const response = await academicApi.put(`/programs/${id}`, payload);
        return response.data;
    } catch (error: any) {
        throw error;
    }
}

// === Actualizar estado de programa ===
export async function updateProgramStatus(id: number, status: boolean): Promise<any> {
    try {
        const { data } = await academicApi.put(`/programs/${id}/status?status=${status}`);
        return data;
    } catch (error: any) {
        throw error;
    }
}

// === Eliminar programa (PERMANENTE) ===
export async function deleteProgram(id: number): Promise<void> {
    try {
        const response = await academicApi.delete(`/programs/${id}`);
        return response.data;
    } catch (error: any) {
        throw error;
    }
}