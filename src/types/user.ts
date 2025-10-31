export interface User {
  idUser: number;
  idUniversity: number;
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