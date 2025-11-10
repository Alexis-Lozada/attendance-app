// Enum con los roles reconocidos por el sistema
export enum UserRole {
  ADMIN = "ADMIN",
  COORDINATOR = "COORDINATOR",
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
  USER = "USER",
}

// Etiquetas legibles para mostrar en la UI
export const RoleLabels: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Administrador",
  [UserRole.COORDINATOR]: "Coordinador",
  [UserRole.STUDENT]: "Estudiante",
  [UserRole.TEACHER]: "Profesor",
  [UserRole.USER]: "Usuario",
};
