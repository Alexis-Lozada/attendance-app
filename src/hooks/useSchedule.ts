"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import type { 
  ScheduleWithDetails, 
  ScheduleFormData,
  GroupCourse,
  Classroom 
} from "@/types/schedule";
import type { GroupWithDetails } from "@/types/group";

// Mock data
const MOCK_CLASSROOMS: Classroom[] = [
  { idClassroom: 1, roomCode: "A101", roomName: "Laboratorio 1", location: "Edificio A - Piso 1", status: true },
  { idClassroom: 2, roomCode: "A102", roomName: "Aula Magna", location: "Edificio A - Piso 1", status: true },
  { idClassroom: 3, roomCode: "B201", roomName: "Sala de Cómputo", location: "Edificio B - Piso 2", status: true },
  { idClassroom: 4, roomCode: "C301", roomName: "Auditorio", location: "Edificio C - Piso 3", status: true },
];

const MOCK_GROUP_COURSES: GroupCourse[] = [
  { idGroupCourse: 1, idGroup: 1, idCourse: 1, idProfessor: 1, groupCode: "IDGS10-A", courseCode: "BD101", courseName: "Bases de Datos", professorName: "Dr. Juan Pérez", semester: "10", programName: "Ingeniería en Desarrollo de Software" },
  { idGroupCourse: 2, idGroup: 1, idCourse: 2, idProfessor: 2, groupCode: "IDGS10-A", courseCode: "WEB201", courseName: "Desarrollo Web", professorName: "Ing. María García", semester: "10", programName: "Ingeniería en Desarrollo de Software" },
  { idGroupCourse: 3, idGroup: 2, idCourse: 3, idProfessor: 3, groupCode: "ISC08-B", courseCode: "ALG301", courseName: "Algoritmos Avanzados", professorName: "Mtro. Carlos López", semester: "8", programName: "Ingeniería en Sistemas Computacionales" },
];

const MOCK_SCHEDULES: ScheduleWithDetails[] = [
  { idSchedule: 1, idClassroom: 1, idGroupCourse: 1, dayOfWeek: "MONDAY", startTime: "08:00", endTime: "10:00", classroomCode: "A101", classroomName: "Laboratorio 1", groupCode: "IDGS10-A", courseCode: "BD101", courseName: "Bases de Datos", professorName: "Dr. Juan Pérez", programName: "Ingeniería en Desarrollo de Software" },
  { idSchedule: 2, idClassroom: 2, idGroupCourse: 2, dayOfWeek: "TUESDAY", startTime: "10:00", endTime: "12:00", classroomCode: "A102", classroomName: "Aula Magna", groupCode: "IDGS10-A", courseCode: "WEB201", courseName: "Desarrollo Web", professorName: "Ing. María García", programName: "Ingeniería en Desarrollo de Software" },
  { idSchedule: 3, idClassroom: 3, idGroupCourse: 3, dayOfWeek: "WEDNESDAY", startTime: "14:00", endTime: "16:00", classroomCode: "B201", classroomName: "Sala de Cómputo", groupCode: "ISC08-B", courseCode: "ALG301", courseName: "Algoritmos Avanzados", professorName: "Mtro. Carlos López", programName: "Ingeniería en Sistemas Computacionales" },
];

const MOCK_GROUPS: GroupWithDetails[] = [
  { idGroup: 1, idProgram: 1, idTutor: 1, groupCode: "IDGS10-A", semester: "10", academicYear: "2024-2025", enrollmentCount: 25, status: true, programName: "Ingeniería en Desarrollo de Software", programCode: "IDGS" },
  { idGroup: 2, idProgram: 2, idTutor: 2, groupCode: "ISC08-B", semester: "8", academicYear: "2024-2025", enrollmentCount: 30, status: true, programName: "Ingeniería en Sistemas Computacionales", programCode: "ISC" },
];

/**
 * Hook for managing academic schedules:
 * - Load schedules, group courses, classrooms, and groups
 * - Search, pagination, and filtering
 * - Create, edit, and delete schedules
 * - Handle modals and notifications
 * - Validate schedule conflicts
 */
