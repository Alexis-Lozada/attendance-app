"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getCoursesByUniversity,
  createCourse,
  updateCourse,
  updateCourseStatus,
} from "@/services/course.service";
import type { Course } from "@/types/course";

interface UseCoursesOptions {
  active?: boolean;
  semester?: string;
}

export function useCourses({ active, semester }: UseCoursesOptions = {}) {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchCourses() {
      if (!user?.idUniversity) {
        setError("No se encontró la universidad del usuario.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getCoursesByUniversity(user.idUniversity, active, semester);
        if (isMounted) setCourses(data);
      } catch (err: any) {
        console.error("Error al obtener cursos:", err);
        if (isMounted) setError("No se pudieron cargar los cursos académicos.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchCourses();
    return () => {
      isMounted = false;
    };
  }, [user?.idUniversity, active, semester]);

  // === Crear o editar curso ===
  const handleSaveCourse = async (
    formData: {
      idDivision?: number | null;
      courseCode: string;
      courseName: string;
      semester?: string | null;
    },
    idCourse?: number
  ) => {
    if (!user?.idUniversity) {
      setToast({
        title: "Error",
        description: "No se encontró la universidad del usuario.",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);
      if (idCourse) {
        // EDITAR
        const updated = await updateCourse(idCourse, {
          idUniversity: user.idUniversity,
          idDivision: formData.idDivision ?? null,
          courseCode: formData.courseCode,
          courseName: formData.courseName,
          semester: formData.semester ?? null,
          status: true,
        });
        setCourses((prev) =>
          prev.map((c) => (c.idCourse === idCourse ? { ...c, ...updated } : c))
        );
        setToast({
          title: "Curso actualizado",
          description: "Los datos del curso se modificaron correctamente.",
          type: "success",
        });
      } else {
        // CREAR
        const newCourse = await createCourse({
          idUniversity: user.idUniversity,
          idDivision: formData.idDivision ?? null,
          courseCode: formData.courseCode,
          courseName: formData.courseName,
          semester: formData.semester ?? null,
          status: true,
        });
        setCourses((prev) => [...prev, newCourse]);
        setToast({
          title: "Curso agregado",
          description: "El curso se registró correctamente.",
          type: "success",
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error al guardar curso:", err);
      setToast({
        title: "Error",
        description: err?.message || "No se pudo guardar el curso.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // === Cambiar estado (activar/desactivar) ===
  const handleToggleStatus = async (idCourse: number, currentStatus: boolean) => {
    try {
      await updateCourseStatus(idCourse, !currentStatus);
      setCourses((prev) =>
        prev.map((c) =>
          c.idCourse === idCourse ? { ...c, status: !currentStatus } : c
        )
      );
      setToast({
        title: !currentStatus ? "Curso activado" : "Curso desactivado",
        description: `El curso fue ${
          !currentStatus ? "activado" : "desactivado"
        } correctamente.`,
        type: "success",
      });
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      setToast({
        title: "Error",
        description: "No se pudo cambiar el estado del curso.",
        type: "error",
      });
    }
  };

  // === Auto ocultar Toast ===
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return {
    courses,
    loading,
    error,
    toast,
    isModalOpen,
    setIsModalOpen,
    setToast,
    setCourses,
    handleSaveCourse,
    handleToggleStatus,
  };
}
