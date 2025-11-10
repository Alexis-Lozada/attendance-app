"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getGroupsByUniversity,
  createGroup,
  updateGroup,
  updateGroupStatus,
} from "@/services/group.service";
import { getProgramsByUniversity } from "@/services/program.service";
import { getDivisionsByUniversity } from "@/services/division.service";
import { getUsersByUniversity, getUserById } from "@/services/user.service";
import { getFileUrl } from "@/services/storage.service";
import { UserRole } from "@/types/roles";
import type { GroupWithDetails, GroupFormData } from "@/types/group";
import type { ProgramWithDivision } from "@/types/program";
import type { Division } from "@/types/division";
import type { User } from "@/types/user";

interface UserWithImage extends User {
  profileImageUrl?: string;
}

/**
 * Hook personalizado para manejar grupos académicos:
 * - Carga con control de roles (ADMIN ve todos, COORDINATOR solo de su división)
 * - Búsqueda, paginación y filtrado por programa/semestre
 * - Creación y edición de grupos
 * - Cambio de estado
 * - Manejo de modal y notificaciones
 * - Carga de datos de tutores y programas
 */
export function useGroup() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<GroupWithDetails[]>([]);
  const [programs, setPrograms] = useState<ProgramWithDivision[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [tutors, setTutors] = useState<UserWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<number | "all">("all");
  const [selectedSemester, setSelectedSemester] = useState<string | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    type: "success" | "error";
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupWithDetails | null>(null);

  const groupsPerPage = 5;

  // Helper function to load tutor data
  const loadTutorData = async (idTutor: number) => {
    try {
      const tutor = await getUserById(idTutor);
      const fullName = `${tutor.firstName} ${tutor.lastName}`;
      
      let imageUrl: string | undefined = undefined;
      if (tutor.profileImage) {
        const url = await getFileUrl(tutor.profileImage);
        imageUrl = url || undefined;
      }
      
      return { name: fullName, image: imageUrl };
    } catch (error) {
      console.error("Error loading tutor data:", error);
      return { name: "Error al cargar", image: undefined };
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    if (!user?.idUniversity) return;

    const loadData = async () => {
      try {
        setLoading(true);
        
        // Cargar datos base
        const [groupsData, programsData, divisionsData, usersData] = await Promise.all([
          getGroupsByUniversity(user.idUniversity),
          getProgramsByUniversity(user.idUniversity),
          getDivisionsByUniversity(user.idUniversity),
          getUsersByUniversity(user.idUniversity)
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

        // Filtrar programas según el rol del usuario
        let availablePrograms = programsWithDivision;
        if (user.role === UserRole.COORDINATOR) {
          // Si es coordinador, solo mostrar programas de divisiones que coordina
          const userDivisions = divisionsData.filter(d => d.idCoordinator === user.idUser);
          const divisionIds = userDivisions.map(d => d.idDivision);
          availablePrograms = programsWithDivision.filter(p => divisionIds.includes(p.idDivision));
        }

        // Filtrar grupos según el rol del usuario
        let availableGroups = groupsData;
        if (user.role === UserRole.COORDINATOR) {
          // Si es coordinador, solo mostrar grupos de sus programas
          const availableProgramIds = availablePrograms.map(p => p.idProgram);
          availableGroups = groupsData.filter(g => availableProgramIds.includes(g.idProgram));
        }

        // Cargar información detallada de grupos
        const groupsWithDetails = await Promise.all(
          availableGroups.map(async (group) => {
            const program = programsWithDivision.find(p => p.idProgram === group.idProgram);
            const tutorData = await loadTutorData(group.idTutor);
            
            return {
              ...group,
              programName: program?.programName,
              programCode: program?.programCode,
              divisionName: program?.divisionName,
              tutorName: tutorData.name,
              tutorImage: tutorData.image,
            };
          })
        );

        // Cargar tutores disponibles (usuarios con rol TUTOR activos)
        // Solo usuarios activos con rol TUTOR pueden ser asignados como tutores de grupo
        const tutorsWithImages = await Promise.all(
          usersData
            .filter(u => u.status && u.role === UserRole.TUTOR)
            .map(async (tutor) => {
              let profileImageUrl = undefined;
              if (tutor.profileImage) {
                profileImageUrl = await getFileUrl(tutor.profileImage) || undefined;
              }
              return { ...tutor, profileImageUrl };
            })
        );

        setGroups(groupsWithDetails);
        setPrograms(availablePrograms);
        setDivisions(divisionsData);
        setTutors(tutorsWithImages);
      } catch (err: any) {
        console.error("Error al cargar datos:", err);
        setToast({
          title: "Error de carga",
          description: err?.message || "No se pudieron cargar los grupos académicos.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.idUniversity, user?.idUser, user?.role]);

  // Filtrado y paginación
  const filteredGroups = groups.filter(group => {
    const matchesSearch = 
      group.groupCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.programName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.tutorName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProgram = selectedProgram === "all" || group.idProgram === selectedProgram;
    const matchesSemester = selectedSemester === "all" || group.semester === selectedSemester;
    
    return matchesSearch && matchesProgram && matchesSemester;
  });

  const totalPages = Math.ceil(filteredGroups.length / groupsPerPage);
  const currentGroups = filteredGroups.slice(
    (currentPage - 1) * groupsPerPage,
    currentPage * groupsPerPage
  );

  // Get unique semesters for filter
  const uniqueSemesters = [...new Set(groups.map(g => g.semester))].sort((a, b) => parseInt(a) - parseInt(b));

  // Crear grupo
  const handleCreateGroup = async (data: GroupFormData) => {
    try {
      setFormLoading(true);
      const newGroup = await createGroup({
        ...data,
        status: true, // Nuevos grupos siempre activos
      });

      // Cargar información detallada del nuevo grupo
      const program = programs.find(p => p.idProgram === newGroup.idProgram);
      const tutorData = await loadTutorData(newGroup.idTutor);
      
      const groupWithDetails: GroupWithDetails = {
        ...newGroup,
        programName: program?.programName,
        programCode: program?.programCode,
        divisionName: program?.divisionName,
        tutorName: tutorData.name,
        tutorImage: tutorData.image,
      };

      setGroups(prev => [...prev, groupWithDetails]);
      setToast({
        title: "Grupo creado",
        description: "El nuevo grupo académico se agregó exitosamente.",
        type: "success",
      });
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error creando grupo:", err);
      setToast({
        title: "Error al crear grupo",
        description: err?.message || "No se pudo registrar el nuevo grupo académico.",
        type: "error",
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Actualizar grupo
  const handleUpdateGroup = async (idGroup: number, data: GroupFormData) => {
    try {
      setFormLoading(true);
      const updated = await updateGroup(idGroup, {
        idGroup,
        ...data,
      });

      // Cargar información detallada del grupo actualizado
      const program = programs.find(p => p.idProgram === updated.idProgram);
      const tutorData = await loadTutorData(updated.idTutor);
      
      setGroups(prev =>
        prev.map(g =>
          g.idGroup === idGroup
            ? {
                ...updated,
                programName: program?.programName,
                programCode: program?.programCode,
                divisionName: program?.divisionName,
                tutorName: tutorData.name,
                tutorImage: tutorData.image,
              }
            : g
        )
      );

      setToast({
        title: "Grupo actualizado",
        description: "Los cambios se guardaron correctamente.",
        type: "success",
      });
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error al actualizar grupo:", err);
      setToast({
        title: "Error al actualizar grupo",
        description: err?.message || "No se pudieron aplicar los cambios.",
        type: "error",
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Cambiar estado (activar/desactivar)
  const handleToggleStatus = async (idGroup: number, currentStatus: boolean) => {
    try {
      const updated = await updateGroupStatus(idGroup, !currentStatus);

      setGroups(prev =>
        prev.map(g => (g.idGroup === idGroup ? { ...g, status: updated.status } : g))
      );

      setToast({
        title: updated.status ? "Grupo activado" : "Grupo desactivado",
        description: `El grupo fue ${
          updated.status ? "activado" : "desactivado"
        } correctamente.`,
        type: "success",
      });
    } catch (err: any) {
      console.error("Error al actualizar estado:", err);
      setToast({
        title: "Error al actualizar estado",
        description: err?.message || "No se pudo cambiar el estado del grupo.",
        type: "error",
      });
    }
  };

  // Guardar grupo (crear o actualizar)
  const handleSaveGroup = async (data: GroupFormData, idGroup?: number) => {
    if (idGroup) {
      await handleUpdateGroup(idGroup, data);
    } else {
      await handleCreateGroup(data);
    }
  };

  // Cambiar filtro de programa
  const handleProgramChange = (programId: number | "all") => {
    setSelectedProgram(programId);
    setCurrentPage(1);
  };

  // Cambiar filtro de semestre  
  const handleSemesterChange = (semester: string | "all") => {
    setSelectedSemester(semester);
    setCurrentPage(1);
  };

  // Abrir modal para editar
  const handleEdit = (group: GroupWithDetails) => {
    setSelectedGroup(group);
    setIsModalOpen(true);
  };

  // Abrir modal para crear
  const handleOpenAdd = () => {
    setSelectedGroup(null);
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
    groups: currentGroups,
    programs,
    divisions,
    tutors,
    filteredGroups,
    totalGroups: filteredGroups.length,
    uniqueSemesters,
    
    // Pagination
    currentPage,
    totalPages,
    setCurrentPage,
    
    // Filters
    searchTerm,
    selectedProgram,
    selectedSemester,
    setSearchTerm,
    handleProgramChange,
    handleSemesterChange,
    
    // Modal & Form
    isModalOpen,
    setIsModalOpen,
    selectedGroup,
    formLoading,
    
    // Actions
    handleSaveGroup,
    handleToggleStatus,
    handleEdit,
    handleOpenAdd,
    
    // State
    loading,
    toast,
    setToast,
    
    // User role info (for UI decisions)
    userRole: user?.role,
  };
}