"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock,
  MapPin,
  Users,
  GripVertical,
  Trash2,
  Save,
  BookOpen,
  Download
} from "lucide-react";

import Toast from "@/components/ui/Toast";
import Spinner from "@/components/ui/Spinner";
import { DAYS_OF_WEEK } from "@/types/schedule";
import type { 
  GroupCourse,
  Classroom 
} from "@/types/schedule";
import type { GroupWithDetails } from "@/types/group";

// Mock data
const MOCK_CLASSROOMS: Classroom[] = [
  { idClassroom: 1, roomCode: "A101", roomName: "Laboratorio 1", location: "Edificio A", status: true },
  { idClassroom: 2, roomCode: "A102", roomName: "Aula Magna", location: "Edificio A", status: true },
  { idClassroom: 3, roomCode: "B201", roomName: "Sala de Cómputo", location: "Edificio B", status: true },
  { idClassroom: 4, roomCode: "C301", roomName: "Auditorio", location: "Edificio C", status: true },
];

const MOCK_GROUP_COURSES: GroupCourse[] = [
  { 
    idGroupCourse: 1, 
    idGroup: 1, 
    idCourse: 1, 
    idProfessor: 1, 
    groupCode: "IDGS10-A", 
    courseCode: "BD101", 
    courseName: "Bases de Datos", 
    professorName: "Dr. Juan Pérez", 
    semester: "10", 
    programName: "Ing. Desarrollo Software" 
  },
  { 
    idGroupCourse: 2, 
    idGroup: 1, 
    idCourse: 2, 
    idProfessor: 2, 
    groupCode: "IDGS10-A", 
    courseCode: "WEB201", 
    courseName: "Desarrollo Web", 
    professorName: "Ing. María García", 
    semester: "10", 
    programName: "Ing. Desarrollo Software" 
  },
  { 
    idGroupCourse: 3, 
    idGroup: 1, 
    idCourse: 3, 
    idProfessor: 3, 
    groupCode: "IDGS10-A", 
    courseCode: "ALG301", 
    courseName: "Algoritmos Avanzados", 
    professorName: "Mtro. Carlos López", 
    semester: "10", 
    programName: "Ing. Desarrollo Software" 
  },
  { 
    idGroupCourse: 4, 
    idGroup: 2, 
    idCourse: 4, 
    idProfessor: 1, 
    groupCode: "ISC08-B", 
    courseCode: "CALC201", 
    courseName: "Cálculo Diferencial", 
    professorName: "Dr. Ana Martínez", 
    semester: "8", 
    programName: "Ing. Sistemas Computacionales" 
  },
  { 
    idGroupCourse: 5, 
    idGroup: 2, 
    idCourse: 5, 
    idProfessor: 2, 
    groupCode: "ISC08-B", 
    courseCode: "PROG101", 
    courseName: "Programación Estructurada", 
    professorName: "Ing. Pedro Sánchez", 
    semester: "8", 
    programName: "Ing. Sistemas Computacionales" 
  },
];

const MOCK_GROUPS: GroupWithDetails[] = [
  { 
    idGroup: 1, 
    idProgram: 1, 
    idTutor: 1, 
    groupCode: "IDGS10-A", 
    semester: "10", 
    academicYear: "2024-2025", 
    enrollmentCount: 25, 
    status: true, 
    programName: "Ingeniería en Desarrollo de Software", 
    programCode: "IDGS" 
  },
  { 
    idGroup: 2, 
    idProgram: 2, 
    idTutor: 2, 
    groupCode: "ISC08-B", 
    semester: "8", 
    academicYear: "2024-2025", 
    enrollmentCount: 30, 
    status: true, 
    programName: "Ingeniería en Sistemas Computacionales", 
    programCode: "ISC" 
  },
];

const TIME_SLOTS = [
  "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
  "19:00", "20:00", "21:00"
];

// Only Monday to Friday
const WEEK_DAYS = DAYS_OF_WEEK.filter(day => 
  day.value !== "SATURDAY"
);

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

