"use client";

import { 
  Plus, 
  Users, 
  GraduationCap, 
  Calendar, 
  Hash,
  SlidersHorizontal, 
  MoreVertical, 
  Edit2,
  UserCheck,
  BookOpen,
  User
} from "lucide-react";

import Table, { TableColumn } from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import Toast from "@/components/ui/Toast";
import Switch from "@/components/ui/Switch";
import Spinner from "@/components/ui/Spinner";
import GroupForm from "@/components/groups/GroupForm";
import { useGroup } from "@/hooks/useGroup";
import { UserRole, RoleLabels } from "@/types/roles";
import type { GroupWithDetails } from "@/types/group";

export default function GroupsPage() {
  const {
    // Data
    groups,
    programs,
    tutors,
    filteredGroups,
    totalGroups,
    uniqueSemesters,
    
    // Pagination
    currentPage,
    totalPages,
    setCurrentPage,
    
    // Filters
    searchTerm,
    selectedProgram,
    selectedSemester,
    setSearchTerm,
    handleProgramChange,
    handleSemesterChange,
    
    // Modal & Form
    isModalOpen,
    setIsModalOpen,
    selectedGroup,
    formLoading,
    
    // Actions
    handleSaveGroup,
    handleToggleStatus,
    handleEdit,
    handleOpenAdd,
    
    // State
    loading,
    toast,
    setToast,
    userRole,
  } = useGroup();

  if (loading) return <Spinner text="Cargando grupos académicos..." fullScreen />;

  // Table columns configuration
  const columns: TableColumn<GroupWithDetails>[] = [
    { 
      key: "groupCode", 
      label: "Código de Grupo", 
      icon: <Hash size={16} />,
      render: (item) => (
        <div>
          <p className="font-medium text-gray-900">{item.groupCode}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {item.programCode} • Semestre {item.semester}
          </p>
        </div>
      )
    },
    {
      key: "program",
      label: "Programa Educativo",
      icon: <GraduationCap size={16} />,
      render: (item) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-900 font-medium">{item.programCode}</p>
          <p className="text-xs text-gray-500 truncate" title={item.programName}>
            {item.programName}
          </p>
          {item.divisionName && (
            <p className="text-xs text-gray-400 mt-0.5">División: {item.divisionName}</p>
          )}
        </div>
      )
    },
    {
      key: "tutor",
      label: "Tutor Asignado",
      icon: <UserCheck size={16} />,
      render: (item) => (
        <div className="flex items-center gap-3">
          {item.tutorImage ? (
            <img
              src={item.tutorImage}
              alt={item.tutorName || "Tutor"}
              className="w-8 h-8 rounded-md object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-md bg-gray-200 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-gray-500" />
            </div>
          )}
          <span className="text-sm text-gray-700">{item.tutorName}</span>
        </div>
      )
    },
    {
      key: "enrollment",
      label: "Estudiantes",
      icon: <BookOpen size={16} />,
      align: "center",
      render: (item) => (
        <div className="text-center">
          <span className="text-sm font-medium text-gray-900">
            {item.enrollmentCount || 0}
          </span>
          <p className="text-xs text-gray-500">inscritos</p>
        </div>
      )
    },
    {
      key: "academicYear",
      label: "Período",
      icon: <Calendar size={16} />,
      align: "center",
      render: (item) => (
        <span className="text-sm text-gray-700">{item.academicYear}</span>
      )
    },
    {
      key: "status",
      label: "Status",
      icon: <SlidersHorizontal size={16} />,
      align: "center",
      render: (item) => (
        <Switch
          checked={item.status}
          onChange={() => handleToggleStatus(item.idGroup, item.status)}
        />
      ),
    },
    {
      key: "actions",
      label: "Acciones",
      icon: <MoreVertical size={16} />,
      align: "center",
      render: (item) => (
        <div className="flex justify-center gap-2">
          <button
            title="Editar"
            onClick={() => handleEdit(item)}
            className="text-gray-600 hover:text-primary transition"
          >
            <Edit2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Toast notifications */}
      {toast && (
        <Toast
          title={toast.title}
          description={toast.description}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Page header */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900">
            Administración de Grupos Académicos
          </h3>
          <p className="text-[13px] text-gray-500">
            Gestiona los grupos de estudiantes organizados por programa educativo y semestre.
            {userRole === UserRole.COORDINATOR && (
              <span className="block mt-1 text-primary">
                Mostrando solo grupos de los programas de tu división.
              </span>
            )}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto px-5 py-2.5 bg-primary text-white rounded-lg flex items-center justify-center gap-2 hover:brightness-95 text-sm font-medium transition"
        >
          <Plus size={18} />
          Nuevo grupo
        </button>
      </header>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Program filter */}
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Programa:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleProgramChange("all")}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                selectedProgram === "all"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todos los programas
            </button>
            
            {programs.map((program) => (
              <button
                key={program.idProgram}
                onClick={() => handleProgramChange(program.idProgram)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  selectedProgram === program.idProgram
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title={program.programName}
              >
                {program.programCode}
              </button>
            ))}
          </div>

          {/* Semester filter */}
          {uniqueSemesters.length > 0 && (
            <>
              <div className="flex items-center gap-2 lg:ml-6">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Semestre:</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSemesterChange("all")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                    selectedSemester === "all"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Todos
                </button>
                
                {uniqueSemesters.map((semester) => (
                  <button
                    key={semester}
                    onClick={() => handleSemesterChange(semester)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                      selectedSemester === semester
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {semester}°
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Active filters info */}
        {(selectedProgram !== "all" || selectedSemester !== "all") && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              Mostrando grupos de: {" "}
              {selectedProgram !== "all" && (
                <span className="font-medium text-gray-700">
                  {programs.find(p => p.idProgram === selectedProgram)?.programName}
                </span>
              )}
              {selectedProgram !== "all" && selectedSemester !== "all" && " • "}
              {selectedSemester !== "all" && (
                <span className="font-medium text-gray-700">
                  Semestre {selectedSemester}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Total Grupos</p>
              <p className="text-2xl font-semibold text-gray-900">{totalGroups}</p>
              {filteredGroups.length !== totalGroups && (
                <p className="text-xs text-gray-500">
                  de {filteredGroups.length} filtrados
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Activos</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredGroups.filter(g => g.status).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Estudiantes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredGroups.reduce((sum, g) => sum + (g.enrollmentCount || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Groups table */}
      <Table
        title={
          selectedProgram === "all" && selectedSemester === "all"
            ? "Grupos Académicos Registrados"
            : "Grupos Filtrados"
        }
        columns={columns}
        data={groups}
        currentPage={currentPage}
        totalPages={totalPages}
        currentItemsCount={groups.length}
        totalItemsCount={totalGroups}
        onPreviousPage={() => setCurrentPage(p => Math.max(p - 1, 1))}
        onNextPage={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
        onSearch={setSearchTerm}
        emptyMessage={
          selectedProgram === "all" && selectedSemester === "all"
            ? "No se encontraron grupos académicos."
            : "No se encontraron grupos con los filtros aplicados."
        }
      />

      {/* Modal for create/edit */}
      <Modal
        title={selectedGroup ? "Editar grupo académico" : "Agregar nuevo grupo"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <GroupForm
          initialData={selectedGroup}
          programs={programs}
          tutors={tutors}
          onSave={handleSaveGroup}
          onCancel={() => setIsModalOpen(false)}
          loading={formLoading}
        />
      </Modal>
    </>
  );
}