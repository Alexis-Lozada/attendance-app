"use client";

import { useState } from "react";
import { 
  Plus, 
  GraduationCap, 
  Building2, 
  BookOpen, 
  SlidersHorizontal, 
  MoreVertical, 
  Edit2,
  Eye
} from "lucide-react";

import Table, { TableColumn } from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import Toast from "@/components/ui/Toast";
import Switch from "@/components/ui/Switch";

// Types for Educational Programs (matching database schema)
interface Program {
  idProgram: number;
  idDivision: number;
  programCode: string;
  programName: string;
  description: string;
  status: boolean;
  divisionName?: string; // For display purposes
}

// Mock data for demonstration (matching database schema)
const mockPrograms: Program[] = [
  {
    idProgram: 1,
    idDivision: 1,
    programCode: "IDGS",
    programName: "Ingeniería en Desarrollo y Gestión de Software",
    description: "Programa enfocado en el desarrollo de software empresarial y gestión de proyectos tecnológicos.",
    status: true,
    divisionName: "Área de Ingeniería"
  },
  {
    idProgram: 2,
    idDivision: 1,
    programCode: "ISC",
    programName: "Ingeniería en Sistemas Computacionales",
    description: "Carrera orientada al diseño y desarrollo de sistemas computacionales complejos.",
    status: true,
    divisionName: "Área de Ingeniería"
  },
  {
    idProgram: 3,
    idDivision: 2,
    programCode: "LAE",
    programName: "Licenciatura en Administración de Empresas",
    description: "Programa integral de formación en administración y gestión empresarial.",
    status: true,
    divisionName: "Área de Ciencias Económico-Administrativas"
  },
  {
    idProgram: 4,
    idDivision: 1,
    programCode: "MDS",
    programName: "Maestría en Desarrollo de Software",
    description: "Posgrado especializado en metodologías avanzadas de desarrollo de software.",
    status: false,
    divisionName: "Área de Ingeniería"
  },
  {
    idProgram: 5,
    idDivision: 3,
    programCode: "TUR",
    programName: "Licenciatura en Turismo",
    description: "Formación integral en gestión turística y hospitalidad.",
    status: true,
    divisionName: "Área de Turismo y Gastronomía"
  }
];

// Mock divisions data (this would come from division.service.ts)
const mockDivisions = [
  { idDivision: 1, name: "Área de Ingeniería", code: "ING" },
  { idDivision: 2, name: "Área de Ciencias Económico-Administrativas", code: "CEA" },
  { idDivision: 3, name: "Área de Turismo y Gastronomía", code: "TUR" },
  { idDivision: 4, name: "Área de Ciencias de la Salud", code: "SAL" }
];

