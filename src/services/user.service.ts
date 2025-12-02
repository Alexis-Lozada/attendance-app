import { api } from "@/services/api";
import type { User } from "@/types/user";

// === Obtener usuarios de una universidad (opcionalmente solo activos) ===
export async function getUsersByUniversity(
  idUniversity: number,
  active?: boolean
): Promise<User[]> {
  const { data } = await api.get(`/user/university/${idUniversity}`, {
    params: active !== undefined ? { active } : {},
  });
  return data;
}

// === Obtener un usuario por su ID ===
export async function getUserById(idUser: number): Promise<User> {
  const { data } = await api.get(`/user/${idUser}`);
  return data;
}

// === Crear un nuevo usuario ===
export async function createUser(payload: Partial<User> & { password: string }): Promise<User> {
  const { data } = await api.post(`/user`, payload);
  return data;
}

// === Actualizar información del perfil ===
export async function updateUserProfile(idUser: number, payload: Partial<User>): Promise<User> {
  const { data } = await api.put(`/user/${idUser}`, payload);
  return data;
}

// === Cambiar estatus del usuario (activar/desactivar) ===
export async function updateUserStatus(idUser: number, status: boolean): Promise<User> {
  const { data } = await api.put(`/user/${idUser}/status`, null, {
    params: { status },
  });
  return data;
}

// === Cambiar contraseña de usuario ===
export async function changeUserPassword(
  idUser: number,
  payload: { currentPassword: string; newPassword: string }
): Promise<{ message: string }> {
  const { data } = await api.put(`/user/${idUser}/change-password`, payload);
  return data;
}
