"use client";

import { 
  Plus, 
  BookOpen, 
  CheckCircle2,
  Layers,
  Building2,
  Hash,
  SlidersHorizontal, 
  MoreVertical, 
  Edit2,
  Search,
  List
} from "lucide-react";

import Table, { TableColumn } from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import Toast from "@/components/ui/Toast";
import Switch from "@/components/ui/Switch";
import Spinner from "@/components/ui/Spinner";
import CourseForm from "@/components/courses/CourseForm";
import { useCourse } from "@/hooks/useCourse";
import { UserRole } from "@/types/roles";
import type { CourseWithDetails } from "@/types/course";

export default function CoursesPage() {
  const {
    // Data
    courses,
    divisions,
    filteredCourses,
    totalCourses,
    uniqueSemesters,
    
    // Pagination
    currentPage,
    totalPages,
    setCurrentPage,
    
    // Filters
    searchTerm,
    selectedDivision,
    selectedSemester,
    setSearchTerm,
    handleDivisionChange,
    handleSemesterChange,
    
    // Modal & Form
    isModalOpen,
    setIsModalOpen,
    selectedCourse,
    formLoading,
    
    // Actions
    handleSaveCourse,
    handleToggleStatus,
    handleEdit,
    handleOpenAdd,
    
    // State
    loading,
    toast,
    setToast,
    userRole,
  } = useCourse();

  if (loading) return <Spinner text="Cargando cursos académicos..." fullScreen />;

  // Calculate stats
  const activeCourses = filteredCourses.filter(c => c.status).length;
  const totalModules = filteredCourses.reduce((sum, course) => sum + (course.modulesCount || 0), 0);

  // Table columns configuration
  const columns: TableColumn<CourseWithDetails>[] = [
    { 
      key: "courseCode", 
      label: "Código", 
      icon: <Hash size={16} />,
      render: (item) => (
        <div className="min-w-[80px]">
          <span className="font-medium text-gray-900">{item.courseCode}</span>
          <p className="text-xs text-gray-500 mt-0.5">{item.semester ? `${item.semester}° semestre` : 'General'}</p>
        </div>
      )
    },
    { 
      key: "courseName", 
      label: "Nombre del Curso", 
      icon: <BookOpen size={16} />,
      render: (item) => (
        <div className="min-w-[200px]">
          <p className="font-medium text-gray-900">{item.courseName}</p>
          <p className="text-xs text-gray-500 mt-0.5">{item.divisionCode || 'General'}</p>
        </div>
      )
    },
    {
      key: "division",
      label: "División",
      icon: <Building2 size={16} />,
      render: (item) => (
        <div className="min-w-[150px]">
          <p className="text-sm font-medium text-gray-900">{item.divisionCode || 'N/A'}</p>
          <p className="text-xs text-gray-500 mt-0.5">{item.divisionName || 'Curso general'}</p>
        </div>
      )
    },
    {
      key: "semester",
      label: "Semestre",
      icon: <Hash size={16} />,
      align: "center",
      render: (item) => (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-md">
          {item.semester ? `${item.semester}°` : 'General'}
        </span>
      )
    },
    {
      key: "stats",
      label: "Estadísticas",
      icon: <Layers size={16} />,
      align: "center",
      render: (item) => (
        <div className="text-center min-w-[100px]">
          <p className="text-sm font-medium text-gray-900">
            {item.modulesCount || 0} módulos
          </p>
          <p className="text-xs text-gray-500">
            {item.groupsCount || 0} grupos
          </p>
        </div>
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
          onChange={() => handleToggleStatus(item.idCourse, item.status)}
        />
      ),
    },
    {
      key: "actions",
      label: "Acciones",
      icon: <MoreVertical size={16} />,
      align: "center",
      render: (item) => (
        <div className="flex justify-center gap-3">
          <button 
            onClick={() => handleEdit(item)}
            className="flex items-center gap-2 text-sm text-gray-700 border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-100 transition cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
            Editar
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
            Administración de Cursos Académicos
          </h3>
          <p className="text-[13px] text-gray-500">
            Gestiona los cursos y materias que componen los programas educativos de la institución.
            {userRole === UserRole.COORDINATOR && (
              <span className="block mt-1 text-blue-600">
                Mostrando solo cursos de tu división.
              </span>
            )}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto px-5 py-2.5 bg-primary text-white rounded-lg flex items-center justify-center gap-2 hover:brightness-95 text-sm font-medium transition"
        >
          <Plus size={18} />
          Nuevo curso
        </button>
      </header>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Division filter */}
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">División:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleDivisionChange("all")}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                selectedDivision === "all"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todas las divisiones
            </button>
            
            {divisions.map((division) => (
              <button
                key={division.idDivision}
                onClick={() => handleDivisionChange(division.idDivision)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  selectedDivision === division.idDivision
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title={division.name}
              >
                {division.code}
              </button>
            ))}
          </div>

          {/* Semester filter */}
          {uniqueSemesters.length > 0 && (
            <>
              <div className="flex items-center gap-2 lg:ml-6">
                <Hash className="w-4 h-4 text-gray-600" />
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
        {(selectedDivision !== "all" || selectedSemester !== "all") && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              Mostrando cursos de: {" "}
              {selectedDivision !== "all" && (
                <span className="font-medium text-gray-700">
                  {divisions.find(d => d.idDivision === selectedDivision)?.name}
                </span>
              )}
              {selectedDivision !== "all" && selectedSemester !== "all" && " • "}
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Total Cursos</p>
              <p className="text-2xl font-semibold text-gray-900">{totalCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Activos</p>
              <p className="text-2xl font-semibold text-gray-900">{activeCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Layers className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Total Módulos</p>
              <p className="text-2xl font-semibold text-gray-900">{totalModules}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <Table
        title="Cursos Académicos Registrados"
        columns={columns}
        data={courses}
        currentPage={currentPage}
        totalPages={totalPages}
        currentItemsCount={courses.length}
        totalItemsCount={totalCourses}
        onPreviousPage={() => setCurrentPage(p => Math.max(p - 1, 1))}
        onNextPage={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
        onSearch={setSearchTerm}
        emptyMessage="No se encontraron cursos académicos."
      />

      {/* Modal for create/edit */}
      <Modal
        title={selectedCourse ? "Editar curso académico" : "Agregar nuevo curso"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <CourseForm
          initialData={selectedCourse}
          divisions={divisions}
          onSave={handleSaveCourse}
          onCancel={() => setIsModalOpen(false)}
          loading={formLoading}
        />
      </Modal>
    </>
  );
}