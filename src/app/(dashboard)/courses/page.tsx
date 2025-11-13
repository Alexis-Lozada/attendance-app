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

// This is a mockup component - functionality will be implemented later
export default function CoursesPage() {
  // Mock data following the exact structure from the database diagram
  const mockCourses = [
    {
      idCourse: 1,
      idUniversity: 1,
      idDivision: 1,
      courseCode: "MAT101",
      courseName: "Matemáticas Discretas",
      semester: "1",
      status: true,
      division: "División de Ingeniería",
      divisionCode: "ING",
      moduleCount: 6,
      groupCount: 3
    },
    {
      idCourse: 2,
      idUniversity: 1,
      idDivision: 1,
      courseCode: "PROG201",
      courseName: "Programación Orientada a Objetos",
      semester: "2",
      status: true,
      division: "División de Ingeniería",
      divisionCode: "ING",
      moduleCount: 8,
      groupCount: 4
    },
    {
      idCourse: 3,
      idUniversity: 1,
      idDivision: 2,
      courseCode: "ADM101",
      courseName: "Administración de Empresas",
      semester: "1",
      status: false,
      division: "División de Administración",
      divisionCode: "ADM",
      moduleCount: 5,
      groupCount: 2
    },
    {
      idCourse: 4,
      idUniversity: 1,
      idDivision: 3,
      courseCode: "DIS102",
      courseName: "Diseño Gráfico Digital",
      semester: "3",
      status: true,
      division: "División de Diseño",
      divisionCode: "DIS",
      moduleCount: 7,
      groupCount: 3
    }
  ];

  const mockDivisions = [
    { id: 1, name: "División de Ingeniería", code: "ING" },
    { id: 2, name: "División de Administración", code: "ADM" },
    { id: 3, name: "División de Diseño", code: "DIS" }
  ];

  const mockSemesters = ["1", "2", "3", "4"];

  // Calculate stats
  const totalCourses = mockCourses.length;
  const activeCourses = mockCourses.filter(c => c.status).length;
  const totalModules = mockCourses.reduce((sum, course) => sum + course.moduleCount, 0);

  return (
    <>
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

        <button className="w-full sm:w-auto px-5 py-2.5 bg-primary text-white rounded-lg flex items-center justify-center gap-2 hover:brightness-95 text-sm font-medium transition">
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
            <button className="px-3 py-1.5 text-sm font-medium rounded-lg transition-all bg-primary text-white">
              Todas las divisiones
            </button>
            
            {mockDivisions.map((division) => (
              <button
                key={division.id}
                className="px-3 py-1.5 text-sm font-medium rounded-lg transition-all bg-gray-100 text-gray-700 hover:bg-gray-200"
                title={division.name}
              >
                {division.code}
              </button>
            ))}
          </div>

          {/* Semester filter */}
          <div className="flex items-center gap-2 lg:ml-6">
            <Hash className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Semestre:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-1.5 text-sm font-medium rounded-lg transition-all bg-primary text-white">
              Todos
            </button>
            
            {mockSemesters.map((semester) => (
              <button
                key={semester}
                className="px-3 py-1.5 text-sm font-medium rounded-lg transition-all bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                {semester}°
              </button>
            ))}
          </div>
        </div>
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
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        {/* Table header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200">
              <List className="w-4 h-4 text-gray-700" />
            </div>
            <h3 className="text-[14px] font-medium text-gray-900">Cursos Académicos Registrados</h3>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-9 pr-3 py-2 text-[13px] text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="w-full max-w-full overflow-x-auto rounded-md border border-gray-200">
          <div className="min-w-[800px]">
            <table className="w-full text-[13px] text-left text-gray-700">
              <thead className="bg-gray-50 text-gray-700">
                <tr className="border-b border-gray-200">
                  <th className="px-5 py-3 font-medium text-left">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-600" />
                      <span>Código</span>
                    </div>
                  </th>
                  <th className="px-5 py-3 font-medium text-left">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gray-600" />
                      <span>Nombre del Curso</span>
                    </div>
                  </th>
                  <th className="px-5 py-3 font-medium text-left">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-600" />
                      <span>División</span>
                    </div>
                  </th>
                  <th className="px-5 py-3 font-medium text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Hash className="w-4 h-4 text-gray-600" />
                      <span>Semestre</span>
                    </div>
                  </th>
                  <th className="px-5 py-3 font-medium text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Layers className="w-4 h-4 text-gray-600" />
                      <span>Estadísticas</span>
                    </div>
                  </th>
                  <th className="px-5 py-3 font-medium text-center">
                    <div className="flex items-center justify-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-gray-600" />
                      <span>Status</span>
                    </div>
                  </th>
                  <th className="px-5 py-3 font-medium text-center">
                    <div className="flex items-center justify-center gap-2">
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                      <span>Acciones</span>
                    </div>
                  </th>
                </tr>
              </thead>
                
              <tbody>
                {mockCourses.map((course, index) => (
                  <tr
                    key={course.idCourse}
                    className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    {/* Course Code */}
                    <td className="px-5 py-[10px] text-gray-700">
                      <div className="min-w-[80px]">
                        <span className="font-medium text-gray-900">{course.courseCode}</span>
                        <p className="text-xs text-gray-500 mt-0.5">{course.semester}° semestre</p>
                      </div>
                    </td>

                    {/* Course Name */}
                    <td className="px-5 py-[10px] text-gray-700">
                      <div className="min-w-[200px]">
                        <p className="font-medium text-gray-900">{course.courseName}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{course.divisionCode}</p>
                      </div>
                    </td>

                    {/* Division */}
                    <td className="px-5 py-[10px] text-gray-700">
                      <div className="min-w-[150px]">
                        <p className="text-sm font-medium text-gray-900">{course.divisionCode}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{course.division}</p>
                      </div>
                    </td>

                    {/* Semester */}
                    <td className="px-5 py-[10px] text-center">
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-md">
                        {course.semester}°
                      </span>
                    </td>

                    {/* Statistics */}
                    <td className="px-5 py-[10px] text-center">
                      <div className="text-center min-w-[100px]">
                        <p className="text-sm font-medium text-gray-900">
                          {course.moduleCount} módulos
                        </p>
                        <p className="text-xs text-gray-500">
                          {course.groupCount} grupos
                        </p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-[10px] text-center">
                      <button
                        className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors duration-300 cursor-pointer ${
                          course.status ? "bg-primary" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                            course.status ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-[10px] text-center">
                      <div className="flex justify-center gap-3">
                        <button className="flex items-center gap-2 text-sm text-gray-700 border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-100 transition cursor-pointer">
                          <Edit2 className="w-4 h-4" />
                          Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="px-2 py-3 flex flex-col sm:flex-row justify-between items-center gap-3 text-[13px] border-t border-gray-200 mt-4">
          <p className="text-gray-700 font-medium text-center sm:text-left">
            Mostrando {mockCourses.length} de {mockCourses.length} registros — Página 1 de 1
          </p>
          <div className="flex items-center gap-2">
            <button className="p-1.5 border border-primary text-primary rounded-md transition-all opacity-50 cursor-not-allowed">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="p-1.5 border border-primary text-primary rounded-md transition-all opacity-50 cursor-not-allowed">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}