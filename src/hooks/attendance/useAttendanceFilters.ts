"use client";

import { useEffect, useState } from "react";
import { UserRole } from "@/types/roles";
import { useAuth } from "@/context/AuthContext";

// Servicios
import { 
  getGroupCoursesByProfessor, 
  getGroupCoursesByGroup,
  GroupCourseResponse
} from "@/services/groupCourse.service";

import { 
  getEnrollmentsByStudent, 
  EnrollmentResponse 
} from "@/services/enrollment.service";

interface UseAttendanceFiltersResult {
  loading: boolean;
  error: string | null;

  groups: { label: string; value: string }[];
  courses: { label: string; value: string }[];

  selectedGroup: string | null;
  selectedCourse: string | null;

  setSelectedGroup: (g: string) => void;
  setSelectedCourse: (c: string) => void;
}

export function useAttendanceFilters(): UseAttendanceFiltersResult {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [groups, setGroups] = useState<{ label: string; value: string }[]>([]);
  const [courses, setCourses] = useState<{ label: string; value: string }[]>([]);

  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  // ==============================
  //     CARGAR DATOS INICIALES
  // ==============================
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        if (user.role === UserRole.TEACHER || user.role === UserRole.TUTOR) {
          await loadTeacherOrTutor();
        } else if (user.role === UserRole.STUDENT) {
          await loadStudent();
        } else {
          throw new Error("El usuario no tiene permisos para esta pantalla");
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error al cargar datos de asistencia");
      }

      setLoading(false);
    };

    load();
  }, [user]);

  // ==============================
  //     TEACHER / TUTOR
  // ==============================
  const loadTeacherOrTutor = async () => {
    const list = await getGroupCoursesByProfessor(user!.idUser);

    // Grupos únicos
    const groupMap = new Map<string, string>();

    list.forEach((item) => {
      if (item.groupCode) groupMap.set(item.groupCode, String(item.idGroup));
    });

    const groupOptions = Array.from(groupMap.entries()).map(([label, value]) => ({
      label,
      value,
    }));

    // Cursos (NO agrupados por grupo)
    const courseOptions = list.map((item) => ({
      label: item.courseName || "",
      value: String(item.idCourse),
    }));

    setGroups(groupOptions);
    setCourses(courseOptions);

    setSelectedGroup(groupOptions[0]?.label || null);
    setSelectedCourse(courseOptions[0]?.label || null);
  };

  // ==============================
  //     STUDENT
  // ==============================
  const loadStudent = async () => {
    const enrollments: EnrollmentResponse[] = await getEnrollmentsByStudent(user!.idUser);

    const active = enrollments.find((e) => e.status === true);

    if (!active) throw new Error("El estudiante no tiene un grupo activo.");

    // Obtener cursos del grupo
    const groupCourses: GroupCourseResponse[] = await getGroupCoursesByGroup(active.idGroup);

    const groupOptions = [
      { label: active.groupCode, value: String(active.idGroup) }
    ];

    const courseOptions = groupCourses.map((item) => ({
      label: item.courseName || "",
      value: String(item.idCourse),
    }));

    setGroups(groupOptions);
    setCourses(courseOptions);

    setSelectedGroup(groupOptions[0].label);
    setSelectedCourse(courseOptions[0]?.label || null);
  };

  return {
    loading,
    error,
    groups,
    courses,
    selectedGroup,
    selectedCourse,
    setSelectedGroup,
    setSelectedCourse,
  };
}
