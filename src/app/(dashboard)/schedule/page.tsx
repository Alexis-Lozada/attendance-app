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
import { getCoursesByDivision } from "@/services/course.service";
import { getUsersByUniversity } from "@/services/user.service";
import { getSchedulesByGroup, createOrUpdateGroupSchedules } from "@/services/schedule.service";
import type { 
  GroupCourse,
  Classroom 
} from "@/types/schedule";
import type { GroupWithDetails } from "@/types/group";
import type { User } from "@/types/user";

// Mock data
const MOCK_CLASSROOMS: Classroom[] = [
  { idClassroom: 1, roomCode: "A101", roomName: "Laboratorio 1", location: "Edificio A", status: true },
  { idClassroom: 2, roomCode: "A102", roomName: "Aula Magna", location: "Edificio A", status: true },
  { idClassroom: 3, roomCode: "B201", roomName: "Sala de Cómputo", location: "Edificio B", status: true },
  { idClassroom: 4, roomCode: "C301", roomName: "Auditorio", location: "Edificio C", status: true },
];

const TIME_SLOTS = [
  "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
  "19:00", "20:00", "21:00"
];

export default function ScheduleBuilderPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [groups, setGroups] = useState<GroupWithDetails[]>([]);
  const [groupCourses, setGroupCourses] = useState<GroupCourse[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [professors, setProfessors] = useState<User[]>([]);
  const [initialScheduleBlocks, setInitialScheduleBlocks] = useState<any[]>([]);
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
    editingBlockId,
    newBlockPending,
    handleDragStart,
    handleBlockDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    handleStartEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleClickOutside,
    calculateDurationHours,
  } = useScheduleTable({ 
    classrooms,
    professors,
    initialBlocks: initialScheduleBlocks,
    onToast: setToast 
  });

  useEffect(() => {
    const loadData = async () => {
      if (!user?.idDivision || !user?.idUniversity) {
        setLoading(false);
        return;
      }

      setLoading(true);
      
      try {
        // Cargar grupos activos de la división del usuario
        const activeGroups = await getGroupsByDivision(user.idDivision, true);
        
        // Cargar cursos activos de la división del usuario
        const activeCourses = await getCoursesByDivision(user.idDivision, true);
        
        // Cargar profesores activos de la universidad
        const allUsers = await getUsersByUniversity(user.idUniversity, true);
        const teachersAndTutors = allUsers.filter(u => 
          u.role === "TEACHER" || u.role === "TUTOR"
        );
        
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

        // Convertir CourseResponse a GroupCourse (temporal para compatibilidad)
        const coursesAsGroupCourses: GroupCourse[] = activeCourses.map(c => ({
          idGroupCourse: c.idCourse, // Temporal, se generará al crear el horario
          idGroup: 0, // No está asignado a un grupo aún
          idCourse: c.idCourse,
          idProfessor: 0, // Se asignará al arrastrar al horario
          groupCode: "", // Se asignará al arrastrar al horario
          courseCode: c.courseCode,
          courseName: c.courseName,
          professorName: "Sin asignar", // Se asignará al arrastrar al horario
          semester: c.semester || "",
          programName: c.divisionName || "",
        }));

        setGroups(groupsWithDetails);
        setGroupCourses(coursesAsGroupCourses);
        setProfessors(teachersAndTutors);
        setClassrooms(MOCK_CLASSROOMS);
      } catch (error: any) {
        console.error("Error loading data:", error);
        setToast({
          title: "Error al cargar datos",
          description: error?.message || "No se pudieron cargar los grupos y cursos de la división",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.idDivision, user?.idUniversity]);

  // Cargar horarios cuando se selecciona un grupo
  useEffect(() => {
    const loadGroupSchedules = async () => {
      if (!selectedGroup) {
        setInitialScheduleBlocks([]);
        return;
      }

      setLoadingSchedules(true);
      
      try {
        const groupSchedules = await getSchedulesByGroup(selectedGroup);
        
        // Convertir el response a ScheduleBlocks
        const blocks: any[] = [];
        
        groupSchedules.forEach((groupCourse) => {
          const course = groupCourses.find(c => c.idCourse === groupCourse.idCourse);
          const professor = professors.find(p => p.idUser === groupCourse.idProfessor);
          
          groupCourse.schedules.forEach((schedule) => {
            // Convertir el día de español a inglés para el formato interno
            const dayMap: Record<string, string> = {
              "Lunes": "MONDAY",
              "Martes": "TUESDAY",
              "Miércoles": "WEDNESDAY",
              "Miercoles": "WEDNESDAY",
              "Jueves": "THURSDAY",
              "Viernes": "FRIDAY",
              "Sábado": "SATURDAY",
              "Sabado": "SATURDAY",
            };
            
            blocks.push({
              id: `schedule-${schedule.idSchedule}`,
              idGroupCourse: groupCourse.idGroupCourse,
              idCourse: groupCourse.idCourse,
              dayOfWeek: dayMap[schedule.dayOfWeek] || schedule.dayOfWeek,
              startTime: schedule.startTime,
              endTime: schedule.endTime,
              idClassroom: 0, // No tenemos el ID del aula en el response
              idProfessor: groupCourse.idProfessor,
              courseCode: course?.courseCode || "",
              courseName: course?.courseName || "",
              professorName: professor ? `${professor.firstName} ${professor.lastName}` : "",
              classroomCode: schedule.classroom,
            });
          });
        });
        
        setInitialScheduleBlocks(blocks);
      } catch (error: any) {
        console.error("Error loading group schedules:", error);
        setToast({
          title: "Error al cargar horarios",
          description: error?.message || "No se pudieron cargar los horarios del grupo",
          type: "error",
        });
        setInitialScheduleBlocks([]);
      } finally {
        setLoadingSchedules(false);
      }
    };

    loadGroupSchedules();
  }, [selectedGroup, groupCourses, professors]);

  const availableCourses = selectedGroup 
    ? groupCourses // Mostrar todos los cursos de la división cuando hay un grupo seleccionado
    : [];

  const saveSchedule = async () => {
    if (!selectedGroup) {
      setToast({
        title: "Grupo no seleccionado",
        description: "Selecciona un grupo antes de guardar",
        type: "error",
      });
      return;
    }

    if (scheduleBlocks.length === 0) {
      setToast({
        title: "Horario vacío",
        description: "Agrega clases al horario antes de guardar",
        type: "error",
      });
      return;
    }

    // Validar que todos los bloques tengan profesor y aula asignados
    const incompleteBlocks = scheduleBlocks.filter(
      block => !block.idProfessor || !block.classroomCode?.trim()
    );

    if (incompleteBlocks.length > 0) {
      setToast({
        title: "Horarios incompletos",
        description: `Hay ${incompleteBlocks.length} clase(s) sin profesor o aula asignada`,
        type: "error",
      });
      return;
    }

    setLoadingSchedules(true);

    try {
      // Agrupar bloques por curso (idCourse)
      const courseMap = new Map<number, typeof scheduleBlocks>();
      
      scheduleBlocks.forEach(block => {
        if (!courseMap.has(block.idCourse)) {
          courseMap.set(block.idCourse, []);
        }
        courseMap.get(block.idCourse)!.push(block);
      });

      // Mapear días de inglés a español para la API
      const dayMapToSpanish: Record<string, string> = {
        "MONDAY": "Lunes",
        "TUESDAY": "Martes",
        "WEDNESDAY": "Miércoles",
        "THURSDAY": "Jueves",
        "FRIDAY": "Viernes",
        "SATURDAY": "Sábado",
      };

      // Construir el payload para la API
      const groupCourses = Array.from(courseMap.entries()).map(([idCourse, blocks]) => {
        // Tomar el primer bloque para obtener info general del curso
        const firstBlock = blocks[0];
        
        // Extraer el idSchedule si existe (para updates)
        const schedules = blocks.map(block => {
          // El ID original viene en el formato "schedule-{idSchedule}"
          const idSchedule = block.id.startsWith('schedule-') 
            ? parseInt(block.id.replace('schedule-', ''))
            : undefined;

          return {
            idSchedule, // Opcional: presente si es un horario existente
            dayOfWeek: dayMapToSpanish[block.dayOfWeek] || block.dayOfWeek,
            startTime: block.startTime,
            endTime: block.endTime,
            classroom: block.classroomCode || "",
          };
        });

        return {
          idGroupCourse: firstBlock.idGroupCourse || undefined,
          idCourse: idCourse,
          idProfessor: firstBlock.idProfessor!,
          schedules,
        };
      });

      const payload = {
        idGroup: selectedGroup,
        groupCourses,
      };

      console.log("Payload to save:", JSON.stringify(payload, null, 2));

      // Llamar al servicio
      await createOrUpdateGroupSchedules(payload);

      setToast({
        title: "Horario guardado",
        description: `Se guardaron exitosamente ${scheduleBlocks.length} clases`,
        type: "success",
      });

      // Recargar los horarios para obtener los IDs actualizados
      setTimeout(() => {
        if (selectedGroup) {
          // Trigger reload by changing selectedGroup state
          const currentGroup = selectedGroup;
          setSelectedGroup(null);
          setTimeout(() => setSelectedGroup(currentGroup), 100);
        }
      }, 1000);

    } catch (error: any) {
      console.error("Error saving schedule:", error);
      setToast({
        title: "Error al guardar",
        description: error?.message || "No se pudo guardar el horario",
        type: "error",
      });
    } finally {
      setLoadingSchedules(false);
    }
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
            disabled={scheduleBlocks.length === 0 || loadingSchedules}
            className="w-full sm:w-auto px-5 py-2.5 bg-primary text-white rounded-lg flex items-center justify-center gap-2 hover:brightness-95 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingSchedules ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save size={18} />
                Guardar Horario
              </>
            )}
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
                    Cursos de la División
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Arrastra al calendario para asignar →
                  </p>
                </div>

                <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto">
                  {availableCourses.map((course) => (
                    <div
                      key={course.idCourse}
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
                          {course.semester && (
                            <div className="flex items-center gap-1 mt-1.5">
                              <div className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                                Semestre {course.semester}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {availableCourses.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      No hay cursos activos en esta división
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
            ) : loadingSchedules ? (
              <div className="flex items-center justify-center py-32">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                  <p className="text-sm text-gray-500 font-medium">Cargando horarios...</p>
                </div>
              </div>
            ) : (
              <ScheduleTable
                scheduleBlocks={scheduleBlocks}
                classrooms={classrooms}
                timeSlots={filteredTimeSlots}
                editingBlockId={editingBlockId}
                newBlockPending={newBlockPending}
                onBlockDragStart={handleBlockDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={(e, day, time) => handleDrop(e, day, time, TIME_SLOTS)}
                onStartEdit={handleStartEdit}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
                onClickOutside={handleClickOutside}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}