"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
    getProgramsByUniversity,
    createProgram,
    updateProgram,
    updateProgramStatus,
} from "@/services/program.service";
import type { Program } from "@/components/programs/ProgramsTypes";

/**
 * Hook personalizado para manejar programas académicos:
 * - Carga, búsqueda, paginación
 * - Creación y edición
 * - Cambio de estado
 * - Manejo de modal y notificaciones
 */
export function useProgram() {
    const { user } = useAuth();
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [toast, setToast] = useState<{
        title: string;
        description?: string;
        type: "success" | "error";
    } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const programsPerPage = 5;

    // 🔹 Cargar programas
    useEffect(() => {
        if (!user?.idUniversity) return;

        const load = async () => {
            try {
                setLoading(true);
                const data = await getProgramsByUniversity(user.idUniversity);
                const mapped = data.map((d) => ({
                    id: d.idProgram,
                    idDivision: d.idDivision,
                    programCode: d.programCode,
                    programName: d.programName,
                    description: d.description,
                    status: d.status,
                }));
                setPrograms(mapped);
            } catch (err) {
                console.error("Error al cargar programas:", err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [user?.idUniversity]);

    // 🔹 Crear programa
    const handleSaveProgram = async (data: Omit<Program, "id">) => {
        if (!user?.idUniversity) {
            setToast({
                title: "Error",
                description: "No se pudo determinar la universidad del usuario.",
                type: "error",
            });
            return;
        }

        try {
            const newProgram = await createProgram({
                ...data,
                status: true, // ✅ activo por defecto
            });

            setPrograms((prev) => [
                ...prev,
                {
                    id: newProgram.idProgram,
                    idDivision: newProgram.idDivision,
                    programCode: newProgram.programCode,
                    programName: newProgram.programName,
                    description: newProgram.description,
                    status: newProgram.status,
                },
            ]);

            setToast({
                title: "Programa creado correctamente",
                description: "El nuevo programa se agregó exitosamente.",
                type: "success",
            });

            setIsModalOpen(false);
        } catch (err) {
            console.error("Error creando programa:", err);
            setToast({
                title: "Error al crear el programa",
                description: "No se pudo registrar el nuevo programa.",
                type: "error",
            });
        }
    };

    // 🔹 Editar programa
    const handleUpdateProgram = async (id: number, data: Omit<Program, "id">) => {
        try {
            const updated = await updateProgram(id, data);

            setPrograms((prev) =>
                prev.map((p) =>
                    p.id === id
                        ? {
                            ...p,
                            programCode: updated.programCode,
                            programName: updated.programName,
                            description: updated.description,
                            status: updated.status,
                        }
                        : p
                )
            );

            setToast({
                title: "Programa actualizado",
                description: "Los cambios se guardaron correctamente.",
                type: "success",
            });

            setIsModalOpen(false);
        } catch (err) {
            console.error("Error al actualizar programa:", err);
            setToast({
                title: "Error al actualizar programa",
                description: "No se pudieron aplicar los cambios.",
                type: "error",
            });
        }
    };

    // 🔹 Cambiar estado (activar/desactivar)
    const handleToggleStatus = async (id: number, currentStatus: boolean) => {
        try {
            const updated = await updateProgramStatus(id, !currentStatus);

            setPrograms((prev) =>
                prev.map((p) => (p.id === id ? { ...p, status: updated.status } : p))
            );

            setToast({
                title: updated.status ? "Programa activado" : "Programa desactivado",
                description: `El programa fue ${updated.status ? "activado" : "desactivado"
                    } correctamente.`,
                type: "success",
            });
        } catch (err) {
            console.error("Error al actualizar estado:", err);
            setToast({
                title: "Error al actualizar estado",
                description: "No se pudo cambiar el estado del programa.",
                type: "error",
            });
        }
    };

    // 🔹 Filtrado y paginación
    const filtered = programs.filter(
        (p) =>
            p.programCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / programsPerPage);
    const current = filtered.slice(
        (currentPage - 1) * programsPerPage,
        currentPage * programsPerPage
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
        programs: current,
        totalPrograms: filtered.length,
        totalPages,
        currentPage,
        toast,
        isModalOpen,
        setToast,
        setIsModalOpen,
        setSearchTerm,
        setCurrentPage,
        handleSaveProgram,
        handleUpdateProgram,
        handleToggleStatus,
    };
}