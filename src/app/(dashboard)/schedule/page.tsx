"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock,
  Users,
  GripVertical,
  Save,
  BookOpen,
  Download
} from "lucide-react";

import Toast from "@/components/ui/Toast";
import Spinner from "@/components/ui/Spinner";
import ScheduleTable from "@/components/schedules/ScheduleTable";
import { useScheduleTable } from "@/hooks/useScheduleTable";
import { useAuth } from "@/context/AuthContext";
import { getGroupsByDivision } from "@/services/group.service";
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

const TIME_SLOTS = [
  "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
  "19:00", "20:00", "21:00"
];

export default function ScheduleBuilderPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [groups, setGroups] = useState<GroupWithDetails[]>([]);
  const [groupCourses, setGroupCourses] = useState<GroupCourse[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [startTime, setStartTime] = useState("07:00");
  const [endTime, setEndTime] = useState("21:00");
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    type: "success" | "error";
  } | null>(null);

  const {
    scheduleBlocks,
    draggedCourse,
    handleDragStart,
    handleBlockDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    updateBlockClassroom,
    calculateDurationHours,
  } = useScheduleTable({ 
    classrooms, 
    onToast: setToast 
  });

  useEffect(() => {
    const loadData = async () => {
      if (!user?.idDivision) {
        setLoading(false);
        return;
      }

      setLoading(true);
      
      try {
        // Cargar grupos activos de la división del usuario
        const activeGroups = await getGroupsByDivision(user.idDivision, true);
        
        // Convertir GroupResponse a GroupWithDetails
        const groupsWithDetails: GroupWithDetails[] = activeGroups.map(g => ({
          idGroup: g.idGroup,
          idProgram: g.idProgram,
          idTutor: g.idTutor,
          groupCode: g.groupCode,
          semester: g.semester,
          academicYear: g.academicYear,
          enrollmentCount: g.enrollmentCount,
          status: g.status,
          programName: g.programName,
          programCode: "", // Este campo no viene en GroupResponse
        }));

        setGroups(groupsWithDetails);
        setGroupCourses(MOCK_GROUP_COURSES);
        setClassrooms(MOCK_CLASSROOMS);
      } catch (error: any) {
        console.error("Error loading groups:", error);
        setToast({
          title: "Error al cargar grupos",
          description: error?.message || "No se pudieron cargar los grupos de la división",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.idDivision]);

  const availableCourses = selectedGroup 
    ? groupCourses.filter(gc => gc.idGroup === selectedGroup)
    : [];

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
              <ScheduleTable
                scheduleBlocks={scheduleBlocks}
                classrooms={classrooms}
                timeSlots={filteredTimeSlots}
                onBlockDragStart={handleBlockDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={(e, day, time) => handleDrop(e, day, time, TIME_SLOTS)}
                onUpdateBlockClassroom={updateBlockClassroom}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}