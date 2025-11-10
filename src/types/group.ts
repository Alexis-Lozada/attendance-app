export interface Group {
  idGroup: number;
  idProgram: number;
  idTutor: number;
  groupCode: string;
  semester: string;
  academicYear: string;
  enrollmentCount: number;
  status: boolean;
}

export interface GroupWithDetails extends Group {
  programName?: string;
  programCode?: string;
  divisionName?: string;
  tutorName?: string;
  tutorImage?: string;
}

export interface GroupFormData {
  idProgram: number;
  idTutor: number;
  groupCode: string;
  semester: string;
  academicYear: string;
  status: boolean;
}