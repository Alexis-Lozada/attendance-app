export interface User {
  idUser: number;
  idUniversity: number;
  email: string;
  enrollmentNumber: string;
  firstName: string;
  lastName: string;
  role: string;
  status: boolean;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
