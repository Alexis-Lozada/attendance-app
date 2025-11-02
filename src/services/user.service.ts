import { usersApi } from "@/services/api";
import type { User } from "@/types/user";

// === Obtener todos los usuarios de una universidad ===
export async function getUsersByUniversity(idUniversity: number): Promise<User[]> {
  const { data } = await usersApi.get(`/users/university/${idUniversity}`);
  return data;
}

// === Obtener un usuario por su ID ===
export async function getUserById(idUser: number): Promise<User> {
  const { data } = await usersApi.get(`/users/${idUser}`);
  return data;
}

// === Actualizar información del perfil ===
export async function updateUserProfile(idUser: number, payload: Partial<User>): Promise<User> {
  const { data } = await usersApi.put(`/users/${idUser}`, payload);
  return data;
}

// === Cambiar contraseña de usuario ===
export async function changeUserPassword(
  idUser: number,
  payload: { currentPassword: string; newPassword: string }
): Promise<{ message: string }> {
  const { data } = await usersApi.put(`/users/${idUser}/change-password`, payload);
  return data;
}
