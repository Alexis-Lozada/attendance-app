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
  courseCode?: string;
  courseName?: string;
  professorName?: string;
  classroomCode?: string;
}

interface UseScheduleTableProps {
  classrooms: Classroom[];
  onToast: (toast: { title: string; description?: string; type: "success" | "error" }) => void;
}

export function useScheduleTable({ classrooms, onToast }: UseScheduleTableProps) {
  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlock[]>([]);
  const [draggedCourse, setDraggedCourse] = useState<GroupCourse | null>(null);
  const [draggedBlock, setDraggedBlock] = useState<ScheduleBlock | null>(null);
  const [dropSuccessful, setDropSuccessful] = useState(false);

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

    const newBlock: ScheduleBlock = {
      id: `${Date.now()}-${Math.random()}`,
      idGroupCourse: draggedCourse.idGroupCourse,
      dayOfWeek: day,
      startTime: time,
      endTime: endTime,
      idClassroom: classrooms[0]?.idClassroom || 1,
      courseCode: draggedCourse.courseCode,
      courseName: draggedCourse.courseName,
      professorName: draggedCourse.professorName,
      classroomCode: classrooms[0]?.roomCode,
    };

    setScheduleBlocks(prev => [...prev, newBlock]);
    setDraggedCourse(null);

    onToast({
      title: "Clase agregada",
      description: `${draggedCourse.courseCode} añadido al horario`,
      type: "success",
    });
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
    handleDragStart,
    handleBlockDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    updateBlockClassroom,
    calculateDurationHours,
  };
}