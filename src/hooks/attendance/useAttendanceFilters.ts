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

interface GroupItem {
  label: string;
  value: string;
  puedePasarLista: boolean;
  esTutor: boolean;
}

interface UseAttendanceFiltersResult {
  loading: boolean;
  error: string | null;

  groups: GroupItem[];
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

  const [groups, setGroups] = useState<GroupItem[]>([]);
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
        if (user.role === UserRole.TEACHER) await loadTeacher();
        else if (user.role === UserRole.TUTOR) await loadTutor();
        else if (user.role === UserRole.STUDENT) await loadStudent();
        else throw new Error("No tienes permisos para ver esta pantalla.");
      } catch (err: any) {
        setError(err.message);
      }

      setLoading(false);
    };

    load();
  }, [user]);

  // ==============================
  //     GRUPO CAMBIADO → CARGAR CURSOS
  // ==============================
  useEffect(() => {
    if (!selectedGroup) return;

    const loadCourses = async () => {
      const groupObj = groups.find((g) => g.label === selectedGroup);
      if (!groupObj) return;

      if (!groupObj.puedePasarLista) {
        setCourses([]);
        setSelectedCourse(null);
        return;
      }

      const list = await getGroupCoursesByGroup(Number(groupObj.value));
      const options = list.map((c) => ({
        label: c.courseName || "",
        value: String(c.idCourse)
      }));

      setCourses(options);
      setSelectedCourse(options[0]?.label || null);
    };

    loadCourses();
  }, [selectedGroup, groups]);

  // ==============================
  //            TEACHER
  // ==============================
  const loadTeacher = async () => {
    const list = await getGroupCoursesByProfessor(user!.idUser);

    const map = new Map<string, GroupItem>();

    list.forEach((gc) => {
      map.set(gc.groupCode!, {
        label: gc.groupCode!,
        value: String(gc.idGroup),
        puedePasarLista: true,
        esTutor: false
      });
    });

    const finalGroups = Array.from(map.values());
    setGroups(finalGroups);
    setSelectedGroup(finalGroups[0]?.label || null);
  };

  // ==============================
  //            TUTOR
  // ==============================
  const loadTutor = async () => {
    const tutorGroups = await getGroupsByTutor(user!.idUser);
    const profGroups = await getGroupCoursesByProfessor(user!.idUser);

    const map = new Map<number, GroupItem>();

    // grupos tutorados
    tutorGroups.forEach((g) => {
      map.set(g.idGroup, {
        label: g.groupCode,
        value: String(g.idGroup),
        puedePasarLista: false,
        esTutor: true
      });
    });

    // grupos profesor
    profGroups.forEach((gc) => {
      map.set(gc.idGroup, {
        label: gc.groupCode!,
        value: String(gc.idGroup),
        puedePasarLista: true,
        esTutor: map.get(gc.idGroup)?.esTutor ?? false // si ya era tutor → conservarlo
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

    const courses = await getGroupCoursesByGroup(active.idGroup);

    const groupItem: GroupItem = {
      label: active.groupCode,
      value: String(active.idGroup),
      puedePasarLista: true,
      esTutor: false
    };

    setGroups([groupItem]);

    const options = courses.map((c) => ({
      label: c.courseName || "",
      value: String(c.idCourse)
    }));

    setCourses(options);
    setSelectedGroup(active.groupCode);
    setSelectedCourse(options[0]?.label || null);
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
