"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getUsersByUniversity,
  getUserById,
  updateUserProfile,
  updateUserStatus,
} from "@/services/user.service";
import { getFileUrl } from "@/services/storage.service";
import { UserRole } from "@/types/roles";
import type { User } from "@/types/user";

interface UserWithImage extends User {
  profileImageUrl?: string;
  fullName: string;
}

/**
 * Hook personalizado para manejar usuarios:
 * - Carga con control de roles (ADMIN ve todos excepto ADMIN, COORDINATOR ve TUTOR, TEACHER, STUDENT)
 * - Búsqueda, paginación y filtrado por rol
 * - Edición de usuarios (sin contraseña ni rol)
 * - Cambio de estado
 * - Manejo de modal y notificaciones
 */
export function useUser() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    type: "success" | "error";
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithImage | null>(null);

  const usersPerPage = 8;

  // Helper function to load user profile image
  const loadUserImage = async (profileImage?: string) => {
    if (!profileImage) return undefined;
    
    try {
      const url = await getFileUrl(profileImage);
      return url || undefined;
    } catch (error) {
      console.error("Error loading user image:", error);
      return undefined;
    }
  };

  // Filter users based on current user role
  const filterUsersByRole = (allUsers: User[]) => {
    if (user?.role === UserRole.ADMIN) {
      // ADMIN can see all users except other ADMINs
      return allUsers.filter(u => u.role !== UserRole.ADMIN);
    } else if (user?.role === UserRole.COORDINATOR) {
      // COORDINATOR can only see TUTOR, TEACHER, and STUDENT
      return allUsers.filter(u => 
        [UserRole.TUTOR, UserRole.TEACHER, UserRole.STUDENT].includes(u.role as UserRole)
      );
    }
    
    // Default: return empty array for other roles
    return [];
  };

  // Load users data
  useEffect(() => {
    if (!user?.idUniversity) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const allUsers = await getUsersByUniversity(user.idUniversity);
        
        // Filter users based on current user role
        const filteredUsers = filterUsersByRole(allUsers);
        
        // Load profile images and format user data
        const usersWithImages = await Promise.all(
          filteredUsers.map(async (userData) => {
            const profileImageUrl = await loadUserImage(userData.profileImage);
            
            return {
              ...userData,
              profileImageUrl,
              fullName: `${userData.firstName} ${userData.lastName}`,
            };
          })
        );

        setUsers(usersWithImages);
      } catch (err: any) {
        console.error("Error loading users:", err);
        setToast({
          title: "Error de carga",
          description: err?.message || "No se pudieron cargar los usuarios.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.idUniversity, user?.role]);

  // Filtering and pagination
  const filteredUsers = users.filter(userData => {
    const matchesSearch = 
      userData.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userData.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userData.enrollmentNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === "all" || userData.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  // Get unique roles for filter (only from available users)
  const availableRoles = [...new Set(users.map(u => u.role))].sort();

  // Update user status (activate/deactivate)
  const handleToggleStatus = async (idUser: number, currentStatus: boolean) => {
    try {
      const updated = await updateUserStatus(idUser, !currentStatus);

      setUsers(prev =>
        prev.map(u => (u.idUser === idUser ? { ...u, status: updated.status } : u))
      );

      setToast({
        title: updated.status ? "Usuario activado" : "Usuario desactivado",
        description: `El usuario fue ${
          updated.status ? "activado" : "desactivado"
        } correctamente.`,
        type: "success",
      });
    } catch (err: any) {
      console.error("Error updating user status:", err);
      setToast({
        title: "Error al actualizar estado",
        description: err?.message || "No se pudo cambiar el estado del usuario.",
        type: "error",
      });
    }
  };

  // Update user profile (without password and role)
  const handleUpdateUser = async (idUser: number, data: Partial<User>) => {
    try {
      setFormLoading(true);
      
      // Exclude password and role from update data
      const { role, ...updateData } = data as any;
      
      const updated = await updateUserProfile(idUser, updateData);
      
      // Reload user image if profile image was updated
      const profileImageUrl = await loadUserImage(updated.profileImage);
      
      setUsers(prev =>
        prev.map(u =>
          u.idUser === idUser
            ? {
                ...updated,
                profileImageUrl,
                fullName: `${updated.firstName} ${updated.lastName}`,
              }
            : u
        )
      );

      setToast({
        title: "Usuario actualizado",
        description: "Los cambios se guardaron correctamente.",
        type: "success",
      });
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error updating user:", err);
      setToast({
        title: "Error al actualizar usuario",
        description: err?.message || "No se pudieron aplicar los cambios.",
        type: "error",
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Change role filter
  const handleRoleChange = (role: string | "all") => {
    setSelectedRole(role);
    setCurrentPage(1);
  };

  // Open modal for editing
  const handleEdit = (userData: UserWithImage) => {
    setSelectedUser(userData);
    setIsModalOpen(true);
  };

  // Hide toast automatically after 4s
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return {
    // Data
    users: currentUsers,
    filteredUsers,
    totalUsers: filteredUsers.length,
    availableRoles,
    
    // Pagination
    currentPage,
    totalPages,
    setCurrentPage,
    
    // Filters
    searchTerm,
    selectedRole,
    setSearchTerm,
    handleRoleChange,
    
    // Modal & Form
    isModalOpen,
    setIsModalOpen,
    selectedUser,
    formLoading,
    
    // Actions
    handleUpdateUser,
    handleEdit,
    handleToggleStatus,
    
    // State
    loading,
    toast,
    setToast,
    
    // User role info (for UI decisions)
    userRole: user?.role,
    canEditUsers: user?.role === UserRole.ADMIN || user?.role === UserRole.COORDINATOR,
  };
}