"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getProgramsByUniversity,
  createProgram,
  updateProgram,
  updateProgramStatus,
} from "@/services/program.service";
import { getDivisionsByUniversity } from "@/services/division.service";
import type { ProgramWithDivision, ProgramFormData } from "@/types/program";
import type { Division } from "@/types/division";

/**
 * Hook personalizado para manejar programas educativos:
 * - Carga, búsqueda, paginación y filtrado por división
 * - Creación y edición de programas
 * - Cambio de estado (activo/inactivo)
 * - Manejo de modal y notificaciones
 */

export function useProgram() {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<ProgramWithDivision[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivision, setSelectedDivision] = useState<number | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    type: "success" | "error";
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<ProgramWithDivision | null>(null);

  const programsPerPage = 5;

  // Cargar programas y divisiones
  useEffect(() => {
    if (!user?.idUniversity) return;

    const loadData = async () => {
      try {
        setLoading(true);
        
        // Cargar en paralelo programas y divisiones
        const [programsData, divisionsData] = await Promise.all([
          getProgramsByUniversity(user.idUniversity),
          getDivisionsByUniversity(user.idUniversity)
        ]);

        // Mapear programas con información de división
        const programsWithDivision: ProgramWithDivision[] = programsData.map((program) => {
          const division = divisionsData.find(d => d.idDivision === program.idDivision);
          return {
            ...program,
            divisionName: division?.name,
            divisionCode: division?.code,
          };
        });

        setPrograms(programsWithDivision);
        setDivisions(divisionsData.map(d => ({
          idDivision: d.idDivision,
          name: d.name,
          code: d.code
        })));
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setToast({
          title: "Error de carga",
          description: "No se pudieron cargar los programas educativos.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.idUniversity]);

  // Filtrado y paginación
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = 
      program.programCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.divisionName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDivision = selectedDivision === "all" || program.idDivision === selectedDivision;
    
    return matchesSearch && matchesDivision;
  });

  const totalPages = Math.ceil(filteredPrograms.length / programsPerPage);
  const currentPrograms = filteredPrograms.slice(
    (currentPage - 1) * programsPerPage,
    currentPage * programsPerPage
  );

  // Cambiar filtro de división
  const handleDivisionChange = (divisionId: number | "all") => {
    setSelectedDivision(divisionId);
    setCurrentPage(1);
  };

  // Crear programa
  const handleCreateProgram = async (data: ProgramFormData) => {
    if (!user?.idUniversity) {
      setToast({
        title: "Error",
        description: "No se pudo determinar la universidad del usuario.",
        type: "error",
      });
      return;
    }

    try {
      setFormLoading(true);
      const newProgram = await createProgram({
        ...data,
        status: true, // Nuevos programas siempre activos
      });

      // Encontrar la división para agregar información completa
      const division = divisions.find(d => d.idDivision === newProgram.idDivision);
      const programWithDivision: ProgramWithDivision = {
        ...newProgram,
        divisionName: division?.name,
        divisionCode: division?.code,
      };

      setPrograms(prev => [...prev, programWithDivision]);
      setToast({
        title: "Programa creado",
        description: "El nuevo programa educativo se agregó exitosamente.",
        type: "success",
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error creando programa:", err);
      setToast({
        title: "Error al crear programa",
        description: "No se pudo registrar el nuevo programa educativo.",
        type: "error",
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Actualizar programa
  const handleUpdateProgram = async (idProgram: number, data: ProgramFormData) => {
    try {
      setFormLoading(true);
      const updated = await updateProgram(idProgram, {
        idProgram,
        ...data,
      });

      // Encontrar la división para agregar información completa
      const division = divisions.find(d => d.idDivision === updated.idDivision);
      
      setPrograms(prev =>
        prev.map(p =>
          p.idProgram === idProgram
            ? {
                ...updated,
                divisionName: division?.name,
                divisionCode: division?.code,
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
    } finally {
      setFormLoading(false);
    }
  };

  // Cambiar estado (activar/desactivar)
  const handleToggleStatus = async (idProgram: number, currentStatus: boolean) => {
    try {
      const updated = await updateProgramStatus(idProgram, !currentStatus);

      setPrograms(prev =>
        prev.map(p => (p.idProgram === idProgram ? { ...p, status: updated.status } : p))
      );

      setToast({
        title: updated.status ? "Programa activado" : "Programa desactivado",
        description: `El programa fue ${
          updated.status ? "activado" : "desactivado"
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

  // Guardar programa (crear o actualizar)
  const handleSaveProgram = async (data: ProgramFormData, idProgram?: number) => {
    if (idProgram) {
      await handleUpdateProgram(idProgram, data);
    } else {
      await handleCreateProgram(data);
    }
  };

  // Abrir modal para editar
  const handleEdit = (program: ProgramWithDivision) => {
    setSelectedProgram(program);
    setIsModalOpen(true);
  };

  // Abrir modal para crear
  const handleOpenAdd = () => {
    setSelectedProgram(null);
    setIsModalOpen(true);
  };

  // Ocultar toast automáticamente después de 4s
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return {
    // Data
    programs: currentPrograms,
    divisions,
    filteredPrograms,
    totalPrograms: filteredPrograms.length,
    
    // Pagination
    currentPage,
    totalPages,
    
    // Filters
    searchTerm,
    selectedDivision,
    setSearchTerm,
    handleDivisionChange,
    setCurrentPage,
    
    // Modal & Form
    isModalOpen,
    setIsModalOpen,
    selectedProgram,
    formLoading,
    
    // Actions
    handleSaveProgram,
    handleToggleStatus,
    handleEdit,
    handleOpenAdd,
    
    // State
    loading,
    toast,
    setToast,
  };
}