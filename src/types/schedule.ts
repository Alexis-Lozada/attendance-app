export interface Schedule {
  idSchedule: number;
  idClassroom: number;
  idGroupCourse: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface ScheduleWithDetails extends Schedule {
  classroomCode?: string;
  classroomName?: string;
  groupCode?: string;
  courseCode?: string;
  courseName?: string;
  professorName?: string;
  programName?: string;
}

export interface ScheduleFormData {
  idClassroom: number;
  idGroupCourse: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface Classroom {
  idClassroom: number;
  roomCode: string;
  roomName: string;
  location: string;
  status: boolean;
}

export interface GroupCourse {
  idGroupCourse: number;
  idGroup: number;
  idCourse: number;
  idProfessor: number;
  groupCode?: string;
  courseCode?: string;
  courseName?: string;
  professorName?: string;
  semester?: string;
  programName?: string;
}

export const DAYS_OF_WEEK = [
  { value: "MONDAY", label: "Lunes" },
  { value: "TUESDAY", label: "Martes" },
  { value: "WEDNESDAY", label: "Miércoles" },
  { value: "THURSDAY", label: "Jueves" },
  { value: "FRIDAY", label: "Viernes" },
  { value: "SATURDAY", label: "Sábado" },
] as const;

export const TIME_SLOTS = [
  "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", 
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00", "20:30", "21:00"
] as const;