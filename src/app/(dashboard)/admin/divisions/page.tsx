"use client";

import { useState } from "react";
import { Plus, Building2, FileText, User, SlidersHorizontal, MoreVertical, Edit2 } from "lucide-react";

import Table, { TableColumn } from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import Toast from "@/components/ui/Toast";
import Switch from "@/components/ui/Switch";
import DivisionForm from "@/components/divisions/DivisionForm";
import { useDivision } from "@/hooks/useDivision";
import type { Division } from "@/types/division";

export default function DivisionsPage() {
  const { 
    loading, 
    divisions, 
    totalDivisions, 
    totalPages, 
    currentPage, 
    toast, 
    isModalOpen, 
    setToast, 
    setIsModalOpen, 
    setSearchTerm, 
    setCurrentPage, 
    handleSaveDivision, 
    handleUpdateDivision, 
    handleToggleStatus 
  } = useDivision();

  const [selectedDivision, setSelectedDivision] = useState<Division | null>(null);

  if (loading) return <p className="text-gray-500">Cargando divisiones...</p>;

  // 🔹 Configuración de columnas
  const columns: TableColumn<Division>[] = [
    { 
      key: "division", 
      label: "División Académica", 
      icon: <Building2 size={16} />,
      render: (item) => (
        <div>
          <p className="font-medium text-gray-900">{item.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{item.code}</p>
        </div>
      )
    },
    { 
      key: "coordinator", 
      label: "Coordinador", 
      icon: <User size={16} />,
      render: (item) => (
        <div className="flex items-center gap-3">
          {item.coordinatorImage ? (
            <img
              src={item.coordinatorImage}
              alt={item.coordinatorName || "Coordinador"}
              className="w-8 h-8 aspect-square rounded-md object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-8 h-8 aspect-square rounded-md bg-gray-200 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-gray-500" />
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-900">
              {item.coordinatorName || "Sin asignar"}
            </p>
            {item.coordinatorName && item.coordinatorName !== "Sin asignar" && (
              <p className="text-xs text-gray-500">Coordinador</p>
            )}
          </div>
        </div>
      )
    },
    { 
      key: "description", 
      label: "Descripción", 
      icon: <FileText size={16} />,
      render: (item) => (
        <div className="max-w-xs">
          <p className="text-xs text-gray-500 line-clamp-2" title={item.description}>
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
          onChange={() => handleToggleStatus(item.idDivision, item.status)}
        />
      ),
    },
    {
      key: "acciones",
      label: "Acciones",
      icon: <MoreVertical size={16} />,
      align: "center",
      render: (item) => (
        <div className="flex justify-center gap-3">
          {/* Editar */}
          <button
            title="Editar"
            onClick={() => {
              setSelectedDivision(item);
              setIsModalOpen(true);
            }}
            className="text-gray-600 hover:text-primary transition"
          >
            <Edit2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  // 🔹 Guardar o editar según corresponda
  const handleSave = (data: Omit<Division, "id">, id?: number) => {
    if (id) handleUpdateDivision(id, data);
    else handleSaveDivision(data);
  };

  // 🔹 Abrir modal para agregar
  const handleOpenAdd = () => {
    setSelectedDivision(null);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* === Toast === */}
      {toast && (
        <Toast
          title={toast.title}
          description={toast.description}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* === Encabezado === */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900">
            Administración de divisiones
          </h3>
          <p className="text-[13px] text-gray-500">
            Aquí puedes visualizar las divisiones activas o inactivas dentro del sistema académico y sus coordinadores asignados.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto px-5 py-2.5 bg-primary text-white rounded-lg flex items-center justify-center gap-2 hover:brightness-95 text-sm font-medium transition"
        >
          <Plus size={18} />
          Nueva división
        </button>
      </header>

      {/* === Stats cards === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Total Divisiones</p>
              <p className="text-2xl font-semibold text-gray-900">{totalDivisions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Activas</p>
              <p className="text-2xl font-semibold text-gray-900">
                {divisions.filter(d => d.status).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Inactivas</p>
              <p className="text-2xl font-semibold text-gray-900">
                {divisions.filter(d => !d.status).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* === Tabla === */}
      <Table
        title="Divisiones Académicas Vigentes"
        columns={columns}
        data={divisions}
        currentPage={currentPage}
        totalPages={totalPages}
        currentItemsCount={divisions.length}
        totalItemsCount={totalDivisions}
        onPreviousPage={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        onNextPage={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        onSearch={setSearchTerm}
        emptyMessage="No se encontraron divisiones académicas."
      />

      {/* === Modal para crear / editar === */}
      <Modal
        title={selectedDivision ? "Editar división" : "Agregar nueva división"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <DivisionForm
          initialData={selectedDivision}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
}