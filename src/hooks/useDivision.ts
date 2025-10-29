"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getDivisionsByUniversity,
  createDivision,
  updateDivision,
  updateDivisionStatus,
} from "@/services/division.service";
import type { Division } from "@/components/divisions/DivisionsTypes";

/**
 * Hook personalizado para manejar divisiones académicas:
 * - Carga, búsqueda, paginación
 * - Creación y edición
 * - Cambio de estado
 * - Manejo de modal y notificaciones
 */
export function useDivision() {
  const { user } = useAuth();
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    type: "success" | "error";
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const divisionsPerPage = 5;

  // 🔹 Cargar divisiones
  useEffect(() => {
    if (!user?.idUniversity) return;

    const load = async () => {
      try {
        setLoading(true);
        const data = await getDivisionsByUniversity(user.idUniversity);
        const mapped = data.map((d) => ({
          id: d.idDivision,
          idUniversity: d.idUniversity,
          code: d.code,
          name: d.name,
          description: d.description,
          status: d.status,
        }));
        setDivisions(mapped);
      } catch (err) {
        console.error("Error al cargar divisiones:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.idUniversity]);

  // 🔹 Crear división
  const handleSaveDivision = async (data: Omit<Division, "id">) => {
    if (!user?.idUniversity) {
      setToast({
        title: "Error",
        description: "No se pudo determinar la universidad del usuario.",
        type: "error",
      });
      return;
    }

    try {
      const newDivision = await createDivision({
        ...data,
        idUniversity: user.idUniversity,
        status: true, // ✅ activa por defecto
      });

      setDivisions((prev) => [
        ...prev,
        {
          id: newDivision.idDivision,
          idUniversity: newDivision.idUniversity,
          code: newDivision.code,
          name: newDivision.name,
          description: newDivision.description,
          status: newDivision.status,
        },
      ]);

      setToast({
        title: "División creada correctamente",
        description: "La nueva división se agregó exitosamente.",
        type: "success",
      });

      setIsModalOpen(false);
    } catch (err) {
      console.error("Error creando división:", err);
      setToast({
        title: "Error al crear la división",
        description: "No se pudo registrar la nueva división.",
        type: "error",
      });
    }
  };

  // 🔹 Editar división
  const handleUpdateDivision = async (id: number, data: Omit<Division, "id">) => {
    try {
      const updated = await updateDivision(id, data);

      setDivisions((prev) =>
        prev.map((d) =>
          d.id === id
            ? {
                ...d,
                code: updated.code,
                name: updated.name,
                description: updated.description,
                status: updated.status,
              }
            : d
        )
      );

      setToast({
        title: "División actualizada",
        description: "Los cambios se guardaron correctamente.",
        type: "success",
      });

      setIsModalOpen(false);
    } catch (err) {
      console.error("Error al actualizar división:", err);
      setToast({
        title: "Error al actualizar división",
        description: "No se pudieron aplicar los cambios.",
        type: "error",
      });
    }
  };

  // 🔹 Cambiar estado (activar/desactivar)
  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const updated = await updateDivisionStatus(id, !currentStatus);

      setDivisions((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: updated.status } : d))
      );

      setToast({
        title: updated.status ? "División activada" : "División desactivada",
        description: `La división fue ${
          updated.status ? "activada" : "desactivada"
        } correctamente.`,
        type: "success",
      });
    } catch (err) {
      console.error("Error al actualizar estado:", err);
      setToast({
        title: "Error al actualizar estado",
        description: "No se pudo cambiar el estado de la división.",
        type: "error",
      });
    }
  };

  // 🔹 Filtrado y paginación
  const filtered = divisions.filter(
    (d) =>
      d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / divisionsPerPage);
  const current = filtered.slice(
    (currentPage - 1) * divisionsPerPage,
    currentPage * divisionsPerPage
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
    divisions: current,
    totalDivisions: filtered.length,
    totalPages,
    currentPage,
    toast,
    isModalOpen,
    setToast,
    setIsModalOpen,
    setSearchTerm,
    setCurrentPage,
    handleSaveDivision,
    handleUpdateDivision,
    handleToggleStatus,
  };
}
