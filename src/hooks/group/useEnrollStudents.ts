"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getEnrollmentsByGroup,
  createEnrollment,
  deleteEnrollment,
} from "@/services/enrollment.service";
import { getUsersByUniversity, getUserById } from "@/services/user.service";
import { getFileUrl } from "@/services/storage.service";
import { UserRole } from "@/types/roles";
import type { GroupWithDetails } from "@/types/group";

interface EnrolledStudent {
  idEnrollment: number;
  idStudent: number;
  studentName: string;
  enrollmentDate: string;
  status: boolean;
  profileImageUrl?: string;
  email?: string;
}

interface AvailableStudent {
  idUser: number;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl?: string;
}

interface UseEnrollStudentsReturn {
  // State
  isModalOpen: boolean;
  selectedGroup: GroupWithDetails | null;
  enrolledStudents: EnrolledStudent[];
  availableStudents: AvailableStudent[];
  loading: boolean;
  
  // Actions
  openModal: (group: GroupWithDetails) => void;
  closeModal: () => void;
  enrollStudent: (idStudent: number) => Promise<void>;
  removeStudent: (idEnrollment: number) => Promise<void>;
  
  // Callbacks
  onEnrollmentChange?: (idGroup: number) => void;
  setOnEnrollmentChange: (callback: (idGroup: number) => void) => void;
  
  // Toast
  toast: {
    title: string;
    description?: string;
    type: "success" | "error";
  } | null;
  setToast: (toast: { title: string; description?: string; type: "success" | "error" } | null) => void;
}

/**
 * Hook personalizado para manejar la inscripción de estudiantes a grupos
 */
