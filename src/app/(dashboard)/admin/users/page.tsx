"use client";

import { useState } from "react";
import { Plus, Mail, IdCard, User as UserIcon, Shield, SlidersHorizontal, MoreVertical, Edit2 } from "lucide-react";

import Table, { TableColumn } from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import Toast from "@/components/ui/Toast";
import Switch from "@/components/ui/Switch";
import UserForm from "@/components/users/UserForm";
import { useUser } from "@/hooks/useUser";
import type { User } from "@/components/users/UsersTypes";

export default function UsersPage() {
    const {
        loading,
        users,
        totalUsers,
        totalPages,
        currentPage,
        toast,
        isModalOpen,
        setToast,
        setIsModalOpen,
        setSearchTerm,
        setCurrentPage,
        handleSaveUser,
        handleUpdateUser,
        handleToggleStatus
    } = useUser();

    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    if (loading) return <p className="text-gray-500">Cargando usuarios...</p>;

    // 🔹 Configuración de columnas
    const columns: TableColumn<User>[] = [
        { 
            key: "email", 
            label: "Email", 
            icon: <Mail size={16} /> 
        },
        { 
            key: "enrollmentNumber", 
            label: "Matrícula", 
            icon: <IdCard size={16} /> 
        },
        { 
            key: "firstName", 
            label: "Nombre", 
            icon: <UserIcon size={16} /> 
        },
        { 
            key: "lastName", 
            label: "Apellido", 
            icon: <UserIcon size={16} /> 
        },
        { 
            key: "role", 
            label: "Rol", 
            icon: <Shield size={16} />,
            render: (item) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {item.role}
                </span>
            )
        },
        {
            key: "status",
            label: "Estado",
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
                            setSelectedUser(item);
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
    const handleSave = (data: Omit<User, "id"> & { password?: string }, id?: number) => {
        if (id) handleUpdateUser(id, data);
        else handleSaveUser(data as Omit<User, "id"> & { password: string });
    };

    // 🔹 Abrir modal para agregar
    const handleOpenAdd = () => {
        setSelectedUser(null);
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
                        Lista de usuarios
                    </h3>
                    <p className="text-[13px] text-gray-500">
                        Aquí puedes visualizar los usuarios activos o inactivos dentro del sistema académico.
                    </p>
                </div>

                <button
                    onClick={handleOpenAdd}
                    className="w-full sm:w-auto px-5 py-2.5 bg-primary text-white rounded-lg flex items-center justify-center gap-2 hover:brightness-95 text-sm font-medium transition"
                >
                    <Plus size={18} />
                    Nuevo usuario
                </button>
            </header>

            {/* === Tabla === */}
            <Table
                title="Usuarios del Sistema"
                columns={columns}
                data={users}
                currentPage={currentPage}
                totalPages={totalPages}
                currentItemsCount={users.length}
                totalItemsCount={totalUsers}
                onPreviousPage={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                onNextPage={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                onSearch={setSearchTerm}
                emptyMessage="No hay usuarios registrados."
            />

            {/* === Modal para crear / editar === */}
            <Modal
                title={selectedUser ? "Editar usuario" : "Agregar nuevo usuario"}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <UserForm
                    initialData={selectedUser}
                    onSave={handleSave}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </>
    );
}