import { usersApi } from "@/services/api";
import type { User } from "@/types/user";

// === Obtener usuarios de una universidad (opcionalmente solo activos) ===
export async function getUsersByUniversity(
  idUniversity: number,
  active?: boolean
): Promise<User[]> {
  const { data } = await usersApi.get(`/user/university/${idUniversity}`, {
    params: active !== undefined ? { active } : {},
  });
  return data;
}

// === Obtener un usuario por su ID ===
export async function getUserById(idUser: number): Promise<User> {
  const { data } = await usersApi.get(`/user/${idUser}`);
  return data;
}

// === Actualizar información del perfil ===
export async function updateUserProfile(idUser: number, payload: Partial<User>): Promise<User> {
  const { data } = await usersApi.put(`/user/${idUser}`, payload);
  return data;
}

// === Cambiar estatus del usuario (activar/desactivar) ===
export async function updateUserStatus(idUser: number, status: boolean): Promise<User> {
  const { data } = await usersApi.put(`/user/${idUser}/status`, null, {
    params: { status },
  });
  return data;
}

// === Cambiar contraseña de usuario ===
export async function changeUserPassword(
  idUser: number,
  payload: { currentPassword: string; newPassword: string }
): Promise<{ message: string }> {
  const { data } = await usersApi.put(`/user/${idUser}/change-password`, payload);
  return data;
}
