"use client";

import { useState } from "react";
import { Plus, Type, BookOpen, FileText, SlidersHorizontal, MoreVertical, Edit2 } from "lucide-react";

import Table, { TableColumn } from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import Toast from "@/components/ui/Toast";
import Switch from "@/components/ui/Switch";
import ProgramForm from "@/components/programs/ProgramForm";
import { useProgram } from "@/hooks/useProgram";
import type { Program } from "@/components/programs/ProgramsTypes";

export default function ProgramsPage() {
    const {
        loading,
        programs,
        totalPrograms,
        totalPages,
        currentPage,
        toast,
        isModalOpen,
        setToast,
        setIsModalOpen,
        setSearchTerm,
        setCurrentPage,
        handleSaveProgram,
        handleUpdateProgram,
        handleToggleStatus
    } = useProgram();

    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

    if (loading) return <p className="text-gray-500">Cargando programas...</p>;

    // 🔹 Configuración de columnas
    const columns: TableColumn<Program>[] = [
        { key: "programCode", label: "Código del Programa", icon: <Type size={16} /> },
        { key: "programName", label: "Nombre del Programa", icon: <BookOpen size={16} /> },
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
                            setSelectedProgram(item);
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
    const handleSave = (data: Omit<Program, "id">, id?: number) => {
        if (id) handleUpdateProgram(id, data);
        else handleSaveProgram(data);
    };

    // 🔹 Abrir modal para agregar
    const handleOpenAdd = () => {
        setSelectedProgram(null);
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
                        Lista de programas
                    </h3>
                    <p className="text-[13px] text-gray-500">
                        Aquí puedes visualizar los programas activos o inactivos dentro del sistema académico.
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

            {/* === Tabla === */}
            <Table
                title="Programas Académicos Vigentes"
                columns={columns}
                data={programs}
                currentPage={currentPage}
                totalPages={totalPages}
                currentItemsCount={programs.length}
                totalItemsCount={totalPrograms}
                onPreviousPage={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                onNextPage={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                onSearch={setSearchTerm}
            />

            {/* === Modal para crear / editar === */}
            <Modal
                title={selectedProgram ? "Editar programa" : "Agregar nuevo programa"}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <ProgramForm
                    initialData={selectedProgram}
                    onSave={handleSave}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </>
    );
}