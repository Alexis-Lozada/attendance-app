export interface Program {
  idProgram: number;
  idDivision: number;
  programCode: string;
  programName: string;
  description: string;
  status: boolean;
}

export interface ProgramWithDivision extends Program {
  divisionName?: string;
  divisionCode?: string;
}

export interface ProgramFormData {
  idDivision: number;
  programCode: string;
  programName: string;
  description: string;
  status: boolean;
}