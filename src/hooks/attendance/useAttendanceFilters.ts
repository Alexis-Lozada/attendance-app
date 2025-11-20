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

import {
  getGroupsByTutor,
  GroupResponse
} from "@/services/group.service";

interface UseAttendanceFiltersResult {
  loading: boolean;
  error: string | null;

  groups: { label: string; value: string; puedePasarLista: boolean }[];
  courses: { label: string; value: string }[];

  selectedGroup: string | null;
  selectedCourse: string | null;

  setSelectedGroup: (g: string) => void;
  setSelectedCourse: (c: string | null) => void;
}

export function useAttendanceFilters(): UseAttendanceFiltersResult {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [groups, setGroups] = useState<
    { label: string; value: string; puedePasarLista: boolean }[]
  >([]);

  const [courses, setCourses] = useState<{ label: string; value: string }[]>([]);

  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  // ==============================
  //          LOAD DATA
  // ==============================
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        if (user.role === UserRole.TEACHER) {
          await loadTeacher();
        } else if (user.role === UserRole.TUTOR) {
          await loadTutor();
        } else if (user.role === UserRole.STUDENT) {
          await loadStudent();
        } else {
          throw new Error("No tienes permisos para esta pantalla.");
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error al cargar asistencia.");
      }

      setLoading(false);
    };

    load();
  }, [user]);

  // ==============================
  //        DINÁMICA: GRUPO CAMBIADO
  // ==============================
  useEffect(() => {
    if (!selectedGroup) return;

    const loadCourses = async () => {
      const groupObj = groups.find((g) => g.label === selectedGroup);
      if (!groupObj) return;

      // Si NO puede pasar lista, no cargar cursos
      if (!groupObj.puedePasarLista) {
        setCourses([]);
        setSelectedCourse(null);
        return;
      }

      // Si puede pasar lista, cargar cursos reales del grupo
      const list = await getGroupCoursesByGroup(Number(groupObj.value));

      const courseOptions = list.map((item) => ({
        label: item.courseName || "",
        value: String(item.idCourse)
      }));

      setCourses(courseOptions);
      setSelectedCourse(courseOptions[0]?.label || null);
    };

    loadCourses();
  }, [selectedGroup, groups]);

  // ==============================
  //            TEACHER
  // ==============================
  const loadTeacher = async () => {
    const list = await getGroupCoursesByProfessor(user!.idUser);

    const groupMap = new Map<
      string,
      { value: string; puedePasarLista: boolean }
    >();

    list.forEach((item) => {
      if (item.groupCode) {
        groupMap.set(item.groupCode, {
          value: String(item.idGroup),
          puedePasarLista: true
        });
      }
    });

    const groupOptions = Array.from(groupMap.entries()).map(
      ([label, obj]) => ({
        label,
        value: obj.value,
        puedePasarLista: obj.puedePasarLista
      })
    );

    setGroups(groupOptions);

    setSelectedGroup(groupOptions[0]?.label || null);
  };

  // ==============================
  //            TUTOR
  // ==============================
  const loadTutor = async () => {
    const tutorGroups = await getGroupsByTutor(user!.idUser);
    const professorGroups = await getGroupCoursesByProfessor(user!.idUser);

    const map = new Map<
      number,
      { label: string; value: string; puedePasarLista: boolean }
    >();

    tutorGroups.forEach((g) => {
      map.set(g.idGroup, {
        label: g.groupCode,
        value: String(g.idGroup),
        puedePasarLista: false
      });
    });

    professorGroups.forEach((gc) => {
      map.set(gc.idGroup, {
        label: gc.groupCode!,
        value: String(gc.idGroup),
        puedePasarLista: true
      });
    });

    const finalGroups = Array.from(map.values());

    setGroups(finalGroups);
    setSelectedGroup(finalGroups[0]?.label || null);
  };

  // ==============================
  //            STUDENT
  // ==============================
  const loadStudent = async () => {
    const enrollments = await getEnrollmentsByStudent(user!.idUser);
    const active = enrollments.find((e) => e.status === true);
    if (!active) throw new Error("No tienes grupo activo.");

    const groupCourses = await getGroupCoursesByGroup(active.idGroup);

    const groupOptions = [
      {
        label: active.groupCode,
        value: String(active.idGroup),
        puedePasarLista: true
      }
    ];

    const courseOptions = groupCourses.map((gc) => ({
      label: gc.courseName || "",
      value: String(gc.idCourse)
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
    setSelectedCourse
  };
}
