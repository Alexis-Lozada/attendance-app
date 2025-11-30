import { api } from "@/services/api";

export interface DivisionResponse {
    idDivision: number;
    idUniversity: number;
    idCoordinator?: number;
    code: string;
    name: string;
    description: string;
    status: boolean;
}

// === Obtener todas las divisiones de una universidad ===
export async function getDivisionsByUniversity(idUniversity: number): Promise<DivisionResponse[]> {
    const { data } = await api.get(`/divisions/university/${idUniversity}`);
    return data;
}

// === Obtener divisiones activas de una universidad ===
export async function getActiveDivisionsByUniversity(idUniversity: number): Promise<DivisionResponse[]> {
    const { data } = await api.get(`/divisions/university/${idUniversity}/active`);
    return data;
}

// === Obtener una división por ID ===
export async function getDivisionById(id: number): Promise<DivisionResponse> {
    const { data } = await api.get(`/divisions/${id}`);
    return data;
}

// === Crear nueva división ===
export async function createDivision(payload: {
    idUniversity: number;
    idCoordinator?: number;
    code: string;
    name: string;
    description: string;
    status: boolean;
}): Promise<DivisionResponse> {
    const { data } = await api.post("/divisions", payload);
    return data;
}

// === Actualizar división ===
// En division.service.ts - ACTUALIZAR LA INTERFACE DEL PAYLOAD
// === Actualizar división existente ===
export async function updateDivision(id: number, payload: {
    idDivision?: number;  // ✅ Hacer opcional para compatibilidad
    idUniversity: number;
    idCoordinator?: number;
    code: string;
    name: string;
    description: string;
    status: boolean;
}): Promise<DivisionResponse> {
    try {
        const response = await api.put(`/divisions/${id}`, payload);
        return response.data;
    } catch (error: any) {
        throw error;
    }
}

// === Actualizar estado de división ===
// division.service.ts - ACTUALIZADO PARA PUT
export async function updateDivisionStatus(id: number, status: boolean): Promise<any> {
    try {
        // CAMBIO: Usar PUT en lugar de PATCH
        const { data } = await api.put(`/divisions/${id}/status?status=${status}`);
        return data;
    } catch (error: any) {
        throw error;
    }
}

// === Eliminar división (PERMANENTE) ===
export async function deleteDivision(id: number): Promise<void> {
    try {
        const response = await api.delete(`/divisions/${id}`); // Sin /soft
        return response.data;
    } catch (error: any) {
        throw error;
    }
}