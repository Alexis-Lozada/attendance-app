// src/services/users.service.ts - VERSIÓN CON MEJOR MANEJO DE ERRORES
import { usersApi } from "@/services/api";

export interface UserResponse {
    idUser: number;
    idUniversity: number;
    email: string;
    enrollmentNumber: string;
    firstName: string;
    lastName: string;
    role: string;
    status: boolean;
}

// === Obtener todos los usuarios de una universidad ===
export async function getUsersByUniversity(idUniversity: number): Promise<UserResponse[]> {
    try {
        const { data } = await usersApi.get(`/users/university/${idUniversity}`);
        return data;
    } catch (error: any) {
        console.error("Error en getUsersByUniversity:", error.response?.data);
        throw error;
    }
}

// === Obtener un usuario por ID ===
export async function getUserById(id: number): Promise<UserResponse> {
    try {
        const { data } = await usersApi.get(`/users/${id}`);
        return data;
    } catch (error: any) {
        console.error("Error en getUserById:", error.response?.data);
        throw error;
    }
}

// === Crear nuevo usuario ===
export async function createUser(payload: {
    idUniversity: number;
    email: string;
    enrollmentNumber: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    status: boolean;
}): Promise<UserResponse> {
    try {
        const { data } = await usersApi.post("/users", payload);
        return data;
    } catch (error: any) {
        console.error("Error en createUser:", error.response?.data);
        throw error;
    }
}

// === Actualizar usuario existente ===
export async function updateUser(id: number, payload: {
    idUniversity: number;
    email: string;
    enrollmentNumber: string;
    password?: string;
    firstName: string;
    lastName: string;
    role: string;
    status: boolean;
}): Promise<UserResponse> {
    try {
        const { data } = await usersApi.put(`/users/${id}`, payload);
        return data;
    } catch (error: any) {
        console.error("Error en updateUser:", error.response?.data);
        throw error;
    }
}

// === Actualizar estado de usuario ===
export async function updateUserStatus(id: number, status: boolean): Promise<any> {
    try {
        const { data } = await usersApi.put(`/users/${id}/status?status=${status}`);
        return data;
    } catch (error: any) {
        console.error("Error en updateUserStatus:", error.response?.data);
        throw error;
    }
}