export default function ProgramsPage() {
  const [programs] = useState<Program[]>(mockPrograms);
  const [divisions] = useState(mockDivisions);
  const [loading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivision, setSelectedDivision] = useState<number | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    type: "success" | "error";
  } | null>(null);

  const programsPerPage = 5;

  // Filter programs based on search term and selected division
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = 
      program.programCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.divisionName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDivision = selectedDivision === "all" || program.idDivision === selectedDivision;
    
    return matchesSearch && matchesDivision;
  });

  const handleDivisionChange = (divisionId: number | "all") => {
    setSelectedDivision(divisionId);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const totalPages = Math.ceil(filteredPrograms.length / programsPerPage);
  const currentPrograms = filteredPrograms.slice(
    (currentPage - 1) * programsPerPage,
    currentPage * programsPerPage
  );

  // Mock handlers (will be implemented with actual functionality later)
  const handleToggleStatus = (idProgram: number, currentStatus: boolean) => {
    console.log(`Toggle status for program ${idProgram}: ${!currentStatus}`);
    setToast({
      title: !currentStatus ? "Programa activado" : "Programa desactivado",
      description: `El programa fue ${!currentStatus ? "activado" : "desactivado"} correctamente.`,
      type: "success"
    });
  };

  const handleEdit = (program: Program) => {
    setSelectedProgram(program);
    setIsModalOpen(true);
  };

  const handleView = (program: Program) => {
    console.log("View program details:", program);
    setToast({
      title: "Vista de detalles",
      description: "Funcionalidad en desarrollo",
      type: "success"
    });
  };

  const handleOpenAdd = () => {
    setSelectedProgram(null);
    setIsModalOpen(true);
  };

  if (loading) return <p className="text-gray-500">Cargando programas educativos...</p>;

  // Table columns configuration
  const columns: TableColumn<Program>[] = [
    { 
      key: "programCode", 
      label: "Código", 
      icon: <GraduationCap size={16} />,
      render: (item) => (
        <span className="font-medium text-gray-900">{item.programCode}</span>
      )
    },
    { 
      key: "programName", 
      label: "Programa Educativo", 
      icon: <BookOpen size={16} />,
      render: (item) => (
        <div>
          <p className="font-medium text-gray-900">{item.programName}</p>
          <p className="text-xs text-gray-500 mt-0.5">{item.divisionName}</p>
        </div>
      )
    },
    {
      key: "description",
      label: "Descripción",
      icon: <Building2 size={16} />,
      render: (item) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-700 truncate" title={item.description}>
            {item.description}
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
          onChange={() => handleToggleStatus(item.idProgram, item.status)}
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
            title="Ver detalles"
            onClick={() => handleView(item)}
            className="text-gray-600 hover:text-blue-600 transition"
          >
            <Eye size={15} />
          </button>
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
            Programas Educativos
          </h3>
          <p className="text-[13px] text-gray-500">
            Gestiona los programas educativos, carreras y especialidades ofrecidas por la institución.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto px-5 py-2.5 bg-primary text-white rounded-lg flex items-center justify-center gap-2 hover:brightness-95 text-sm font-medium transition"
        >
          <Plus size={18} />
          Nuevo programa
        </button>
      </header>

      {/* Division Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filtrar por división:</span>
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

          {/* Selected division info */}
          {selectedDivision !== "all" && (
            <div className="text-sm text-gray-500">
              Mostrando programas de: {" "}
              <span className="font-medium text-gray-700">
                {divisions.find(d => d.idDivision === selectedDivision)?.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Total Programas</p>
              <p className="text-2xl font-semibold text-gray-900">{filteredPrograms.length}</p>
              {selectedDivision !== "all" && (
                <p className="text-xs text-gray-500">
                  de {programs.length} totales
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Activos</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredPrograms.filter(p => p.status).length}
              </p>
              {selectedDivision !== "all" && (
                <p className="text-xs text-gray-500">
                  de {filteredPrograms.length} filtrados
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Inactivos</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredPrograms.filter(p => !p.status).length}
              </p>
              {selectedDivision !== "all" && (
                <p className="text-xs text-gray-500">
                  de {filteredPrograms.length} filtrados
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Programs table */}
      <Table
        title={
          selectedDivision === "all" 
            ? "Programas Educativos Registrados"
            : `Programas de ${divisions.find(d => d.idDivision === selectedDivision)?.name || 'División Seleccionada'}`
        }
        columns={columns}
        data={currentPrograms}
        currentPage={currentPage}
        totalPages={totalPages}
        currentItemsCount={currentPrograms.length}
        totalItemsCount={filteredPrograms.length}
        onPreviousPage={() => setCurrentPage(p => Math.max(p - 1, 1))}
        onNextPage={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
        onSearch={setSearchTerm}
        emptyMessage={
          selectedDivision === "all" 
            ? "No se encontraron programas educativos."
            : `No se encontraron programas en ${divisions.find(d => d.idDivision === selectedDivision)?.name || 'esta división'}.`
        }
      />

      {/* Modal for create/edit (placeholder) */}
      <Modal
        title={selectedProgram ? "Editar programa educativo" : "Agregar nuevo programa"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Formulario para {selectedProgram ? "editar" : "crear"} programa educativo.
          </p>
          <p className="text-xs text-gray-400">
            Funcionalidad en desarrollo...
          </p>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="border border-gray-300 text-gray-700 text-sm font-medium rounded-md px-4 py-2 hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-primary text-white text-sm font-medium rounded-md px-4 py-2 hover:brightness-95 transition"
            >
              {selectedProgram ? "Guardar cambios" : "Guardar programa"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}