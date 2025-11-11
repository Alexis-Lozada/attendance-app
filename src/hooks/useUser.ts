"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUsersByUniversity, getUserById, updateUserProfile } from "@/services/user.service";
import { getFileUrl } from "@/services/storage.service";
import { UserRole } from "@/types/roles";
import type { UserWithDetails, UserFormData } from "@/types/user";

/**
 * Custom hook for user management:
 * - Loading users with role-based access control
 * - Search, pagination, and filtering by role
 * - Creation and editing of users
 * - Status management (activate/deactivate)
 * - Modal and toast notifications handling
 * - Profile image loading
 */
export function useUser() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    type: "success" | "error";
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(null);

  const usersPerPage = 5;

  // Helper function to load profile image
  const loadProfileImage = async (profileImageUuid?: string): Promise<string | undefined> => {
    if (!profileImageUuid) return undefined;
    
    try {
      const url = await getFileUrl(profileImageUuid);
      return url || undefined;
    } catch (error) {
      console.error("Error loading profile image:", error);
      return undefined;
    }
  };

  // Load users with role-based access control
  useEffect(() => {
    if (!user?.idUniversity) return;

    const loadUsers = async () => {
      try {
        setLoading(true);
        const usersData = await getUsersByUniversity(user.idUniversity);
        
        // Load profile images and additional data
        const usersWithDetails = await Promise.all(
          usersData.map(async (userData) => {
            const profileImageUrl = await loadProfileImage(userData.profileImage);
            
            return {
              ...userData,
              profileImageUrl,
              fullName: `${userData.firstName} ${userData.lastName}`,
            };
          })
        );

        // Filter users based on current user's role and academic hierarchy
        let filteredUsers = usersWithDetails;
        
        switch (user.role) {
          case UserRole.ADMIN:
            // Admins can see everyone - no filtering
            break;
            
          case UserRole.COORDINATOR:
            // Coordinators can see users from their academic division
            filteredUsers = usersWithDetails.filter(u => 
              u.role === UserRole.STUDENT || 
              u.role === UserRole.TUTOR || 
              u.role === UserRole.TEACHER || // Coordinators manage teachers in their division
              u.idUser === user.idUser
            );
            break;
            
          case UserRole.TUTOR:
            // Tutors can see students in their assigned groups
            filteredUsers = usersWithDetails.filter(u => 
              u.role === UserRole.STUDENT || 
              u.idUser === user.idUser
            );
            break;
            
          case UserRole.TEACHER:
            // Teachers can see students in their courses
            filteredUsers = usersWithDetails.filter(u => 
              u.role === UserRole.STUDENT || 
              u.idUser === user.idUser
            );
            break;
            
          case UserRole.STUDENT:
            // Students can only see their own profile and basic info of classmates
            filteredUsers = usersWithDetails.filter(u => 
              u.idUser === user.idUser ||
              (u.role === UserRole.STUDENT && u.status) // Only active students
            );
            break;
            
          default:
            // Basic users can only see their own profile
            filteredUsers = usersWithDetails.filter(u => u.idUser === user.idUser);
        }

        setUsers(filteredUsers);
      } catch (err: any) {
        console.error("Error loading users:", err);
        setToast({
          title: "Error al cargar usuarios",
          description: err?.message || "No se pudieron cargar los usuarios del sistema.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [user?.idUniversity, user?.role, user?.idUser]);

  // Filtering and pagination
  const filteredUsers = users.filter(userData => {
    const matchesSearch = 
      userData.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userData.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  // Get unique roles for filter (only roles present in the data)
  const availableRoles = [...new Set(users.map(u => u.role))] as UserRole[];

  // Create user (mock implementation)
  const handleCreateUser = async (data: UserFormData) => {
    try {
      setFormLoading(true);
      
      // Mock API call - in reality this would call createUser service
      console.log("Creating user:", data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock new user data
      const newUser: UserWithDetails = {
        idUser: Math.max(...users.map(u => u.idUser)) + 1,
        idUniversity: user?.idUniversity || 1,
        email: data.email,
        enrollmentNumber: data.enrollmentNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        status: data.status,
        fullName: `${data.firstName} ${data.lastName}`,
        createdAt: new Date().toISOString(),
      };

      setUsers(prev => [...prev, newUser]);
      setToast({
        title: "Usuario creado",
        description: "El nuevo usuario se agregó exitosamente al sistema.",
        type: "success",
      });
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error creating user:", err);
      setToast({
        title: "Error al crear usuario",
        description: err?.message || "No se pudo registrar el nuevo usuario.",
        type: "error",
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Update user (mock implementation)
  const handleUpdateUser = async (idUser: number, data: UserFormData) => {
    try {
      setFormLoading(true);
      
      // Mock API call - in reality this would call updateUser service
      console.log("Updating user:", idUser, data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUsers(prev =>
        prev.map(u =>
          u.idUser === idUser
            ? {
                ...u,
                email: data.email,
                enrollmentNumber: data.enrollmentNumber,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role,
                status: data.status,
                fullName: `${data.firstName} ${data.lastName}`,
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

  // Toggle user status (mock implementation)
  const handleToggleStatus = async (idUser: number, currentStatus: boolean) => {
    try {
      // Mock API call - in reality this would call updateUserStatus service
      console.log("Toggling user status:", idUser, !currentStatus);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      setUsers(prev =>
        prev.map(u => (u.idUser === idUser ? { ...u, status: !currentStatus } : u))
      );

      setToast({
        title: !currentStatus ? "Usuario activado" : "Usuario desactivado",
        description: `El usuario fue ${
          !currentStatus ? "activado" : "desactivado"
        } correctamente.`,
        type: "success",
      });
    } catch (err: any) {
      console.error("Error toggling user status:", err);
      setToast({
        title: "Error al actualizar estado",
        description: err?.message || "No se pudo cambiar el estado del usuario.",
        type: "error",
      });
    }
  };

  // Save user (create or update)
  const handleSaveUser = async (data: UserFormData, idUser?: number) => {
    if (idUser) {
      await handleUpdateUser(idUser, data);
    } else {
      await handleCreateUser(data);
    }
  };

  // Change role filter
  const handleRoleChange = (role: UserRole | "all") => {
    setSelectedRole(role);
    setCurrentPage(1);
  };

  // Open modal for editing
  const handleEdit = (userData: UserWithDetails) => {
    setSelectedUser(userData);
    setIsModalOpen(true);
  };

  // Open modal for creating
  const handleOpenAdd = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  // Auto-hide toast after 4s
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
    handleSaveUser,
    handleToggleStatus,
    handleEdit,
    handleOpenAdd,
    
    // State
    loading,
    toast,
    setToast,
    
    // User role info (for UI decisions)
    userRole: user?.role,
  };
}