export function useSchedule() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<ScheduleWithDetails[]>([]);
  const [groupCourses, setGroupCourses] = useState<GroupCourse[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [groups, setGroups] = useState<GroupWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<number | "all">("all");
  const [selectedDay, setSelectedDay] = useState<string | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    type: "success" | "error";
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleWithDetails | null>(null);

  const schedulesPerPage = 10;

  // Load initial data with mock data
  useEffect(() => {
    if (!user?.idUniversity) return;

    const loadData = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        setSchedules(MOCK_SCHEDULES);
        setGroupCourses(MOCK_GROUP_COURSES);
        setClassrooms(MOCK_CLASSROOMS);
        setGroups(MOCK_GROUPS);
      } catch (err: any) {
        console.error("Error loading data:", err);
        setToast({
          title: "Error de carga",
          description: err?.message || "No se pudieron cargar los horarios.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.idUniversity]);

  // Filtering and pagination
  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = 
      schedule.classroomCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.classroomName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.groupCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.courseCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.professorName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGroup = selectedGroup === "all" || 
      groupCourses.find(gc => 
        gc.idGroupCourse === schedule.idGroupCourse && 
        gc.idGroup === selectedGroup
      );
    
    const matchesDay = selectedDay === "all" || schedule.dayOfWeek === selectedDay;
    
    return matchesSearch && matchesGroup && matchesDay;
  });

  const totalPages = Math.ceil(filteredSchedules.length / schedulesPerPage);
  const currentSchedules = filteredSchedules.slice(
    (currentPage - 1) * schedulesPerPage,
    currentPage * schedulesPerPage
  );

  // Get unique days for filter
  const uniqueDays = [...new Set(schedules.map(s => s.dayOfWeek))].sort();

  // Validate schedule conflicts
  const validateSchedule = (formData: ScheduleFormData, excludeId?: number): string | null => {
    const conflicts = schedules.filter(s => {
      // Skip the schedule being edited
      if (excludeId && s.idSchedule === excludeId) return false;
      
      // Check same day and classroom
      if (s.dayOfWeek !== formData.dayOfWeek || s.idClassroom !== formData.idClassroom) {
        return false;
      }

      // Check time overlap
      const existingStart = s.startTime;
      const existingEnd = s.endTime;
      const newStart = formData.startTime;
      const newEnd = formData.endTime;

      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });

    if (conflicts.length > 0) {
      const conflict = conflicts[0];
      return `Conflicto: El aula ${conflict.classroomCode} ya está ocupada de ${conflict.startTime} a ${conflict.endTime}`;
    }

    return null;
  };

  // Create schedule
  const handleCreateSchedule = async (data: ScheduleFormData) => {
    try {
      setFormLoading(true);

      // Validate conflicts
      const conflictError = validateSchedule(data);
      if (conflictError) {
        setToast({
          title: "Conflicto de horario",
          description: conflictError,
          type: "error",
        });
        return;
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create new schedule with mock ID
      const newId = Math.max(...schedules.map(s => s.idSchedule), 0) + 1;
      const groupCourse = groupCourses.find(gc => gc.idGroupCourse === data.idGroupCourse);
      const classroom = classrooms.find(c => c.idClassroom === data.idClassroom);

      const scheduleWithDetails: ScheduleWithDetails = {
        idSchedule: newId,
        ...data,
        classroomCode: classroom?.roomCode,
        classroomName: classroom?.roomName,
        groupCode: groupCourse?.groupCode,
        courseCode: groupCourse?.courseCode,
        courseName: groupCourse?.courseName,
        professorName: groupCourse?.professorName,
        programName: groupCourse?.programName,
      };

      setSchedules(prev => [...prev, scheduleWithDetails]);
      setToast({
        title: "Horario creado",
        description: "El horario se agregó exitosamente.",
        type: "success",
      });
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error creating schedule:", err);
      setToast({
        title: "Error al crear horario",
        description: err?.message || "No se pudo registrar el horario.",
        type: "error",
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Update schedule
  const handleUpdateSchedule = async (idSchedule: number, data: ScheduleFormData) => {
    try {
      setFormLoading(true);

      // Validate conflicts (excluding current schedule)
      const conflictError = validateSchedule(data, idSchedule);
      if (conflictError) {
        setToast({
          title: "Conflicto de horario",
          description: conflictError,
          type: "error",
        });
        return;
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const groupCourse = groupCourses.find(gc => gc.idGroupCourse === data.idGroupCourse);
      const classroom = classrooms.find(c => c.idClassroom === data.idClassroom);

      setSchedules(prev =>
        prev.map(s =>
          s.idSchedule === idSchedule
            ? {
                ...s,
                ...data,
                classroomCode: classroom?.roomCode,
                classroomName: classroom?.roomName,
                groupCode: groupCourse?.groupCode,
                courseCode: groupCourse?.courseCode,
                courseName: groupCourse?.courseName,
                professorName: groupCourse?.professorName,
                programName: groupCourse?.programName,
              }
            : s
        )
      );

      setToast({
        title: "Horario actualizado",
        description: "Los cambios se guardaron correctamente.",
        type: "success",
      });
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error updating schedule:", err);
      setToast({
        title: "Error al actualizar horario",
        description: err?.message || "No se pudieron aplicar los cambios.",
        type: "error",
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Delete schedule
  const handleDeleteSchedule = async (idSchedule: number) => {
    if (!confirm("¿Estás seguro de eliminar este horario? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setSchedules(prev => prev.filter(s => s.idSchedule !== idSchedule));
      setToast({
        title: "Horario eliminado",
        description: "El horario fue eliminado correctamente.",
        type: "success",
      });
    } catch (err: any) {
      console.error("Error deleting schedule:", err);
      setToast({
        title: "Error al eliminar horario",
        description: err?.message || "No se pudo eliminar el horario.",
        type: "error",
      });
    }
  };

  // Save schedule (create or update)
  const handleSaveSchedule = async (data: ScheduleFormData, idSchedule?: number) => {
    if (idSchedule) {
      await handleUpdateSchedule(idSchedule, data);
    } else {
      await handleCreateSchedule(data);
    }
  };

  // Change group filter
  const handleGroupChange = (groupId: number | "all") => {
    setSelectedGroup(groupId);
    setCurrentPage(1);
  };

  // Change day filter
  const handleDayChange = (day: string | "all") => {
    setSelectedDay(day);
    setCurrentPage(1);
  };

  // Open modal for edit
  const handleEdit = (schedule: ScheduleWithDetails) => {
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  // Open modal for create
  const handleOpenAdd = () => {
    setSelectedSchedule(null);
    setIsModalOpen(true);
  };

  // Auto-hide toast after 4s
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return {
    // Data
    schedules: currentSchedules,
    groupCourses,
    classrooms,
    groups,
    filteredSchedules,
    totalSchedules: filteredSchedules.length,
    uniqueDays,
    
    // Pagination
    currentPage,
    totalPages,
    setCurrentPage,
    
    // Filters
    searchTerm,
    selectedGroup,
    selectedDay,
    setSearchTerm,
    handleGroupChange,
    handleDayChange,
    
    // Modal & Form
    isModalOpen,
    setIsModalOpen,
    selectedSchedule,
    formLoading,
    
    // Actions
    handleSaveSchedule,
    handleDeleteSchedule,
    handleEdit,
    handleOpenAdd,
    
    // State
    loading,
    toast,
    setToast,
  };
}