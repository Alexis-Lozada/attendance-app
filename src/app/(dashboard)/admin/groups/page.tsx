"use client";

import { useState } from "react";
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
  BookOpen
} from "lucide-react";

import Table, { TableColumn } from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import Toast from "@/components/ui/Toast";
import Switch from "@/components/ui/Switch";
import Spinner from "@/components/ui/Spinner";

// Mock data types (will be replaced with actual types later)
interface Group {
  idGroup: number;
  idProgram: number;
  idTutor: number;
  groupCode: string;
  groupName: string;
  semester: string;
  academicYear: string;
  status: boolean;
  // Additional fields for display
  programName?: string;
  programCode?: string;
  tutorName?: string;
  enrolledStudents?: number;
  totalCapacity?: number;
}

interface Program {
  idProgram: number;
  programCode: string;
  programName: string;
}

interface Tutor {
  idUser: number;
  firstName: string;
  lastName: string;
}

// Mock data
const mockGroups: Group[] = [
  {
    idGroup: 1,
    idProgram: 1,
    idTutor: 1,
    groupCode: "IDGS12-A",
    groupName: "Desarrollo de Software 12vo A",
    semester: "12",
    academicYear: "2024-2025",
    status: true,
    programName: "Ingeniería en Desarrollo y Gestión de Software",
    programCode: "IDGS",
    tutorName: "Dr. Juan Pérez",
    enrolledStudents: 28,
    totalCapacity: 35
  },
  {
    idGroup: 2,
    idProgram: 1,
    idTutor: 2,
    groupCode: "IDGS10-B",
    groupName: "Desarrollo de Software 10mo B",
    semester: "10",
    academicYear: "2024-2025",
    status: true,
    programName: "Ingeniería en Desarrollo y Gestión de Software",
    programCode: "IDGS",
    tutorName: "Mtra. María González",
    enrolledStudents: 32,
    totalCapacity: 35
  },
  {
    idGroup: 3,
    idProgram: 2,
    idTutor: 3,
    groupCode: "ISC08-A",
    groupName: "Sistemas Computacionales 8vo A",
    semester: "8",
    academicYear: "2024-2025",
    status: false,
    programName: "Ingeniería en Sistemas Computacionales",
    programCode: "ISC",
    tutorName: "Ing. Carlos López",
    enrolledStudents: 15,
    totalCapacity: 30
  }
];

