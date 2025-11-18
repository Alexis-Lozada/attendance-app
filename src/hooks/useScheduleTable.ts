"use client";

import { useState } from "react";
import type { GroupCourse, Classroom } from "@/types/schedule";

interface ScheduleBlock {
  id: string;
  idGroupCourse: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  idClassroom: number;
  idProfessor?: number;
  courseCode?: string;
  courseName?: string;
  professorName?: string;
  classroomCode?: string;
}

interface UseScheduleTableProps {
  classrooms: Classroom[];
  professors: Array<{ idUser: number; firstName: string; lastName: string }>;
  onToast: (toast: { title: string; description?: string; type: "success" | "error" }) => void;
}

interface CourseAssignment {
  idProfessor: number;
  professorName: string;
  classroomCode: string;
}

export function useScheduleTable({ classrooms, professors, onToast }: UseScheduleTableProps) {
  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlock[]>([]);
  const [draggedCourse, setDraggedCourse] = useState<GroupCourse | null>(null);
  const [draggedBlock, setDraggedBlock] = useState<ScheduleBlock | null>(null);
  const [dropSuccessful, setDropSuccessful] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [newBlockPending, setNewBlockPending] = useState(false);
  // Almacena la asignación de profesor y aula por idCourse
  const [courseAssignments, setCourseAssignments] = useState<Record<number, CourseAssignment>>({});

  const handleDragStart = (e: React.DragEvent, course: GroupCourse) => {
    setDraggedCourse(course);
    setDraggedBlock(null);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleBlockDragStart = (e: React.DragEvent, block: ScheduleBlock) => {
    setDraggedBlock(block);
    setDraggedCourse(null);
    e.dataTransfer.effectAllowed = 'move';
    
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '1';
    
    if (draggedBlock && !dropSuccessful) {
      setScheduleBlocks(prev => prev.filter(b => b.id !== draggedBlock.id));
      onToast({
        title: "Clase eliminada",
        description: "El curso fue removido del horario",
        type: "success",
      });
    }
    
    setDraggedBlock(null);
    setDraggedCourse(null);
    setDropSuccessful(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const calculateEndTime = (startTime: string, hours: number): string => {
    const [h, m] = startTime.split(":").map(Number);
    const totalMinutes = h * 60 + m + (hours * 60);
    const endH = Math.floor(totalMinutes / 60);
    const endM = totalMinutes % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  };

  const handleDrop = (e: React.DragEvent, day: string, time: string, timeSlots: string[]) => {
    e.preventDefault();
    
    if (draggedBlock) {
      const startIdx = timeSlots.indexOf(draggedBlock.startTime);
      const endIdx = timeSlots.indexOf(draggedBlock.endTime);
      const duration = endIdx - startIdx;
      
      const newEndTime = calculateEndTime(time, duration);

      const hasConflict = scheduleBlocks.some(block => {
        if (block.id === draggedBlock.id || block.dayOfWeek !== day) return false;
        
        return (
          (time >= block.startTime && time < block.endTime) ||
          (newEndTime > block.startTime && newEndTime <= block.endTime) ||
          (time <= block.startTime && newEndTime >= block.endTime)
        );
      });

      if (hasConflict) {
        onToast({
          title: "Conflicto de horario",
          description: "Ya existe otra clase en este horario",
          type: "error",
        });
        setDraggedBlock(null);
        return;
      }

      setScheduleBlocks(prev => prev.map(b => 
        b.id === draggedBlock.id 
          ? { ...b, dayOfWeek: day, startTime: time, endTime: newEndTime }
          : b
      ));

      setDropSuccessful(true);
      setDraggedBlock(null);
      onToast({
        title: "Clase movida",
        description: `${draggedBlock.courseCode} movido exitosamente`,
        type: "success",
      });
      return;
    }

    if (!draggedCourse) return;

    const adjacentBlock = scheduleBlocks.find(block => 
      block.dayOfWeek === day &&
      block.idGroupCourse === draggedCourse.idGroupCourse &&
      (block.endTime === time || block.startTime === calculateEndTime(time, 1))
    );

    if (adjacentBlock) {
      const newStartTime = adjacentBlock.startTime < time ? adjacentBlock.startTime : time;
      const newEndTime = adjacentBlock.endTime > calculateEndTime(time, 1) ? adjacentBlock.endTime : calculateEndTime(time, 1);

      const hasConflict = scheduleBlocks.some(block => {
        if (block.id === adjacentBlock.id || block.dayOfWeek !== day) return false;
        
        return (
          (newStartTime >= block.startTime && newStartTime < block.endTime) ||
          (newEndTime > block.startTime && newEndTime <= block.endTime) ||
          (newStartTime <= block.startTime && newEndTime >= block.endTime)
        );
      });

      if (hasConflict) {
        onToast({
          title: "Conflicto de horario",
          description: "No se puede extender, hay otra clase en el camino",
          type: "error",
        });
        return;
      }

      setScheduleBlocks(prev => prev.map(b => 
        b.id === adjacentBlock.id 
          ? { ...b, startTime: newStartTime, endTime: newEndTime }
          : b
      ));

      setDraggedCourse(null);
      onToast({
        title: "Clase extendida",
        description: `${draggedCourse.courseCode} ahora ocupa ${calculateDurationHours(newStartTime, newEndTime)}h`,
        type: "success",
      });
      return;
    }

    const endTime = calculateEndTime(time, 1);

    const hasConflict = scheduleBlocks.some(block => {
      if (block.dayOfWeek !== day) return false;
      
      return (
        (time >= block.startTime && time < block.endTime) ||
        (endTime > block.startTime && endTime <= block.endTime) ||
        (time <= block.startTime && endTime >= block.endTime)
      );
    });

    if (hasConflict) {
      onToast({
        title: "Conflicto de horario",
        description: "Ya existe una clase en este horario",
        type: "error",
      });
      return;
    }

    // Verificar si el curso ya tiene asignación previa
    const existingAssignment = courseAssignments[draggedCourse.idCourse];
    
    const newBlockId = `${Date.now()}-${Math.random()}`;
    const newBlock: ScheduleBlock = {
      id: newBlockId,
      idGroupCourse: draggedCourse.idGroupCourse,
      dayOfWeek: day,
      startTime: time,
      endTime: endTime,
      idClassroom: 0,
      idProfessor: existingAssignment?.idProfessor || 0,
      courseCode: draggedCourse.courseCode,
      courseName: draggedCourse.courseName,
      professorName: existingAssignment?.professorName || "",
      classroomCode: existingAssignment?.classroomCode || "",
    };

    setScheduleBlocks(prev => [...prev, newBlock]);
    setDraggedCourse(null);

    if (existingAssignment) {
      // Si ya existe asignación, no entrar en modo edición
      onToast({
        title: "Clase agregada",
        description: `${draggedCourse.courseCode} añadido con ${existingAssignment.professorName}`,
        type: "success",
      });
    } else {
      // Si no existe asignación, entrar en modo edición automáticamente
      setEditingBlockId(newBlockId);
      setNewBlockPending(true);
    }
  };

  const handleStartEdit = (blockId: string) => {
    // No permitir editar si hay un bloque nuevo pendiente
    if (newBlockPending && editingBlockId !== blockId) {
      onToast({
        title: "Completa la edición actual",
        description: "Por favor completa o cancela la edición del curso nuevo primero",
        type: "error",
      });
      return;
    }
    setEditingBlockId(blockId);
  };

  const handleSaveEdit = (blockId: string, idProfessor: number, classroomName: string) => {
    // Validar que los campos no estén vacíos
    if (!idProfessor || !classroomName.trim()) {
      onToast({
        title: "Campos requeridos",
        description: "Debes seleccionar un profesor y completar el aula",
        type: "error",
      });
      return;
    }

    // Encontrar el bloque que se está editando
    const block = scheduleBlocks.find(b => b.id === blockId);
    if (!block) return;

    // Buscar el nombre del profesor
    const professor = professors.find(p => p.idUser === idProfessor);
    const professorName = professor ? `${professor.firstName} ${professor.lastName}` : "";

    // Actualizar TODOS los bloques del mismo curso (idGroupCourse)
    setScheduleBlocks(prev => prev.map(b => 
      b.idGroupCourse === block.idGroupCourse
        ? { ...b, idProfessor, professorName, classroomCode: classroomName }
        : b
    ));

    // Actualizar el registro de asignaciones
    setCourseAssignments(prev => ({
      ...prev,
      [block.idGroupCourse]: {
        idProfessor,
        professorName,
        classroomCode: classroomName,
      }
    }));

    setEditingBlockId(null);
    setNewBlockPending(false);

    onToast({
      title: newBlockPending ? "Clase agregada" : "Información actualizada",
      description: newBlockPending 
        ? `${block.courseCode} añadido al horario`
        : "Se actualizaron todas las clases de este curso",
      type: "success",
    });
  };

  const handleCancelEdit = (blockId: string) => {
    if (newBlockPending) {
      // Si es un bloque nuevo sin guardar, eliminarlo silenciosamente
      setScheduleBlocks(prev => prev.filter(b => b.id !== blockId));
    }
    setEditingBlockId(null);
    setNewBlockPending(false);
  };

  const handleClickOutside = () => {
    if (editingBlockId && newBlockPending) {
      // Si hay un bloque nuevo sin guardar y se hace clic fuera, eliminarlo silenciosamente
      setScheduleBlocks(prev => prev.filter(b => b.id !== editingBlockId));
      setEditingBlockId(null);
      setNewBlockPending(false);
    } else if (editingBlockId) {
      // Si es una edición normal, solo salir del modo edición
      setEditingBlockId(null);
    }
  };

  const updateBlockClassroom = (blockId: string, classroomId: number) => {
    const classroom = classrooms.find(c => c.idClassroom === classroomId);
    setScheduleBlocks(prev => prev.map(b => 
      b.id === blockId 
        ? { ...b, idClassroom: classroomId, classroomCode: classroom?.roomCode }
        : b
    ));
  };

  const calculateDurationHours = (startTime: string, endTime: string): number => {
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;
    return (endMinutes - startMinutes) / 60;
  };

  return {
    scheduleBlocks,
    draggedCourse,
    draggedBlock,
    editingBlockId,
    newBlockPending,
    courseAssignments,
    handleDragStart,
    handleBlockDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    handleStartEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleClickOutside,
    updateBlockClassroom,
    calculateDurationHours,
  };
}