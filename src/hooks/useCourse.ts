"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getCoursesByUniversity,
  createCourse,
  updateCourse,
  updateCourseStatus,
} from "@/services/course.service";
import { getDivisionById } from "@/services/division.service";
import type { Course } from "@/types/course";

/**
 * Hook personalizado para manejar cursos académicos:
 * - Carga, búsqueda, paginación
 * - Creación y edición
 * - Cambio de estado
 * - Manejo de modal y notificaciones
 * - Carga de datos de la división
 */
export function useCourse() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [semesterFilter, setSemesterFilter] = useState<string>("");
  const [divisionFilter, setDivisionFilter] = useState<string>("");
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    type: "success" | "error";
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const coursesPerPage = 5;

  // 🔹 Helper function to load division data
  const loadDivisionData = async (idDivision?: number | null) => {
    if (!idDivision) return { code: "GENERAL", name: "Curso General" };
    
    try {
      const division = await getDivisionById(idDivision);
      return { code: division.code, name: division.name };
    } catch (error) {
      console.error("Error loading division data:", error);
      return { code: "ERROR", name: "Error al cargar" };
    }
  };

  // 🔹 Cargar cursos con datos de la división
  useEffect(() => {
    if (!user?.idUniversity) return;

    const load = async () => {
      try {
        setLoading(true);
        const data = await getCoursesByUniversity(user.idUniversity);
        
        // Load division data for each course
        const mapped = await Promise.all(
          data.map(async (c) => {
            const divisionData = await loadDivisionData(c.idDivision);
            return {
              idCourse: c.idCourse,
              idUniversity: c.idUniversity,
              idDivision: c.idDivision,
              divisionCode: divisionData.code,
              divisionName: divisionData.name,
              courseCode: c.courseCode,
              courseName: c.courseName,
              semester: c.semester,
              status: c.status,
              modulesCount: c.modulesCount || 0,
              groupsCount: c.groupsCount || 0,
            };
          })
        );
        
        setCourses(mapped);
      } catch (err: any) {
        console.error("Error al cargar cursos:", err);
        setToast({
          title: "Error al cargar cursos",
          description: err?.message || "No se pudieron cargar los cursos.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.idUniversity]);

  // 🔹 Crear curso
  const handleSaveCourse = async (data: Omit<Course, "idCourse">) => {
    if (!user?.idUniversity) {
      setToast({
        title: "Error",
        description: "No se pudo determinar la universidad del usuario.",
        type: "error",
      });
      return;
    }

    try {
      const newCourse = await createCourse({
        idUniversity: user.idUniversity,
        idDivision: data.idDivision,
        courseCode: data.courseCode,
        courseName: data.courseName,
        semester: data.semester,
        status: true, // ✅ activo por defecto
      });

      // Load division data for the new course
      const divisionData = await loadDivisionData(newCourse.idDivision);

      setCourses((prev) => [
        ...prev,
        {
          idCourse: newCourse.idCourse,
          idUniversity: newCourse.idUniversity,
          idDivision: newCourse.idDivision,
          divisionCode: divisionData.code,
          divisionName: divisionData.name,
          courseCode: newCourse.courseCode,
          courseName: newCourse.courseName,
          semester: newCourse.semester,
          status: newCourse.status,
          modulesCount: 0,
          groupsCount: 0,
        },
      ]);

      setToast({
        title: "Curso creado correctamente",
        description: "El nuevo curso se agregó exitosamente.",
        type: "success",
      });

      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error creando curso:", err);
      setToast({
        title: "Error al crear el curso",
        description: err?.message || "No se pudo registrar el nuevo curso.",
        type: "error",
      });
    }
  };

  // 🔹 Editar curso
  const handleUpdateCourse = async (id: number, data: Omit<Course, "idCourse">) => {
    try {
      const updated = await updateCourse(id, {
        idCourse: id,
        idUniversity: data.idUniversity,
        idDivision: data.idDivision,
        courseCode: data.courseCode,
        courseName: data.courseName,
        semester: data.semester,
        status: data.status,
      });
      
      // Load division data for the updated course
      const divisionData = await loadDivisionData(updated.idDivision);

      setCourses((prev) =>
        prev.map((c) =>
          c.idCourse === id
            ? {
                ...c,
                idDivision: updated.idDivision,
                divisionCode: divisionData.code,
                divisionName: divisionData.name,
                courseCode: updated.courseCode,
                courseName: updated.courseName,
                semester: updated.semester,
                status: updated.status,
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
    }
  };

  // 🔹 Cambiar estado (activar/desactivar)
  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const updated = await updateCourseStatus(id, !currentStatus);

      setCourses((prev) =>
        prev.map((c) => (c.idCourse === id ? { ...c, status: updated.status } : c))
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

  // 🔹 Filtrado y paginación
  const filtered = courses.filter((c) => {
    const matchesSearch = 
      c.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.divisionName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.divisionCode?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSemester = !semesterFilter || 
      (semesterFilter === "general" ? !c.semester : c.semester === semesterFilter);

    const matchesDivision = !divisionFilter || 
      (divisionFilter === "general" ? !c.idDivision : c.divisionCode === divisionFilter);

    return matchesSearch && matchesSemester && matchesDivision;
  });

  const totalPages = Math.ceil(filtered.length / coursesPerPage);
  const current = filtered.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  // 🔹 Obtener valores únicos para filtros
  const availableSemesters = Array.from(
    new Set(courses.map(c => c.semester).filter(Boolean))
  ).sort();

  const availableDivisions = Array.from(
    new Set(courses.map(c => c.divisionCode).filter(Boolean))
  ).sort();

  // 🔹 Ocultar toast automáticamente después de 4s
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return {
    loading,
    courses: current,
    totalCourses: filtered.length,
    totalPages,
    currentPage,
    toast,
    isModalOpen,
    semesterFilter,
    divisionFilter,
    availableSemesters,
    availableDivisions,
    setToast,
    setIsModalOpen,
    setSearchTerm,
    setCurrentPage,
    setSemesterFilter,
    setDivisionFilter,
    handleSaveCourse,
    handleUpdateCourse,
    handleToggleStatus,
  };
}