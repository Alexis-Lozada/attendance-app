"use client";

import { useEffect, useState } from "react";
import { UserRole } from "@/types/roles";
import { useAuth } from "@/context/AuthContext";

// Servicios
import {
  getGroupCoursesByProfessor,
  getGroupCoursesByGroup,
  GroupCourseResponse,
} from "@/services/groupCourse.service";

import {
  getEnrollmentsByStudent,
} from "@/services/enrollment.service";

import {
  getGroupsByTutor,
} from "@/services/group.service";

import {
  getModulesByCourse,
  CourseModuleResponse,
} from "@/services/courseModule.service";

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

  // módulos para el selector
  modules: { label: string; value: string; subtitle?: string }[];
  modulesMeta: CourseModuleResponse[];

  selectedGroup: string | null;    // idGroup
  selectedCourse: string | null;   // idGroupCourse
  selectedModule: string | null;   // idModule

  setSelectedGroup: (g: string) => void;
  setSelectedCourse: (c: string | null) => void;
  setSelectedModule: (m: string | null) => void;
}

export function useAttendanceFilters(): UseAttendanceFiltersResult {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [courses, setCourses] = useState<{ label: string; value: string }[]>([]);

  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);    // idGroup
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);  // idGroupCourse
  const [selectedModule, setSelectedModule] = useState<string | null>(null);  // idModule

  // === Módulos ===
  const [modules, setModules] = useState<{ label: string; value: string; subtitle?: string }[]>([]);
  const [modulesMeta, setModulesMeta] = useState<CourseModuleResponse[]>([]);

  // GroupCourses actuales del grupo seleccionado
  const [currentGroupCourses, setCurrentGroupCourses] = useState<GroupCourseResponse[]>([]);

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
      // buscamos por value (idGroup)
      const groupObj = groups.find((g) => g.value === selectedGroup);
      if (!groupObj) return;

      // reset de cursos y módulos al cambiar de grupo
      setCourses([]);
      setSelectedCourse(null);
      setModules([]);
      setModulesMeta([]);
      setSelectedModule(null);
      setCurrentGroupCourses([]);

      if (!groupObj.puedePasarLista) {
        return;
      }

      const list = await getGroupCoursesByGroup(Number(groupObj.value));

      setCurrentGroupCourses(list);

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
  //   CURSO CAMBIADO → CARGAR MÓDULOS
  // ==============================
  useEffect(() => {
    // reset módulos al cambiar de curso
    setModules([]);
    setModulesMeta([]);
    setSelectedModule(null);

    if (!selectedCourse) return;

    // buscar el GroupCourse para saber idCourse
    const gc = currentGroupCourses.find(
      (g) => g.idGroupCourse === Number(selectedCourse)
    );
    if (!gc) return;

    const loadModules = async () => {
      const list = await getModulesByCourse(gc.idCourse);

      setModulesMeta(list);

      if (!list.length) {
        return;
      }

      const moduleOptions = list.map((m) => ({
        label: `Módulo ${m.moduleNumber}`,
        value: String(m.idModule),
        subtitle: m.title,
      }));

      setModules(moduleOptions);

      // seleccionar automáticamente el módulo cuya fecha contenga "hoy" (si existe)
      const today = new Date();
      const todayStr = today.toISOString().slice(0, 10); // YYYY-MM-DD
      const todayDate = new Date(todayStr + "T00:00:00");

      let defaultModule: CourseModuleResponse | undefined = list.find((m) => {
        if (!m.startDate || !m.endDate) return false;
        const start = new Date(m.startDate + "T00:00:00");
        const end = new Date(m.endDate + "T23:59:59");
        return todayDate >= start && todayDate <= end;
      });

      if (!defaultModule) {
        defaultModule = list[0];
      }

      if (defaultModule) {
        setSelectedModule(String(defaultModule.idModule));
      }
    };

    loadModules();
  }, [selectedCourse, currentGroupCourses]);

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
    // guardamos idGroup como seleccionado
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
    setSelectedGroup(finalGroups[0]?.value || null); // idGroup
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
    setSelectedGroup(String(active.idGroup));       // idGroup
    setSelectedCourse(options[0]?.value || null);   // idGroupCourse

    // también cargamos currentGroupCourses para poder obtener idCourse
    setCurrentGroupCourses(courses);
  };

  return {
    loading,
    error,
    groups,
    courses,
    modules,
    modulesMeta,
    selectedGroup,
    selectedCourse,
    selectedModule,
    setSelectedGroup,
    setSelectedCourse,
    setSelectedModule,
  };
}
