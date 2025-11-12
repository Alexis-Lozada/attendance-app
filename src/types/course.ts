export interface Course {
  idCourse: number;
  idUniversity: number;
  idDivision?: number | null;
  divisionCode?: string | null;
  divisionName?: string | null;
  courseCode: string;
  courseName: string;
  semester?: string | null; // null = curso general que aplica para múltiples semestres
  status: boolean;

  // === Datos enriquecidos ===
  modulesCount?: number; // cantidad de módulos
  groupsCount?: number;  // cantidad de grupos asociados
  groupIds?: number[];   // opcional: si planeas mostrar grupos asociados
}
