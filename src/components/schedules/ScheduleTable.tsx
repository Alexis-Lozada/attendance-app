"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, User, Edit2, Check, X } from "lucide-react";
import { DAYS_OF_WEEK } from "@/types/schedule";
import type { Classroom } from "@/types/schedule";
import type { User as UserType } from "@/types/user";
import { getUsersByUniversity } from "@/services/user.service";
import { useAuth } from "@/context/AuthContext";

const WEEK_DAYS = DAYS_OF_WEEK.filter(day => day.value !== "SATURDAY");

interface ScheduleBlock {
  id: string;
  idGroupCourse: number;
  idCourse: number;
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

interface ScheduleTableProps {
  scheduleBlocks: ScheduleBlock[];
  classrooms: Classroom[];
  timeSlots: string[];
  editingBlockId: string | null;
  newBlockPending: boolean;
  onBlockDragStart: (e: React.DragEvent, block: ScheduleBlock) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, day: string, time: string, timeSlots: string[]) => void;
  onStartEdit: (blockId: string) => void;
  onSaveEdit: (blockId: string, idProfessor: number, classroomName: string) => void;
  onCancelEdit: (blockId: string) => void;
  onClickOutside: () => void;
}

export default function ScheduleTable({
  scheduleBlocks,
  classrooms,
  timeSlots,
  editingBlockId,
  newBlockPending,
  onBlockDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onClickOutside,
}: ScheduleTableProps) {
  const { user } = useAuth();
  const [editProfessor, setEditProfessor] = useState<number>(0);
  const [editClassroom, setEditClassroom] = useState("");
  const [professors, setProfessors] = useState<UserType[]>([]);
  const [loadingProfessors, setLoadingProfessors] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  // Cargar profesores al montar el componente
  useEffect(() => {
    const loadProfessors = async () => {
      if (!user?.idUniversity) return;
      
      try {
        setLoadingProfessors(true);
        const users = await getUsersByUniversity(user.idUniversity, true);
        // Filtrar solo profesores y tutores
        const teachersAndTutors = users.filter(u => 
          u.role === "TEACHER" || u.role === "TUTOR"
        );
        setProfessors(teachersAndTutors);
      } catch (error) {
        console.error("Error loading professors:", error);
      } finally {
        setLoadingProfessors(false);
      }
    };

    loadProfessors();
  }, [user?.idUniversity]);

  // Inicializar valores cuando se entra en modo edición
  useEffect(() => {
    if (editingBlockId) {
      const block = scheduleBlocks.find(b => b.id === editingBlockId);
      if (block) {
        setEditProfessor(block.idProfessor || 0);
        setEditClassroom(block.classroomCode || "");
      }
    }
  }, [editingBlockId, scheduleBlocks]);

  // Manejar click fuera del calendario
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tableRef.current && !tableRef.current.contains(event.target as Node)) {
        onClickOutside();
      }
    };

    if (editingBlockId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [editingBlockId, onClickOutside]);

  const handleSaveClick = (blockId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSaveEdit(blockId, editProfessor, editClassroom);
  };

  const handleCancelClick = (blockId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onCancelEdit(blockId);
  };

  return (
    <div className="overflow-x-auto" ref={tableRef}>
      <div className="min-w-[1000px]">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="p-3 border-r border-b border-gray-200 text-left w-20">
                <span className="text-xs font-semibold text-gray-600">HORA</span>
              </th>
              {WEEK_DAYS.map((day) => (
                <th 
                  key={day.value} 
                  className="p-3 border-r last:border-r-0 border-b border-gray-200 text-center min-w-[180px]"
                >
                  <span className="text-xs font-semibold text-gray-700">{day.label}</span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="max-h-[calc(100vh-300px)] overflow-y-auto">
            {timeSlots.map((time) => {
              const skipColumns = new Set<string>();
              
              WEEK_DAYS.forEach((day) => {
                const spanningBlock = scheduleBlocks.find(block => 
                  block.dayOfWeek === day.value && 
                  block.startTime < time && 
                  block.endTime > time
                );
                if (spanningBlock) {
                  skipColumns.add(day.value);
                }
              });

              return (
                <tr key={time} className="border-b border-gray-200">
                  <td className="p-2 bg-gray-50 border-r border-gray-200 text-center min-h-[80px] w-20">
                    <span className="text-xs text-gray-600 font-medium">{time}</span>
                  </td>

                  {WEEK_DAYS.map((day) => {
                    if (skipColumns.has(day.value)) {
                      return null;
                    }

                    const block = scheduleBlocks.find(b => 
                      b.dayOfWeek === day.value && 
                      b.startTime === time
                    );

                    let rowSpan = 1;
                    if (block) {
                      const startIdx = timeSlots.indexOf(block.startTime);
                      const endIdx = timeSlots.indexOf(block.endTime);
                      if (startIdx !== -1 && endIdx !== -1) {
                        rowSpan = endIdx - startIdx;
                      }
                    }

                    const isEditing = editingBlockId === block?.id;

                    return (
                      <td
                        key={day.value}
                        rowSpan={rowSpan}
                        draggable={!!block && !isEditing}
                        onDragStart={(e) => block && !isEditing && onBlockDragStart(e, block)}
                        onDragEnd={onDragEnd}
                        onDragOver={onDragOver}
                        onDrop={(e) => onDrop(e, day.value, time, timeSlots)}
                        className={`border-r last:border-r-0 border-gray-200 min-h-[80px] min-w-[180px] transition-colors relative group ${
                          block 
                            ? isEditing
                              ? 'bg-yellow-50 border-l-4 border-l-yellow-500'
                              : 'bg-primary/10 border-l-4 border-l-primary cursor-move'
                            : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        {block ? (
                          <div className="p-2 h-full flex flex-col justify-between min-h-[80px]">
                            <div className="space-y-1">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-bold text-gray-900 truncate flex-1">
                                  {block.courseCode}
                                </p>
                                {!isEditing && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onStartEdit(block.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white rounded"
                                    title="Editar información"
                                  >
                                    <Edit2 size={12} className="text-gray-600" />
                                  </button>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 line-clamp-2">
                                {block.courseName}
                              </p>
                            </div>

                            <div className="space-y-1 mt-2">
                              {isEditing ? (
                                <>
                                  <div className="flex items-center gap-1">
                                    <User size={10} className="text-gray-500 flex-shrink-0" />
                                    <select
                                      value={editProfessor}
                                      onChange={(e) => setEditProfessor(Number(e.target.value))}
                                      onClick={(e) => e.stopPropagation()}
                                      autoFocus={newBlockPending}
                                      disabled={loadingProfessors}
                                      className="flex-1 bg-white text-gray-700 text-xs rounded px-1 py-0.5 border border-gray-300 focus:ring-1 focus:ring-primary focus:outline-none"
                                    >
                                      <option value={0}>Seleccionar profesor</option>
                                      {professors.map(prof => (
                                        <option key={prof.idUser} value={prof.idUser}>
                                          {prof.firstName} {prof.lastName}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin size={10} className="text-gray-500 flex-shrink-0" />
                                    <input
                                      type="text"
                                      value={editClassroom}
                                      onChange={(e) => setEditClassroom(e.target.value)}
                                      onClick={(e) => e.stopPropagation()}
                                      placeholder="Aula"
                                      className="flex-1 bg-white text-gray-700 text-xs rounded px-1 py-0.5 border border-gray-300 focus:ring-1 focus:ring-primary focus:outline-none"
                                    />
                                  </div>
                                  <div className="flex gap-1 mt-2">
                                    <button
                                      onClick={(e) => handleSaveClick(block.id, e)}
                                      className="flex-1 flex items-center justify-center gap-1 bg-green-600 text-white text-xs py-1 rounded hover:bg-green-700 transition"
                                    >
                                      <Check size={10} />
                                      Guardar
                                    </button>
                                    <button
                                      onClick={(e) => handleCancelClick(block.id, e)}
                                      className="flex-1 flex items-center justify-center gap-1 bg-gray-400 text-white text-xs py-1 rounded hover:bg-gray-500 transition"
                                    >
                                      <X size={10} />
                                      Cancelar
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex items-center gap-1 text-xs">
                                    <User size={10} className="text-gray-500 flex-shrink-0" />
                                    <span className={`truncate ${!block.professorName ? 'text-gray-400 italic' : 'text-gray-700'}`}>
                                      {block.professorName || "Sin asignar"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs">
                                    <MapPin size={10} className="text-gray-500 flex-shrink-0" />
                                    <span className={`truncate ${!block.classroomCode ? 'text-gray-400 italic' : 'text-gray-700'}`}>
                                      {block.classroomCode || "Sin asignar"}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}