export function useEnrollStudents(): UseEnrollStudentsReturn {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupWithDetails | null>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<EnrolledStudent[]>([]);
  const [availableStudents, setAvailableStudents] = useState<AvailableStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [onEnrollmentChange, setOnEnrollmentChange] = useState<((idGroup: number) => void) | undefined>();
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    type: "success" | "error";
  } | null>(null);

  // Load enrolled students when group is selected
  const loadEnrolledStudents = async (idGroup: number) => {
    try {
      setLoading(true);
      const enrollments = await getEnrollmentsByGroup(idGroup);
      
      // Load detailed student information
      const studentsWithDetails = await Promise.all(
        enrollments.map(async (enrollment) => {
          try {
            const student = await getUserById(enrollment.idStudent);
            let profileImageUrl: string | undefined = undefined;
            
            if (student.profileImage) {
              const url = await getFileUrl(student.profileImage);
              profileImageUrl = url || undefined;
            }
            
            return {
              idEnrollment: enrollment.idEnrollment,
              idStudent: enrollment.idStudent,
              studentName: enrollment.studentName,
              enrollmentDate: enrollment.enrollmentDate,
              status: enrollment.status,
              profileImageUrl,
              email: student.email,
            };
          } catch (error) {
            console.error(`Error loading student ${enrollment.idStudent}:`, error);
            return {
              idEnrollment: enrollment.idEnrollment,
              idStudent: enrollment.idStudent,
              studentName: enrollment.studentName,
              enrollmentDate: enrollment.enrollmentDate,
              status: enrollment.status,
            };
          }
        })
      );
      
      setEnrolledStudents(studentsWithDetails);
    } catch (error: any) {
      console.error("Error loading enrolled students:", error);
      setToast({
        title: "Error de carga",
        description: error?.message || "No se pudieron cargar los estudiantes inscritos.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load available students (not enrolled in this group)
  const loadAvailableStudents = async (idGroup: number) => {
    if (!user?.idUniversity) return;
    
    try {
      setLoading(true);
      
      // Get all active students from the university
      const allUsers = await getUsersByUniversity(user.idUniversity, true);
      const students = allUsers.filter(u => u.role === UserRole.STUDENT && u.status);
      
      // Get enrolled students for this group
      const enrollments = await getEnrollmentsByGroup(idGroup);
      const enrolledIds = new Set(enrollments.map(e => e.idStudent));
      
      // Filter out already enrolled students
      const availableStudentsList = students.filter(s => !enrolledIds.has(s.idUser));
      
      // Load profile images
      const studentsWithImages = await Promise.all(
        availableStudentsList.map(async (student) => {
          let profileImageUrl: string | undefined = undefined;
          
          if (student.profileImage) {
            const url = await getFileUrl(student.profileImage);
            profileImageUrl = url || undefined;
          }
          
          return {
            idUser: student.idUser,
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            profileImageUrl,
          };
        })
      );
      
      setAvailableStudents(studentsWithImages);
    } catch (error: any) {
      console.error("Error loading available students:", error);
      setToast({
        title: "Error de carga",
        description: error?.message || "No se pudieron cargar los estudiantes disponibles.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Open modal and load data
  const openModal = async (group: GroupWithDetails) => {
    setSelectedGroup(group);
    setIsModalOpen(true);
    
    // Load both enrolled and available students
    await Promise.all([
      loadEnrolledStudents(group.idGroup),
      loadAvailableStudents(group.idGroup),
    ]);
  };

  // Close modal and reset state
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGroup(null);
    setEnrolledStudents([]);
    setAvailableStudents([]);
  };

  // Enroll a student in the group
  const enrollStudent = async (idStudent: number, onSuccess?: () => void) => {
    if (!selectedGroup) return;
    
    try {
      const enrollment = await createEnrollment({
        idStudent,
        idGroup: selectedGroup.idGroup,
        status: true,
      });
      
      // Move student from available to enrolled
      const student = availableStudents.find(s => s.idUser === idStudent);
      if (student) {
        setEnrolledStudents(prev => [
          ...prev,
          {
            idEnrollment: enrollment.idEnrollment,
            idStudent: enrollment.idStudent,
            studentName: `${student.firstName} ${student.lastName}`,
            enrollmentDate: enrollment.enrollmentDate,
            status: enrollment.status,
            profileImageUrl: student.profileImageUrl,
            email: student.email,
          },
        ]);
        
        setAvailableStudents(prev => prev.filter(s => s.idUser !== idStudent));
        
        setToast({
          title: "Estudiante inscrito",
          description: `${student.firstName} ${student.lastName} fue inscrito exitosamente.`,
          type: "success",
        });
        
        // Call callback to update parent component
        if (onEnrollmentChange) {
          onEnrollmentChange(selectedGroup.idGroup);
        }
      }
    } catch (error: any) {
      console.error("Error enrolling student:", error);
      setToast({
        title: "Error al inscribir",
        description: error?.message || "No se pudo inscribir al estudiante.",
        type: "error",
      });
    }
  };

  // Remove a student from the group
  const removeStudent = async (idEnrollment: number) => {
    if (!selectedGroup) return;
    
    try {
      await deleteEnrollment(idEnrollment);
      
      // Move student from enrolled back to available
      const student = enrolledStudents.find(s => s.idEnrollment === idEnrollment);
      if (student) {
        setEnrolledStudents(prev => prev.filter(s => s.idEnrollment !== idEnrollment));
        
        setAvailableStudents(prev => [
          ...prev,
          {
            idUser: student.idStudent,
            firstName: student.studentName.split(" ")[0] || "",
            lastName: student.studentName.split(" ").slice(1).join(" ") || "",
            email: student.email || "",
            profileImageUrl: student.profileImageUrl,
          },
        ]);
        
        setToast({
          title: "Inscripción eliminada",
          description: `${student.studentName} fue removido del grupo.`,
          type: "success",
        });
      }
    } catch (error: any) {
      console.error("Error removing student:", error);
      setToast({
        title: "Error al eliminar",
        description: error?.message || "No se pudo eliminar la inscripción.",
        type: "error",
      });
    }
  };

  // Auto-hide toast after 4 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Memoizar la función setter para evitar loops infinitos
  const handleSetOnEnrollmentChange = useCallback((callback: (idGroup: number) => void) => {
    setOnEnrollmentChange(() => callback);
  }, []);

  return {
    isModalOpen,
    selectedGroup,
    enrolledStudents,
    availableStudents,
    loading,
    openModal,
    closeModal,
    enrollStudent,
    removeStudent,
    onEnrollmentChange,
    setOnEnrollmentChange: handleSetOnEnrollmentChange,
    toast,
    setToast,
  };
}