"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getCoursesByUniversity,
  createCourse,
  updateCourse,
  updateCourseStatus,
  getModulesByCourse,
} from "@/services/course.service";
import { getDivisionsByUniversity } from "@/services/division.service";
import { UserRole } from "@/types/roles";
import type { CourseWithDetails, CourseFormData } from "@/types/course";
import type { Division } from "@/types/division";

/**
 * Hook personalizado para manejar cursos académicos:
 * - Carga con control de roles (ADMIN ve todos, COORDINATOR solo de su división)
 * - Búsqueda, paginación y filtrado por división/semestre
 * - Creación y edición de cursos
 * - Cambio de estado
 * - Manejo de modal y notificaciones
 * - Carga de información de divisiones y módulos
 */
export function useCourse() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseWithDetails[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivision, setSelectedDivision] = useState<number | "all">("all");
  const [selectedSemester, setSelectedSemester] = useState<string | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    type: "success" | "error";
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseWithDetails | null>(null);

  const coursesPerPage = 5;

  // Cargar datos iniciales
  useEffect(() => {
    if (!user?.idUniversity) return;

    const loadData = async () => {
      try {
        setLoading(true);
        
        // Cargar en paralelo cursos y divisiones
        const [coursesData, divisionsData] = await Promise.all([
          getCoursesByUniversity(user.idUniversity),
          getDivisionsByUniversity(user.idUniversity)
        ]);

        // Mapear cursos con información de división
        const coursesWithDetails = await Promise.all(
          coursesData.map(async (course) => {
            const division = divisionsData.find(d => d.idDivision === course.idDivision);
            
            // Cargar módulos para obtener el conteo
            let modulesCount = 0;
            try {
              const modules = await getModulesByCourse(course.idCourse);
              modulesCount = modules.length;
            } catch (error) {
              console.warn(`Error loading modules for course ${course.idCourse}:`, error);
            }

            return {
              ...course,
              divisionCode: division?.code || null,
              divisionName: division?.name || null,
              modulesCount,
            };
          })
        );

        // Filtrar cursos según el rol del usuario
        let availableCourses = coursesWithDetails;
        if (user.role === UserRole.COORDINATOR) {
          // Si es coordinador, solo mostrar cursos de divisiones que coordina
          const userDivisions = divisionsData.filter(d => d.idCoordinator === user.idUser);
          const divisionIds = userDivisions.map(d => d.idDivision);
          availableCourses = coursesWithDetails.filter(c => 
            c.idDivision && divisionIds.includes(c.idDivision)
          );
        }

        setCourses(availableCourses);
        setDivisions(divisionsData);
      } catch (err: any) {
        console.error("Error al cargar datos:", err);
        setToast({
          title: "Error de carga",
          description: err?.message || "No se pudieron cargar los cursos académicos.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.idUniversity, user?.idUser, user?.role]);

  // Filtrado y paginación
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.divisionName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.divisionCode?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDivision = selectedDivision === "all" || course.idDivision === selectedDivision;
    const matchesSemester = selectedSemester === "all" || course.semester === selectedSemester;
    
    return matchesSearch && matchesDivision && matchesSemester;
  });

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const currentCourses = filteredCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  // Get unique semesters for filter (only non-null values)
  const uniqueSemesters = [...new Set(
    courses
      .map(c => c.semester)
      .filter((semester): semester is string => semester !== null && semester !== undefined)
  )].sort();

  // Crear curso
  const handleCreateCourse = async (data: CourseFormData) => {
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
      const newCourse = await createCourse({
        ...data,
        idUniversity: user.idUniversity,
        status: true, // Nuevos cursos siempre activos
      });

      // Encontrar la división para agregar información completa
      const division = divisions.find(d => d.idDivision === newCourse.idDivision);
      const courseWithDetails: CourseWithDetails = {
        ...newCourse,
        divisionCode: division?.code || null,
        divisionName: division?.name || null,
        modulesCount: 0, // Nuevo curso sin módulos
        groupsCount: 0,
      };

      setCourses(prev => [...prev, courseWithDetails]);
      setToast({
        title: "Curso creado",
        description: "El nuevo curso académico se agregó exitosamente.",
        type: "success",
      });
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error creando curso:", err);
      setToast({
        title: "Error al crear curso",
        description: err?.message || "No se pudo registrar el nuevo curso académico.",
        type: "error",
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Actualizar curso
  const handleUpdateCourse = async (idCourse: number, data: CourseFormData) => {
    try {
      setFormLoading(true);
      const updated = await updateCourse(idCourse, {
        idCourse,
        ...data,
      });

      // Encontrar la división para agregar información completa
      const division = divisions.find(d => d.idDivision === updated.idDivision);
      
      setCourses(prev =>
        prev.map(c =>
          c.idCourse === idCourse
            ? {
                ...updated,
                divisionCode: division?.code || null,
                divisionName: division?.name || null,
                modulesCount: c.modulesCount, // Mantener conteo existente
                groupsCount: c.groupsCount,
              }
            : c
        )
      );

      setToast({
        title: "Curso actualizado",
        description: "Los cambios se guardaron correctamente.",
        type: "success",
      });
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error al actualizar curso:", err);
      setToast({
        title: "Error al actualizar curso",
        description: err?.message || "No se pudieron aplicar los cambios.",
        type: "error",
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Cambiar estado (activar/desactivar)
  const handleToggleStatus = async (idCourse: number, currentStatus: boolean) => {
    try {
      const updated = await updateCourseStatus(idCourse, !currentStatus);

      setCourses(prev =>
        prev.map(c => (c.idCourse === idCourse ? { ...c, status: updated.status } : c))
      );

      setToast({
        title: updated.status ? "Curso activado" : "Curso desactivado",
        description: `El curso fue ${
          updated.status ? "activado" : "desactivado"
        } correctamente.`,
        type: "success",
      });
    } catch (err: any) {
      console.error("Error al actualizar estado:", err);
      setToast({
        title: "Error al actualizar estado",
        description: err?.message || "No se pudo cambiar el estado del curso.",
        type: "error",
      });
    }
  };

  // Guardar curso (crear o actualizar)
  const handleSaveCourse = async (data: CourseFormData, idCourse?: number) => {
    if (idCourse) {
      await handleUpdateCourse(idCourse, data);
    } else {
      await handleCreateCourse(data);
    }
  };

  // Cambiar filtro de división
  const handleDivisionChange = (divisionId: number | "all") => {
    setSelectedDivision(divisionId);
    setCurrentPage(1);
  };

  // Cambiar filtro de semestre  
  const handleSemesterChange = (semester: string | "all") => {
    setSelectedSemester(semester);
    setCurrentPage(1);
  };

  // Abrir modal para editar
  const handleEdit = (course: CourseWithDetails) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  // Abrir modal para crear
  const handleOpenAdd = () => {
    setSelectedCourse(null);
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
    courses: currentCourses,
    divisions,
    filteredCourses,
    totalCourses: filteredCourses.length,
    uniqueSemesters,
    
    // Pagination
    currentPage,
    totalPages,
    setCurrentPage,
    
    // Filters
    searchTerm,
    selectedDivision,
    selectedSemester,
    setSearchTerm,
    handleDivisionChange,
    handleSemesterChange,
    
    // Modal & Form
    isModalOpen,
    setIsModalOpen,
    selectedCourse,
    formLoading,
    
    // Actions
    handleSaveCourse,
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