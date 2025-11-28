/**
 * Tipos para la gestión de inscripciones de estudiantes en grupos
 */

export interface Enrollment {
  idEnrollment: number;
  idStudent: number;
  idGroup: number;
  enrollmentDate: string;
  status: boolean;
}

export interface EnrollmentWithDetails extends Enrollment {
  studentName: string;
  groupCode: string;
  programName?: string;
  semester?: string;
  studentEmail?: string;
  studentImage?: string;
}

export interface EnrollmentFormData {
  idStudent: number;
  idGroup: number;
  enrollmentDate?: string;
  status?: boolean;
}