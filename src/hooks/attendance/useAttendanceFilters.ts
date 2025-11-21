"use client";

import { useEffect, useState } from "react";
import { UserRole } from "@/types/roles";
import { useAuth } from "@/context/AuthContext";

// Servicios
import {
  getGroupCoursesByProfessor,
  getGroupCoursesByGroup,
} from "@/services/groupCourse.service";

import {
  getEnrollmentsByStudent,
} from "@/services/enrollment.service";

import {
  getGroupsByTutor,
} from "@/services/group.service";

interface GroupItem {
  label: string;   // código del grupo (ej: "TI-801")
  value: string;   // idGroup
  puedePasarLista: boolean;
  esTutor: boolean;
}

interface UseAttendanceFiltersResult {
  loading: boolean;
  error: string | null;

  groups: GroupItem[];
  courses: { label: string; value: string }[];

  selectedGroup: string | null;   // idGroup
  selectedCourse: string | null;  // idGroupCourse

  setSelectedGroup: (g: string) => void;
  setSelectedCourse: (c: string | null) => void;
}

export function useAttendanceFilters(): UseAttendanceFiltersResult {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [courses, setCourses] = useState<{ label: string; value: string }[]>([]);

  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);   // idGroup
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null); // idGroupCourse

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ==============================
  //   GRUPO CAMBIADO → CARGAR CURSOS
  // ==============================
  useEffect(() => {
    if (!selectedGroup) return;

    const loadCourses = async () => {
      // 👇 ahora buscamos por value (idGroup), no por label
      const groupObj = groups.find((g) => g.value === selectedGroup);
      if (!groupObj) return;

      if (!groupObj.puedePasarLista) {
        setCourses([]);
        setSelectedCourse(null);
        return;
      }

      const list = await getGroupCoursesByGroup(Number(groupObj.value));

      // value = idGroupCourse (NO idCourse)
      const options = list.map((c) => ({
        label: c.courseName || "",
        value: String(c.idGroupCourse),
      }));

      setCourses(options);
      setSelectedCourse(options[0]?.value || null); // idGroupCourse
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
        label: gc.groupCode!,          // código grupo
        value: String(gc.idGroup),     // idGroup
        puedePasarLista: true,
        esTutor: false,
      });
    });

    const finalGroups = Array.from(map.values());
    setGroups(finalGroups);
    // 👇 seleccionamos por value (idGroup)
    setSelectedGroup(finalGroups[0]?.value || null);
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
        label: g.groupCode,           // código
        value: String(g.idGroup),     // idGroup
        puedePasarLista: false,
        esTutor: true,
      });
    });

    // grupos profesor
    profGroups.forEach((gc) => {
      map.set(gc.idGroup, {
        label: gc.groupCode!,         // código
        value: String(gc.idGroup),    // idGroup
        puedePasarLista: true,
        esTutor: map.get(gc.idGroup)?.esTutor ?? false,
      });
    });

    const finalGroups = Array.from(map.values());
    setGroups(finalGroups);
    // 👇 otra vez: guardar idGroup
    setSelectedGroup(finalGroups[0]?.value || null);
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
      label: active.groupCode,         // código grupo
      value: String(active.idGroup),   // idGroup
      puedePasarLista: true,
      esTutor: false,
    };

    setGroups([groupItem]);

    const options = courses.map((c) => ({
      label: c.courseName || "",
      value: String(c.idGroupCourse),  // idGroupCourse
    }));

    setCourses(options);
    setSelectedGroup(String(active.idGroup));    // 👈 idGroup, NO el código
    setSelectedCourse(options[0]?.value || null); // idGroupCourse
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
