import { usersApi } from "@/services/api";

export interface UserResponseDTO {
  idUser: number;
  idUniversity: number;
  firstName: string;
  lastName: string;
  profileImage?: string;
  email: string;
  role: string;
  status: boolean;
}

export async function getUsersByUniversity(idUniversity: number): Promise<UserResponseDTO[]> {
  const { data } = await usersApi.get(`/users/university/${idUniversity}`);
  return data;
}
