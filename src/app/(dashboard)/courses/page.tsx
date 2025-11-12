"use client";

import { useState } from "react";
import {
  Plus,
  BookOpen,
  SlidersHorizontal,
  MoreVertical,
  Edit2,
  Users,
  GraduationCap,
} from "lucide-react";

import Table, { TableColumn } from "@/components/ui/Table";
import Toast from "@/components/ui/Toast";
import Switch from "@/components/ui/Switch";
import Spinner from "@/components/ui/Spinner";
import CourseModal from "@/components/courses/CourseModal";
import CourseFilters from "@/components/courses/CourseFilters";
import CourseStats from "@/components/courses/CourseStats";
import { useCourses } from "@/hooks/useCourses";
import { useDivision } from "@/hooks/useDivision";
import type { Course } from "@/types/course";

export default function CoursesPage() {
  const {
    courses,
    loading,
    error,
    toast,
    isModalOpen,
    setToast,
    setIsModalOpen,
    handleSaveCourse,
    handleToggleStatus,
  } = useCourses();

  const { divisions, loading: loadingDivisions } = useDivision();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivision, setSelectedDivision] = useState<number | "all">("all");
  const [selectedSemester, setSelectedSemester] = useState<string | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  if (loading || loadingDivisions) {
    return <Spinner text="Cargando cursos y divisiones..." fullScreen />;
  }

  if (error) {
    return <p className="text-red-600 text-sm text-center mt-6">{error}</p>;
  }

  const coursesPerPage = 5;

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.divisionName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesDivision =
      selectedDivision === "all" || course.idDivision === selectedDivision;

    const matchesSemester =
      selectedSemester === "all" || course.semester === selectedSemester;

    return matchesSearch && matchesDivision && matchesSemester;
  });

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const currentCourses = filteredCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  const uniqueSemesters = [
    ...new Set(
      courses.map((c) => c.semester).filter((s): s is string => !!s)
    ),
  ].sort((a, b) => parseInt(a) - parseInt(b));

  const totalCourses = filteredCourses.length;
  const totalActive = filteredCourses.filter((c) => c.status).length;
  const totalModules = filteredCourses.reduce(
    (sum, c) => sum + (c.modulesCount ?? 0),
    0
  );

  // === Handlers ===
  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleDivisionChange = (divisionId: number | "all") => {
    setSelectedDivision(divisionId);
    setCurrentPage(1);
  };

  const handleSemesterChange = (semester: string | "all") => {
    setSelectedSemester(semester);
    setCurrentPage(1);
  };

  const handleSave = async (
    data: {
      idDivision?: number | null;
      courseCode: string;
      courseName: string;
      semester?: string | null;
    },
    idCourse?: number
  ) => {
    await handleSaveCourse(data, idCourse);
    setIsModalOpen(false);
  };

  const columns: TableColumn<Course>[] = [
    {
      key: "courseCode",
      label: "Código",
      icon: <BookOpen size={16} />,
      render: (item) => (
        <div className="min-w-[80px]">
          <p className="font-medium text-gray-900">{item.courseCode}</p>
          {item.semester && (
            <p className="text-xs text-gray-500 mt-0.5">
              {item.semester}° semestre
            </p>
          )}
        </div>
      ),
    },
    {
      key: "courseName",
      label: "Nombre del Curso",
      icon: <GraduationCap size={16} />,
      render: (item) => (
        <div>
          <p className="font-medium text-gray-900">{item.courseName}</p>
          {item.divisionName && (
            <p className="text-xs text-gray-500 mt-0.5">{item.divisionName}</p>
          )}
        </div>
      ),
    },
    {
      key: "division",
      label: "División",
      icon: <Users size={16} />,
      render: (item) => (
        <div>
          <p className="text-sm text-gray-900 font-medium">
            {item.divisionCode ?? "-"}
          </p>
          <p
            className="text-xs text-gray-500 truncate"
            title={item.divisionName ?? ""}
          >
            {item.divisionName ?? "Sin división"}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      label: "Estatus",
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
      {toast && (
        <Toast
          title={toast.title}
          description={toast.description}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
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

      {/* Filtros */}
      <CourseFilters
        divisions={divisions.map((d) => ({
          idDivision: d.idDivision,
          code: d.code,
          name: d.name,
        }))}
        semesters={uniqueSemesters}
        selectedDivision={selectedDivision}
        selectedSemester={selectedSemester}
        onChangeDivision={handleDivisionChange}
        onChangeSemester={handleSemesterChange}
      />

      {/* Estadísticas */}
      <CourseStats
        totalCourses={totalCourses}
        totalActive={totalActive}
        totalModules={totalModules}
      />

      {/* Tabla */}
      <Table
        title="Cursos Académicos"
        columns={columns}
        data={currentCourses}
        currentPage={currentPage}
        totalPages={totalPages}
        currentItemsCount={currentCourses.length}
        totalItemsCount={filteredCourses.length}
        onPreviousPage={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        onNextPage={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        onSearch={setSearchTerm}
        emptyMessage="No se encontraron cursos académicos."
      />

      {/* Modal */}
      {isModalOpen && (
        <CourseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={editingCourse}
          divisions={divisions}
          onSave={handleSave}
        />
      )}
    </>
  );
}