export default function ScheduleBuilderPage() {
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [groups, setGroups] = useState<GroupWithDetails[]>([]);
  const [groupCourses, setGroupCourses] = useState<GroupCourse[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlock[]>([]);
  const [draggedCourse, setDraggedCourse] = useState<GroupCourse | null>(null);
  const [draggedBlock, setDraggedBlock] = useState<ScheduleBlock | null>(null);
  const [dropSuccessful, setDropSuccessful] = useState(false);
  const [startTime, setStartTime] = useState("07:00");
  const [endTime, setEndTime] = useState("21:00");
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setGroups(MOCK_GROUPS);
      setGroupCourses(MOCK_GROUP_COURSES);
      setClassrooms(MOCK_CLASSROOMS);
      setLoading(false);
    };

    loadData();
  }, []);

  const availableCourses = selectedGroup 
    ? groupCourses.filter(gc => gc.idGroup === selectedGroup)
    : [];

  const handleDragStart = (e: React.DragEvent, course: GroupCourse) => {
    setDraggedCourse(course);
    setDraggedBlock(null);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleBlockDragStart = (e: React.DragEvent, block: ScheduleBlock) => {
    setDraggedBlock(block);
    setDraggedCourse(null);
    e.dataTransfer.effectAllowed = 'move';
    
    // Add visual feedback
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '1';
    
    // If a block was being dragged and drop was not successful, delete it
    if (draggedBlock && !dropSuccessful) {
      setScheduleBlocks(prev => prev.filter(b => b.id !== draggedBlock.id));
      setToast({
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

  const handleDrop = (e: React.DragEvent, day: string, time: string) => {
    e.preventDefault();
    
    // Handle moving an existing block
    if (draggedBlock) {
      // Calculate duration of the block
      const startIdx = TIME_SLOTS.indexOf(draggedBlock.startTime);
      const endIdx = TIME_SLOTS.indexOf(draggedBlock.endTime);
      const duration = endIdx - startIdx;
      
      const newEndTime = calculateEndTime(time, duration);

      // Check for conflicts (excluding the block being moved)
      const hasConflict = scheduleBlocks.some(block => {
        if (block.id === draggedBlock.id || block.dayOfWeek !== day) return false;
        
        return (
          (time >= block.startTime && time < block.endTime) ||
          (newEndTime > block.startTime && newEndTime <= block.endTime) ||
          (time <= block.startTime && newEndTime >= block.endTime)
        );
      });

      if (hasConflict) {
        setToast({
          title: "Conflicto de horario",
          description: "Ya existe otra clase en este horario",
          type: "error",
        });
        setDraggedBlock(null);
        return;
      }

      // Move the block
      setScheduleBlocks(prev => prev.map(b => 
        b.id === draggedBlock.id 
          ? { ...b, dayOfWeek: day, startTime: time, endTime: newEndTime }
          : b
      ));

      setDropSuccessful(true);
      setDraggedBlock(null);
      setToast({
        title: "Clase movida",
        description: `${draggedBlock.courseCode} movido exitosamente`,
        type: "success",
      });
      return;
    }

    // Handle dropping a new course from sidebar
    if (!draggedCourse) return;

    // Check if there's an adjacent block of the same course that we can extend
    const adjacentBlock = scheduleBlocks.find(block => 
      block.dayOfWeek === day &&
      block.idGroupCourse === draggedCourse.idGroupCourse &&
      (block.endTime === time || block.startTime === calculateEndTime(time, 1))
    );

    if (adjacentBlock) {
      // Extend the existing block
      const newStartTime = adjacentBlock.startTime < time ? adjacentBlock.startTime : time;
      const newEndTime = adjacentBlock.endTime > calculateEndTime(time, 1) ? adjacentBlock.endTime : calculateEndTime(time, 1);

      // Check if extension would conflict with other blocks
      const hasConflict = scheduleBlocks.some(block => {
        if (block.id === adjacentBlock.id || block.dayOfWeek !== day) return false;
        
        return (
          (newStartTime >= block.startTime && newStartTime < block.endTime) ||
          (newEndTime > block.startTime && newEndTime <= block.endTime) ||
          (newStartTime <= block.startTime && newEndTime >= block.endTime)
        );
      });

      if (hasConflict) {
        setToast({
          title: "Conflicto de horario",
          description: "No se puede extender, hay otra clase en el camino",
          type: "error",
        });
        return;
      }

      // Update the block
      setScheduleBlocks(prev => prev.map(b => 
        b.id === adjacentBlock.id 
          ? { ...b, startTime: newStartTime, endTime: newEndTime }
          : b
      ));

      setDraggedCourse(null);
      setToast({
        title: "Clase extendida",
        description: `${draggedCourse.courseCode} ahora ocupa ${calculateDurationHours(newStartTime, newEndTime)}h`,
        type: "success",
      });
      return;
    }

    // No adjacent block, create new block
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
      setToast({
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

    setToast({
      title: "Clase agregada",
      description: `${draggedCourse.courseCode} añadido al horario`,
      type: "success",
    });
  };

  const removeBlock = (blockId: string) => {
    setScheduleBlocks(prev => prev.filter(b => b.id !== blockId));
    setToast({
      title: "Clase eliminada",
      description: "La clase fue removida del horario",
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

  const saveSchedule = () => {
    if (scheduleBlocks.length === 0) {
      setToast({
        title: "Horario vacío",
        description: "Agrega clases al horario antes de guardar",
        type: "error",
      });
      return;
    }

    console.log("Saving schedule:", scheduleBlocks);
    setToast({
      title: "Horario guardado",
      description: `${scheduleBlocks.length} clases guardadas exitosamente`,
      type: "success",
    });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Filter time slots based on selected range
  const filteredTimeSlots = TIME_SLOTS.filter(time => time >= startTime && time <= endTime);

  if (loading) {
    return <Spinner text="Cargando constructor de horarios..." fullScreen />;
  }

  return (
    <>
      {toast && (
        <Toast
          title={toast.title}
          description={toast.description}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* === Encabezado === */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900">
            Constructor Visual de Horarios
          </h3>
          <p className="text-[13px] text-gray-500">
            Arrastra los cursos al calendario para crear el horario del grupo seleccionado
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setToast({
                title: "Función en desarrollo",
                description: "La exportación estará disponible próximamente",
                type: "success",
              });
            }}
            disabled={scheduleBlocks.length === 0}
            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            Exportar
          </button>

          <button
            onClick={saveSchedule}
            disabled={scheduleBlocks.length === 0}
            className="w-full sm:w-auto px-5 py-2.5 bg-primary text-white rounded-lg flex items-center justify-center gap-2 hover:brightness-95 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            Guardar Horario
          </button>
        </div>
      </header>

      {/* === Stats cards === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Clases Programadas</p>
              <p className="text-2xl font-semibold text-gray-900">{scheduleBlocks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Horas Semanales</p>
              <p className="text-2xl font-semibold text-gray-900">
                {scheduleBlocks.reduce((total, block) => {
                  const duration = calculateDurationHours(block.startTime, block.endTime);
                  return total + duration;
                }, 0)}h
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Cursos Asignados</p>
              <p className="text-2xl font-semibold text-gray-900">
                {new Set(scheduleBlocks.map(b => b.idGroupCourse)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200">
                <Users className="w-4 h-4 text-gray-700" />
              </div>
              <h4 className="text-sm font-medium text-gray-900">
                Seleccionar Grupo
              </h4>
            </div>

            <div className="mb-4">
              <select
                value={selectedGroup || ""}
                onChange={(e) => setSelectedGroup(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white appearance-none cursor-pointer focus:ring-1 focus:ring-primary focus:outline-none"
              >
                <option value="">Seleccionar grupo...</option>
                {groups.map((group) => (
                  <option key={group.idGroup} value={group.idGroup}>
                    {group.groupCode} - Semestre {group.semester}
                  </option>
                ))}
              </select>
            </div>

            {selectedGroup && (
              <>
                <div className="mb-3 pb-3 border-b border-gray-200">
                  <p className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Cursos Disponibles
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Arrastra al calendario →
                  </p>
                </div>

                <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto">
                  {availableCourses.map((course) => (
                    <div
                      key={course.idGroupCourse}
                      draggable
                      onDragStart={(e) => handleDragStart(e, course)}
                      className="bg-white border border-gray-200 rounded-lg p-3 cursor-move hover:border-primary hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="w-4 h-4 text-gray-400 mt-0.5 group-hover:text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {course.courseCode}
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                            {course.courseName}
                          </p>
                          <div className="flex items-center gap-1 mt-1.5">
                            <div className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <Users className="w-3 h-3 text-gray-600" />
                            </div>
                            <p className="text-xs text-gray-500 truncate">
                              {course.professorName}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {availableCourses.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      No hay cursos disponibles
                    </div>
                  )}
                </div>
              </>
            )}

            {!selectedGroup && (
              <div className="text-center py-12 text-gray-400 text-sm">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Selecciona un grupo para ver sus cursos</p>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-9">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200">
                  <Calendar className="w-4 h-4 text-gray-700" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Horario Semanal
                  </h4>
                  {selectedGroup && (
                    <p className="text-xs text-gray-500">
                      {groups.find(g => g.idGroup === selectedGroup)?.groupCode}
                    </p>
                  )}
                </div>
              </div>

              {/* Time range selector */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="text-xs text-gray-600 font-medium">Horario:</span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1 text-xs text-gray-900 bg-white cursor-pointer focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    {TIME_SLOTS.slice(0, -1).map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  <span className="text-xs text-gray-500">a</span>
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1 text-xs text-gray-900 bg-white cursor-pointer focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    {TIME_SLOTS.slice(1).map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {!selectedGroup ? (
              <div className="flex items-center justify-center py-32">
                <div className="text-center">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm text-gray-500 font-medium">Selecciona un grupo</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Elige un grupo del panel izquierdo para comenzar
                  </p>
                </div>
              </div>
            ) : (

            <div className="overflow-x-auto">
              <div className="min-w-[1000px]">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="p-3 border-r border-b border-gray-200 text-left w-20">
                        <span className="text-xs font-semibold text-gray-600">HORA</span>
                      </th>
                      {WEEK_DAYS.map((day) => (
                        <th key={day.value} className="p-3 border-r last:border-r-0 border-b border-gray-200 text-center min-w-[180px]">
                          <span className="text-xs font-semibold text-gray-700">{day.label}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="max-h-[calc(100vh-300px)] overflow-y-auto">
                    {filteredTimeSlots.map((time) => {
                      // Track which columns should be skipped (already occupied by rowspan)
                      const skipColumns = new Set<string>();
                      
                      // Find blocks that are spanning this time slot
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
                            // Skip if this cell is part of a rowspan from above
                            if (skipColumns.has(day.value)) {
                              return null;
                            }

                            // Find block starting at this time
                            const block = scheduleBlocks.find(b => 
                              b.dayOfWeek === day.value && 
                              b.startTime === time
                            );

                            // Calculate rowspan
                            let rowSpan = 1;
                            if (block) {
                              const startIdx = TIME_SLOTS.indexOf(block.startTime);
                              const endIdx = TIME_SLOTS.indexOf(block.endTime);
                              if (startIdx !== -1 && endIdx !== -1) {
                                rowSpan = endIdx - startIdx;
                              }
                            }

                            return (
                              <td
                                key={day.value}
                                rowSpan={rowSpan}
                                draggable={!!block}
                                onDragStart={(e) => block && handleBlockDragStart(e, block)}
                                onDragEnd={handleDragEnd}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, day.value, time)}
                                className={`border-r last:border-r-0 border-gray-200 min-h-[80px] min-w-[180px] transition-colors relative group ${
                                  block 
                                    ? 'bg-primary/10 border-l-4 border-l-primary cursor-move' 
                                    : 'bg-white hover:bg-gray-50'
                                }`}
                              >
                                {block ? (
                                  <div className="p-2 h-full flex flex-col justify-between min-h-[80px]">
                                    <div className="space-y-1">
                                      <p className="text-xs font-bold text-gray-900 truncate">
                                        {block.courseCode}
                                      </p>
                                      <p className="text-xs text-gray-600 line-clamp-2">
                                        {block.courseName}
                                      </p>
                                    </div>

                                    <div className="space-y-1 mt-2">
                                      <div className="flex items-center gap-1 text-xs">
                                        <MapPin size={10} className="text-gray-500 flex-shrink-0" />
                                        <select
                                          value={block.idClassroom}
                                          onChange={(e) => updateBlockClassroom(block.id, Number(e.target.value))}
                                          className="flex-1 bg-white text-gray-700 text-xs rounded px-1 py-0.5 border border-gray-300 cursor-pointer hover:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          {classrooms.map((classroom) => (
                                            <option key={classroom.idClassroom} value={classroom.idClassroom}>
                                              {classroom.roomCode}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
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
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function calculateEndTime(startTime: string, hours: number): string {
  const [h, m] = startTime.split(":").map(Number);
  const totalMinutes = h * 60 + m + (hours * 60);
  const endH = Math.floor(totalMinutes / 60);
  const endM = totalMinutes % 60;
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
}

function calculateDurationHours(startTime: string, endTime: string): number {
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  const startMinutes = sh * 60 + sm;
  const endMinutes = eh * 60 + em;
  return (endMinutes - startMinutes) / 60;
}