const mockPrograms: Program[] = [
  { idProgram: 1, programCode: "IDGS", programName: "Ingeniería en Desarrollo y Gestión de Software" },
  { idProgram: 2, programCode: "ISC", programName: "Ingeniería en Sistemas Computacionales" },
  { idProgram: 3, programCode: "LAE", programName: "Licenciatura en Administración de Empresas" }
];

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [programs] = useState<Program[]>(mockPrograms);
  const [loading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<number | "all">("all");
  const [selectedSemester, setSelectedSemester] = useState<string | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    type: "success" | "error";
  } | null>(null);

  const groupsPerPage = 5;

  // Filtered groups logic
  const filteredGroups = groups.filter(group => {
    const matchesSearch = 
      group.groupCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.programName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.tutorName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProgram = selectedProgram === "all" || group.idProgram === selectedProgram;
    const matchesSemester = selectedSemester === "all" || group.semester === selectedSemester;
    
    return matchesSearch && matchesProgram && matchesSemester;
  });

  const totalPages = Math.ceil(filteredGroups.length / groupsPerPage);
  const currentGroups = filteredGroups.slice(
    (currentPage - 1) * groupsPerPage,
    currentPage * groupsPerPage
  );

  // Get unique semesters for filter
  const uniqueSemesters = [...new Set(groups.map(g => g.semester))].sort();

  // Mock handlers (will be implemented later)
  const handleToggleStatus = (idGroup: number, currentStatus: boolean) => {
    console.log("Toggle status for group:", idGroup, "to:", !currentStatus);
    setToast({
      title: !currentStatus ? "Grupo activado" : "Grupo desactivado",
      description: `El grupo fue ${!currentStatus ? "activado" : "desactivado"} correctamente.`,
      type: "success",
    });
  };

  const handleEdit = (group: Group) => {
    setSelectedGroup(group);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setSelectedGroup(null);
    setIsModalOpen(true);
  };

  const handleProgramChange = (programId: number | "all") => {
    setSelectedProgram(programId);
    setCurrentPage(1);
  };

  const handleSemesterChange = (semester: string | "all") => {
    setSelectedSemester(semester);
    setCurrentPage(1);
  };

  if (loading) return <Spinner text="Cargando grupos académicos..." fullScreen />;

  // Table columns configuration
  const columns: TableColumn<Group>[] = [
    { 
      key: "groupCode", 
      label: "Código", 
      icon: <Hash size={16} />,
      render: (item) => (
        <span className="font-medium text-gray-900">{item.groupCode}</span>
      )
    },
    { 
      key: "groupName", 
      label: "Grupo", 
      icon: <Users size={16} />,
      render: (item) => (
        <div>
          <p className="font-medium text-gray-900">{item.groupName}</p>
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
        </div>
      )
    },
    {
      key: "tutor",
      label: "Tutor Asignado",
      icon: <UserCheck size={16} />,
      render: (item) => (
        <span className="text-sm text-gray-700">{item.tutorName}</span>
      )
    },
    {
      key: "enrollment",
      label: "Matrícula",
      icon: <BookOpen size={16} />,
      align: "center",
      render: (item) => (
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <span className="text-sm font-medium text-gray-900">
              {item.enrolledStudents}
            </span>
            <span className="text-xs text-gray-500">
              / {item.totalCapacity}
            </span>
          </div>
          <div className="w-16 h-1.5 bg-gray-200 rounded-full mt-1 mx-auto">
            <div 
              className={`h-full rounded-full ${
                (item.enrolledStudents! / item.totalCapacity!) > 0.9 
                  ? 'bg-red-400' 
                  : (item.enrolledStudents! / item.totalCapacity!) > 0.7 
                    ? 'bg-yellow-400' 
                    : 'bg-green-400'
              }`}
              style={{ width: `${(item.enrolledStudents! / item.totalCapacity!) * 100}%` }}
            />
          </div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Total Grupos</p>
              <p className="text-2xl font-semibold text-gray-900">{filteredGroups.length}</p>
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
                {filteredGroups.reduce((sum, g) => sum + (g.enrolledStudents || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Capacidad Total</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredGroups.reduce((sum, g) => sum + (g.totalCapacity || 0), 0)}
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
            : `Grupos Filtrados`
        }
        columns={columns}
        data={currentGroups}
        currentPage={currentPage}
        totalPages={totalPages}
        currentItemsCount={currentGroups.length}
        totalItemsCount={filteredGroups.length}
        onPreviousPage={() => setCurrentPage(p => Math.max(p - 1, 1))}
        onNextPage={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
        onSearch={setSearchTerm}
        emptyMessage={
          selectedProgram === "all" && selectedSemester === "all"
            ? "No se encontraron grupos académicos."
            : "No se encontraron grupos con los filtros aplicados."
        }
      />

      {/* Modal for create/edit (placeholder) */}
      <Modal
        title={selectedGroup ? "Editar grupo académico" : "Agregar nuevo grupo"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              Formulario de {selectedGroup ? "edición" : "creación"} de grupo en desarrollo
            </p>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="border border-gray-300 text-gray-700 text-sm font-medium rounded-md px-4 py-2 hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button
              className="bg-primary text-white text-sm font-medium rounded-md px-4 py-2 hover:brightness-95 transition"
            >
              {selectedGroup ? "Guardar Cambios" : "Guardar Grupo"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}