"use client";

import { useState } from "react";
import { 
  Plus, 
  BookOpen, 
  Building2, 
  Hash,
  SlidersHorizontal, 
  MoreVertical, 
  Edit2,
  Users,
  GraduationCap
} from "lucide-react";

import Table, { TableColumn } from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import Toast from "@/components/ui/Toast";
import Switch from "@/components/ui/Switch";
import Spinner from "@/components/ui/Spinner";

// Mock data interfaces
interface Course {
  idCourse: number;
  courseCode: string;
  courseName: string;
  divisionCode: string;
  divisionName: string;
  semester: string;
  moduleCount: number;
  enrolledGroups: number;
  status: boolean;
}

interface Division {
  idDivision: number;
  code: string;
  name: string;
}

export default function CoursesPage() {
  const [loading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivision, setSelectedDivision] = useState<number | "all">("all");
  const [selectedSemester, setSelectedSemester] = useState<string | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    type: "success" | "error";
  } | null>(null);

  // Mock data
  const mockDivisions: Division[] = [
    { idDivision: 1, code: "ING", name: "División de Ingeniería" },
    { idDivision: 2, code: "ADM", name: "División de Administración" },
    { idDivision: 3, code: "DIS", name: "División de Diseño" },
  ];

  const mockCourses: Course[] = [
    {
      idCourse: 1,
      courseCode: "MAT101",
      courseName: "Matemáticas Discretas",
      divisionCode: "ING",
      divisionName: "División de Ingeniería",
      semester: "1",
      moduleCount: 6,
      enrolledGroups: 3,
      status: true
    },
    {
      idCourse: 2,
      courseCode: "PROG201",
      courseName: "Programación Orientada a Objetos",
      divisionCode: "ING",
      divisionName: "División de Ingeniería",
      semester: "2",
      moduleCount: 8,
      enrolledGroups: 4,
      status: true
    },
    {
      idCourse: 3,
      courseCode: "ADM101",
      courseName: "Administración de Empresas",
      divisionCode: "ADM",
      divisionName: "División de Administración",
      semester: "1",
      moduleCount: 5,
      enrolledGroups: 2,
      status: false
    },
    {
      idCourse: 4,
      courseCode: "DIS102",
      courseName: "Diseño Gráfico Digital",
      divisionCode: "DIS",
      divisionName: "División de Diseño",
      semester: "3",
      moduleCount: 7,
      enrolledGroups: 3,
      status: true
    },
    {
      idCourse: 5,
      courseCode: "BD301",
      courseName: "Base de Datos Avanzadas",
      divisionCode: "ING",
      divisionName: "División de Ingeniería",
      semester: "4",
      moduleCount: 6,
      enrolledGroups: 2,
      status: true
    },
    {
      idCourse: 6,
      courseCode: "MKT201",
      courseName: "Mercadotecnia Digital",
      divisionCode: "ADM",
      divisionName: "División de Administración",
      semester: "2",
      moduleCount: 4,
      enrolledGroups: 3,
      status: true
    }
  ];

  const coursesPerPage = 5;

  // Filtering logic
  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = 
      course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.divisionName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDivision = selectedDivision === "all" || course.divisionCode === mockDivisions.find(d => d.idDivision === selectedDivision)?.code;
    const matchesSemester = selectedSemester === "all" || course.semester === selectedSemester;
    
    return matchesSearch && matchesDivision && matchesSemester;
  });

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const currentCourses = filteredCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  // Get unique semesters for filter
  const uniqueSemesters = [...new Set(mockCourses.map(c => c.semester))].sort((a, b) => parseInt(a) - parseInt(b));

  // Mock handlers
  const handleDivisionChange = (divisionId: number | "all") => {
    setSelectedDivision(divisionId);
    setCurrentPage(1);
  };

  const handleSemesterChange = (semester: string | "all") => {
    setSelectedSemester(semester);
    setCurrentPage(1);
  };

  const handleToggleStatus = (idCourse: number, currentStatus: boolean) => {
    setToast({
      title: !currentStatus ? "Curso activado" : "Curso desactivado",
      description: `El curso fue ${!currentStatus ? "activado" : "desactivado"} correctamente.`,
      type: "success",
    });
  };

  const handleEdit = (course: Course) => {
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setIsModalOpen(true);
  };

  if (loading) return <Spinner text="Cargando cursos académicos..." fullScreen />;

  // Table columns configuration
  const columns: TableColumn<Course>[] = [
    { 
      key: "courseCode", 
      label: "Código", 
      icon: <BookOpen size={16} />,
      render: (item) => (
        <div className="min-w-[80px]">
          <p className="font-medium text-gray-900">{item.courseCode}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {item.semester}° semestre
          </p>
        </div>
      )
    },
    { 
      key: "courseName", 
      label: "Nombre del Curso", 
      icon: <GraduationCap size={16} />,
      render: (item) => (
        <div>
          <p className="font-medium text-gray-900">{item.courseName}</p>
          <p className="text-xs text-gray-500 mt-0.5">{item.divisionName}</p>
        </div>
      )
    },
    {
      key: "division",
      label: "División",
      icon: <Building2 size={16} />,
      render: (item) => (
        <div>
          <p className="text-sm text-gray-900 font-medium">{item.divisionCode}</p>
          <p className="text-xs text-gray-500 truncate" title={item.divisionName}>
            {item.divisionName}
          </p>
        </div>
      )
    },
    {
      key: "semester",
      label: "Semestre",
      icon: <Hash size={16} />,
      align: "center",
      render: (item) => (
        <span className="text-sm font-medium text-gray-700">{item.semester}°</span>
      )
    },
    {
      key: "stats",
      label: "Estadísticas",
      icon: <Users size={16} />,
      align: "center",
      render: (item) => (
        <div className="text-center">
          <div className="text-sm font-medium text-gray-900">
            {item.moduleCount} módulos
          </div>
          <div className="text-xs text-gray-500">
            {item.enrolledGroups} grupos
          </div>
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
            Administración de Cursos Académicos
          </h3>
          <p className="text-[13px] text-gray-500">
            Gestiona los cursos y materias que componen los programas educativos de la institución.
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
            
            {mockDivisions.map((division) => (
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
                  {mockDivisions.find(d => d.idDivision === selectedDivision)?.name}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Total Cursos</p>
              <p className="text-2xl font-semibold text-gray-900">{filteredCourses.length}</p>
              {filteredCourses.length !== mockCourses.length && (
                <p className="text-xs text-gray-500">
                  de {mockCourses.length} totales
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Activos</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredCourses.filter(c => c.status).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Total Módulos</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredCourses.reduce((sum, c) => sum + c.moduleCount, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses table */}
      <Table
        title={
          selectedDivision === "all" && selectedSemester === "all"
            ? "Cursos Académicos Registrados"
            : "Cursos Filtrados"
        }
        columns={columns}
        data={currentCourses}
        currentPage={currentPage}
        totalPages={totalPages}
        currentItemsCount={currentCourses.length}
        totalItemsCount={filteredCourses.length}
        onPreviousPage={() => setCurrentPage(p => Math.max(p - 1, 1))}
        onNextPage={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
        onSearch={setSearchTerm}
        emptyMessage={
          selectedDivision === "all" && selectedSemester === "all"
            ? "No se encontraron cursos académicos."
            : "No se encontraron cursos con los filtros aplicados."
        }
      />

      {/* Modal placeholder */}
      <Modal
        title="Nuevo curso académico"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="p-4 text-center text-gray-500">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-sm">Formulario de curso en desarrollo...</p>
          <button
            onClick={() => setIsModalOpen(false)}
            className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Cerrar
          </button>
        </div>
      </Modal>
    </>
  );
}