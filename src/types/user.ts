export interface User {
  idUser: number;
  idUniversity: number;
  idDivision: number | null;
  idProgram: number | null;
  email: string;
  enrollmentNumber: string | null;
  firstName: string;
  lastName: string;
  role: string;
  status: boolean;
  profileImage?: string;
  lastLogin?: string;
  createdAt?: string;
}
