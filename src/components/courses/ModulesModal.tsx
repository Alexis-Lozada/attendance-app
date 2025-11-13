"use client";

import { useState } from "react";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  FolderOpen, 
  Calendar,
  Hash,
  AlertCircle
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import ModuleForm from "@/components/courses/Moduleform";
import type { CourseModule, CourseModuleFormData } from "@/types/course";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  courseName: string;
  courseCode: string;
  idCourse: number;
  modules: CourseModule[];
  loading?: boolean;
  onSaveModule: (data: CourseModuleFormData, idModule?: number) => Promise<void>;
  onDeleteModule: (idModule: number) => Promise<void>;
}

export default function ModulesModal({
  isOpen,
  onClose,
  courseName,
  courseCode,
  idCourse,
  modules,
  loading = false,
  onSaveModule,
  onDeleteModule,
}: Props) {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Sort modules by module number
  const sortedModules = [...modules].sort((a, b) => a.moduleNumber - b.moduleNumber);

  const handleOpenCreate = () => {
    setSelectedModule(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (module: CourseModule) => {
    setSelectedModule(module);
    setIsFormModalOpen(true);
  };

  const handleSave = async (data: CourseModuleFormData, idModule?: number) => {
    try {
      setFormLoading(true);
      await onSaveModule(data, idModule);
      setIsFormModalOpen(false);
      setSelectedModule(null);
    } catch (error) {
      console.error("Error saving module:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (idModule: number) => {
    try {
      setFormLoading(true);
      await onDeleteModule(idModule);
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting module:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedModule(null);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Sin fecha";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Cuando el modal de formulario está abierto, no mostrar el modal principal
  if (isFormModalOpen) {
    return (
      <Modal
        title={selectedModule ? "Editar Módulo" : "Crear Nuevo Módulo"}
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
      >
        <ModuleForm
          initialData={selectedModule}
          idCourse={idCourse}
          existingModules={modules}
          onSave={handleSave}
          onCancel={handleCloseFormModal}
          loading={formLoading}
        />
      </Modal>
    );
  }

  // Modal principal de lista de módulos
  return (
    <Modal
      title={`Módulos del Curso: ${courseCode}`}
      isOpen={isOpen}
      onClose={onClose}
      size="large"
    >
      <div className="space-y-4">
        {/* Course Info Header */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">{courseName}</h4>
              <p className="text-xs text-gray-600 mt-1">Código: {courseCode}</p>
            </div>
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:brightness-95 transition"
            >
              <Plus size={16} />
              Nuevo Módulo
            </button>
          </div>
        </div>

        {/* Modules List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : sortedModules.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-4">
              Este curso aún no tiene módulos registrados
            </p>
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:brightness-95 transition"
            >
              <Plus size={16} />
              Crear Primer Módulo
            </button>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {sortedModules.map((module) => (
              <div
                key={module.idModule}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Module Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-2 py-1 rounded text-xs font-semibold">
                        <Hash size={12} />
                        Módulo {module.moduleNumber}
                      </div>
                    </div>
                    
                    <h5 className="font-medium text-gray-900 mb-2 text-sm">
                      {module.title}
                    </h5>

                    {/* Dates */}
                    {(module.startDate || module.endDate) && (
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        {module.startDate && (
                          <div className="flex items-center gap-1">
                            <Calendar size={12} className="text-gray-400" />
                            <span>Inicio: {formatDate(module.startDate)}</span>
                          </div>
                        )}
                        {module.endDate && (
                          <div className="flex items-center gap-1">
                            <Calendar size={12} className="text-gray-400" />
                            <span>Fin: {formatDate(module.endDate)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(module)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                      title="Editar módulo"
                    >
                      <Edit2 size={16} />
                    </button>
                    
                    {deleteConfirm === module.idModule ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(module.idModule)}
                          disabled={formLoading}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 text-xs font-medium"
                          title="Confirmar eliminación"
                        >
                          Sí
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          disabled={formLoading}
                          className="p-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition disabled:opacity-50 text-xs font-medium"
                          title="Cancelar"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(module.idModule)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Eliminar módulo"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Delete Confirmation Warning */}
                {deleteConfirm === module.idModule && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                      <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                      <span>
                        ¿Estás seguro de eliminar este módulo? Esta acción no se puede deshacer.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer Info */}
        {sortedModules.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Total de módulos: <span className="font-semibold text-gray-700">{sortedModules.length}</span>
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}