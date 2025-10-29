// src/hooks/useUser.ts - VERSIÓN CORREGIDA
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
    getUsersByUniversity,
    createUser,
    updateUser,
    updateUserStatus,
} from "@/services/users.service";
import type { User } from "@/components/users/UsersTypes";

export function useUser() {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [toast, setToast] = useState<{
        title: string;
        description?: string;
        type: "success" | "error";
    } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const usersPerPage = 5;

    // 🔹 Cargar usuarios - CON MEJOR MANEJO DE ERRORES
    useEffect(() => {
        if (!user?.idUniversity) {
            setLoading(false);
            return;
        }

        const loadUsers = async () => {
            try {
                setLoading(true);
                console.log("Cargando usuarios para universidad:", user.idUniversity);
                
                const data = await getUsersByUniversity(user.idUniversity);
                console.log("Usuarios recibidos:", data);
                
                const mapped = data.map((d) => ({
                    id: d.idUser,
                    idUniversity: d.idUniversity,
                    email: d.email,
                    enrollmentNumber: d.enrollmentNumber || "",
                    firstName: d.firstName,
                    lastName: d.lastName,
                    role: d.role,
                    status: d.status,
                }));
                
                setUsers(mapped);
            } catch (err: any) {
                console.error("Error detallado al cargar usuarios:", err);
                setToast({
                    title: "Error al cargar usuarios",
                    description: err.response?.data?.message || "No se pudieron obtener los datos de usuarios.",
                    type: "error",
                });
                setUsers([]); // Asegurar que esté vacío en caso de error
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, [user?.idUniversity]);

    // 🔹 Crear usuario
    const handleSaveUser = async (data: Omit<User, "id"> & { password: string }) => {
        if (!user?.idUniversity) {
            setToast({
                title: "Error",
                description: "No se pudo determinar la universidad del usuario.",
                type: "error",
            });
            return;
        }

        try {
            const newUser = await createUser({
                ...data,
                idUniversity: user.idUniversity,
                status: true,
            });

            setUsers((prev) => [
                ...prev,
                {
                    id: newUser.idUser,
                    idUniversity: newUser.idUniversity,
                    email: newUser.email,
                    enrollmentNumber: newUser.enrollmentNumber || "",
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    role: newUser.role,
                    status: newUser.status,
                },
            ]);

            setToast({
                title: "Usuario creado correctamente",
                description: "El nuevo usuario se agregó exitosamente.",
                type: "success",
            });

            setIsModalOpen(false);
        } catch (err: any) {
            console.error("Error creando usuario:", err);
            setToast({
                title: "Error al crear el usuario",
                description: err.response?.data?.message || "No se pudo registrar el nuevo usuario.",
                type: "error",
            });
        }
    };

    // 🔹 Editar usuario
    const handleUpdateUser = async (id: number, data: Omit<User, "id"> & { password?: string }) => {
        try {
            const payload = {
                ...data,
                idUniversity: user?.idUniversity || 0,
            };

            // Si no hay password, eliminarlo del payload
            if (!data.password) {
                delete payload.password;
            }

            const updated = await updateUser(id, payload);

            setUsers((prev) =>
                prev.map((u) =>
                    u.id === id
                        ? {
                            ...u,
                            email: updated.email,
                            enrollmentNumber: updated.enrollmentNumber || "",
                            firstName: updated.firstName,
                            lastName: updated.lastName,
                            role: updated.role,
                            status: updated.status,
                        }
                        : u
                )
            );

            setToast({
                title: "Usuario actualizado",
                description: "Los cambios se guardaron correctamente.",
                type: "success",
            });

            setIsModalOpen(false);
        } catch (err: any) {
            console.error("Error al actualizar usuario:", err);
            setToast({
                title: "Error al actualizar usuario",
                description: err.response?.data?.message || "No se pudieron aplicar los cambios.",
                type: "error",
            });
        }
    };

    // 🔹 Cambiar estado (activar/desactivar)
    const handleToggleStatus = async (id: number, currentStatus: boolean) => {
        try {
            const updated = await updateUserStatus(id, !currentStatus);

            setUsers((prev) =>
                prev.map((u) => (u.id === id ? { ...u, status: updated.status } : u))
            );

            setToast({
                title: updated.status ? "Usuario activado" : "Usuario desactivado",
                description: `El usuario fue ${updated.status ? "activado" : "desactivado"} correctamente.`,
                type: "success",
            });
        } catch (err: any) {
            console.error("Error al actualizar estado:", err);
            setToast({
                title: "Error al actualizar estado",
                description: err.response?.data?.message || "No se pudo cambiar el estado del usuario.",
                type: "error",
            });
        }
    };

    // 🔹 Filtrado y paginación
    const filtered = users.filter(
        (u) =>
            u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u.enrollmentNumber && u.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
            u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / usersPerPage);
    const current = filtered.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
    );

    // 🔹 Ocultar toast automáticamente después de 4s
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    return {
        loading,
        users: current,
        totalUsers: filtered.length,
        totalPages,
        currentPage,
        toast,
        isModalOpen,
        setToast,
        setIsModalOpen,
        setSearchTerm,
        setCurrentPage,
        handleSaveUser,
        handleUpdateUser,
        handleToggleStatus,
    };
}