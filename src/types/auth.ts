export interface User {
  idUser: number;
  idUniversity: number;
  email: string;
  enrollmentNumber: string;
  firstName: string;
  lastName: string;
  role: string;
  status: boolean;
  profileImage?: string; // 👈 Agregado (opcional)
  lastLogin?: string;    // 👈 Ya que también lo usas en ProfilePage
  createdAt?: string; 
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
