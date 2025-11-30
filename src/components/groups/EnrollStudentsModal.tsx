"use client";

import { useState, useEffect } from "react";
import { X, Search, UserPlus, User } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
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

interface Props {
  isOpen: boolean;
  onClose: () => void;
  group: GroupWithDetails | null;
  enrolledStudents: EnrolledStudent[];
  availableStudents: AvailableStudent[];
  onEnrollStudent: (idStudent: number) => Promise<void>;
  loading?: boolean;
}

export default function EnrollStudentsModal({
  isOpen,
  onClose,
  group,
  enrolledStudents,
  availableStudents,
  onEnrollStudent,
  loading = false,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"enrolled" | "available">("enrolled");
  const [processingStudents, setProcessingStudents] = useState<Set<number>>(new Set());

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setActiveTab("enrolled");
      setProcessingStudents(new Set());
    }
  }, [isOpen]);

  if (!group) return null;

  const handleEnroll = async (idStudent: number) => {
    setProcessingStudents((prev) => new Set(prev).add(idStudent));
    try {
      await onEnrollStudent(idStudent);
    } finally {
      setProcessingStudents((prev) => {
        const newSet = new Set(prev);
        newSet.delete(idStudent);
        return newSet;
      });
    }
  };

  // Filter students based on search
  const filteredEnrolled = enrolledStudents.filter((student) =>
    student.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAvailable = availableStudents.filter((student) => {
    const fullName = `${student.firstName} ${student.lastName}`;
    return (
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Inscribir Estudiantes - ${group.groupCode}`}
    >
      <div className="space-y-3">
        {/* Group Info */}
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Grupo:</span>
              <span className="ml-2 font-medium text-gray-900">{group.groupCode}</span>
            </div>
            <div>
              <span className="text-gray-500">Programa:</span>
              <span className="ml-2 font-medium text-gray-900">{group.programCode}</span>
            </div>
            <div>
              <span className="text-gray-500">Semestre:</span>
              <span className="ml-2 font-medium text-gray-900">{group.semester}°</span>
            </div>
            <div>
              <span className="text-gray-500">Tutor:</span>
              <span className="ml-2 font-medium text-gray-900">{group.tutorName}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("enrolled")}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === "enrolled"
                ? "text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Inscritos ({enrolledStudents.length})
            {activeTab === "enrolled" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("available")}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === "available"
                ? "text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Disponibles ({availableStudents.length})
            {activeTab === "available" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              activeTab === "enrolled"
                ? "Buscar estudiantes inscritos..."
                : "Buscar estudiantes disponibles..."
            }
            className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>

        {/* Content */}
        <div className="max-h-[280px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner text="Cargando estudiantes..." />
            </div>
          ) : (
            <>
              {/* Enrolled Students Tab */}
              {activeTab === "enrolled" && (
                <div className="space-y-2">
                  {filteredEnrolled.length === 0 ? (
                    <div className="text-center py-8">
                      <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">
                        {searchTerm
                          ? "No se encontraron estudiantes inscritos con ese criterio."
                          : "No hay estudiantes inscritos en este grupo."}
                      </p>
                      {!searchTerm && (
                        <button
                          onClick={() => setActiveTab("available")}
                          className="mt-3 text-sm text-primary hover:underline"
                        >
                          Ver estudiantes disponibles
                        </button>
                      )}
                    </div>
                  ) : (
                    filteredEnrolled.map((student) => (
                      <div
                        key={student.idEnrollment}
                        className="flex items-center justify-between p-2.5 bg-white border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          {student.profileImageUrl ? (
                            <img
                              src={student.profileImageUrl}
                              alt={student.studentName}
                              className="w-9 h-9 rounded-md object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-md bg-gray-200 flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-gray-500" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {student.studentName}
                            </p>
                            {student.email && (
                              <p className="text-xs text-gray-500 truncate">{student.email}</p>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs text-gray-400">
                              {new Date(student.enrollmentDate).toLocaleDateString('es-MX', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Available Students Tab */}
              {activeTab === "available" && (
                <div className="space-y-2">
                  {filteredAvailable.length === 0 ? (
                    <div className="text-center py-8">
                      <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">
                        {searchTerm
                          ? "No se encontraron estudiantes disponibles con ese criterio."
                          : "No hay estudiantes disponibles para inscribir."}
                      </p>
                    </div>
                  ) : (
                    filteredAvailable.map((student) => (
                      <div
                        key={student.idUser}
                        className="flex items-center justify-between p-2.5 bg-white border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          {student.profileImageUrl ? (
                            <img
                              src={student.profileImageUrl}
                              alt={`${student.firstName} ${student.lastName}`}
                              className="w-9 h-9 rounded-md object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-md bg-gray-200 flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-gray-500" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {student.firstName} {student.lastName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{student.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleEnroll(student.idUser)}
                          disabled={processingStudents.has(student.idUser)}
                          className="ml-3 flex items-center gap-2 px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingStudents.has(student.idUser) ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4" />
                              Inscribir
                            </>
                          )}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="border border-gray-300 text-gray-700 text-sm font-medium rounded-md px-4 py-2 hover:bg-gray-100 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}