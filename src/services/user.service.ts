import { usersApi } from "@/services/api";

export interface UserResponseDTO {
  idUser: number;
  idUniversity: number;
  firstName: string;
  lastName: string;
  profileImage?: string;
  email: string;
  enrollmentNumber?: string
  role: string;
  status: boolean;
  createdAt?: string;
}
// Obtener usuarios por universidad
export async function getUsersByUniversity(idUniversity: number): Promise<UserResponseDTO[]> {
  const { data } = await usersApi.get(`/users/university/${idUniversity}`);
  return data;
}

// Obtener un usuario por ID
export async function getUserById(idUser: number): Promise<UserResponseDTO> {
  const { data } = await usersApi.get(`/users/${idUser}`);
  return data;
}

export async function updateUserProfile(idUser: number, data: Partial<UserResponseDTO>): Promise<UserResponseDTO> {
  const { data: updated } = await usersApi.put(`/users/${idUser}`, data);
  return updated;
}
