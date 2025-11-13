export interface Course {
  idCourse: number;
  idUniversity: number;
  idDivision?: number | null;
  courseCode: string;
  courseName: string;
  semester?: string | null;
  status: boolean;
}

export interface CourseWithDetails extends Course {
  divisionCode?: string | null;
  divisionName?: string | null;
  modulesCount?: number;
  groupsCount?: number;
  groupIds?: number[];
}

export interface CourseFormData {
  idUniversity: number;
  idDivision?: number | null;
  courseCode: string;
  courseName: string;
  semester?: string | null;
  status: boolean;
}

export interface CourseModule {
  idModule: number;
  idCourse: number;
  moduleNumber: number;
  title: string;
  startDate?: string | null;
  endDate?: string | null;
}

export interface CourseModuleFormData {
  idCourse: number;
  moduleNumber: number;
  title: string;
  startDate?: string | null;
  endDate?: string | null;
}
