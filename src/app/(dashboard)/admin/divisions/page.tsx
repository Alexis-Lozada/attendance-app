"use client";

import { useState } from "react";
import { Plus, Type, Building2, FileText, SlidersHorizontal, MoreVertical, Edit2 } from "lucide-react";

import Table, { TableColumn } from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import Toast from "@/components/ui/Toast";
import Switch from "@/components/ui/Switch";
import DivisionForm from "@/components/divisions/DivisionForm";
import { useDivision } from "@/hooks/useDivision";
import type { Division } from "@/components/divisions/DivisionsTypes";

export default function DivisionsPage() {
  const { loading, divisions, totalDivisions, totalPages, currentPage, toast, isModalOpen, setToast, setIsModalOpen, setSearchTerm, setCurrentPage, handleSaveDivision, handleUpdateDivision, handleToggleStatus } = useDivision();

  const [selectedDivision, setSelectedDivision] = useState<Division | null>(null);

  if (loading) return <p className="text-gray-500">Cargando divisiones...</p>;

  // 🔹 Configuración de columnas
  const columns: TableColumn<Division>[] = [
    { key: "code", label: "Código Académico", icon: <Type size={16} /> },
    { key: "name", label: "Nombre de División", icon: <Building2 size={16} /> },
    { key: "description", label: "Descripción", icon: <FileText size={16} /> },
    {
      key: "status",
      label: "Status",
      icon: <SlidersHorizontal size={16} />,
      align: "center",
      render: (item) => (
        <Switch
          checked={item.status}
          onChange={() => handleToggleStatus(item.id, item.status)}
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
            Lista de divisiones
          </h3>
          <p className="text-[13px] text-gray-500">
            Aquí puedes visualizar las divisiones activas o inactivas dentro del sistema académico.
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
