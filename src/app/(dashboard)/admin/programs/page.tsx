"use client";

import { 
  Plus, 
  GraduationCap, 
  Building2, 
  BookOpen, 
  SlidersHorizontal, 
  MoreVertical, 
  Edit2
} from "lucide-react";

import Table, { TableColumn } from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import Toast from "@/components/ui/Toast";
import Switch from "@/components/ui/Switch";
import ProgramForm from "@/components/programs/ProgramForm";
import Spinner from "@/components/ui/Spinner";
import { useProgram } from "@/hooks/useProgram";
import type { ProgramWithDivision } from "@/types/program";

export default function ProgramsPage() {
  const {
    // Data
    programs,
    divisions,
    filteredPrograms,
    totalPrograms,
    
    // Pagination
    currentPage,
    totalPages,
    setCurrentPage,
    
    // Filters
    searchTerm,
    selectedDivision,
    setSearchTerm,
    handleDivisionChange,
    
    // Modal & Form
    isModalOpen,
    setIsModalOpen,
    selectedProgram,
    formLoading,
    
    // Actions
    handleSaveProgram,
    handleToggleStatus,
    handleEdit,
    handleOpenAdd,
    
    // State
    loading,
    toast,
    setToast,
  } = useProgram();

  if (loading) return <Spinner text="Cargando programas educativos..." fullScreen />;

  // Table columns configuration
  const columns: TableColumn<ProgramWithDivision>[] = [
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
            Administración de Programas Educativos
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
              <p className="text-2xl font-semibold text-gray-900">{totalPrograms}</p>
              {selectedDivision !== "all" && (
                <p className="text-xs text-gray-500">
                  de {filteredPrograms.length} totales
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
                  de {totalPrograms} filtrados
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
                  de {totalPrograms} filtrados
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
        data={programs}
        currentPage={currentPage}
        totalPages={totalPages}
        currentItemsCount={programs.length}
        totalItemsCount={totalPrograms}
        onPreviousPage={() => setCurrentPage(p => Math.max(p - 1, 1))}
        onNextPage={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
        onSearch={setSearchTerm}
        emptyMessage={
          selectedDivision === "all" 
            ? "No se encontraron programas educativos."
            : `No se encontraron programas en ${divisions.find(d => d.idDivision === selectedDivision)?.name || 'esta división'}.`
        }
      />

      {/* Modal for create/edit */}
      <Modal
        title={selectedProgram ? "Editar programa educativo" : "Agregar nuevo programa"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <ProgramForm
          initialData={selectedProgram}
          divisions={divisions}
          onSave={handleSaveProgram}
          onCancel={() => setIsModalOpen(false)}
          loading={formLoading}
        />
      </Modal>
    </>
  );
}