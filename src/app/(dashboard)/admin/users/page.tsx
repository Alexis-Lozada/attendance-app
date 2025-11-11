"use client";

import { 
  Plus, 
  Shield,
  Mail,
  SlidersHorizontal, 
  MoreVertical, 
  Edit2,
  User
} from "lucide-react";

import Table, { TableColumn } from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import Toast from "@/components/ui/Toast";
import Switch from "@/components/ui/Switch";
import Spinner from "@/components/ui/Spinner";
import UserForm from "@/components/users/UserForm";
import { useUser } from "@/hooks/useUser";
import { UserRole, RoleLabels } from "@/types/roles";
import type { UserWithDetails } from "@/types/user";

export default function UsersPage() {
  const {
    // Data
    users,
    filteredUsers,
    totalUsers,
    availableRoles,
    
    // Pagination
    currentPage,
    totalPages,
    setCurrentPage,
    
    // Filters
    searchTerm,
    selectedRole,
    setSearchTerm,
    handleRoleChange,
    
    // Modal & Form
    isModalOpen,
    setIsModalOpen,
    selectedUser,
    formLoading,
    
    // Actions
    handleSaveUser,
    handleToggleStatus,
    handleEdit,
    handleOpenAdd,
    
    // State
    loading,
    toast,
    setToast,
    userRole,
  } = useUser();

  if (loading) return <Spinner text="Cargando usuarios del sistema..." fullScreen />;

  // Table columns configuration
  const columns: TableColumn<UserWithDetails>[] = [
    {
      key: "user",
      label: "Usuario",
      icon: <User size={16} />,
      render: (item) => (
        <div className="flex items-center gap-3">
          {item.profileImageUrl ? (
            <img
              src={item.profileImageUrl}
              alt={item.fullName}
              className="w-10 h-10 aspect-square rounded-md object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 aspect-square rounded-md bg-gray-200 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-gray-500" />
            </div>
          )}
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate">{item.fullName}</p>
            <p className="text-sm text-gray-500 truncate" title={item.email}>
              {item.email}
            </p>
            {item.enrollmentNumber && (
              <p className="text-xs text-gray-400 truncate">
                Mat: {item.enrollmentNumber}
              </p>
            )}
          </div>
        </div>
      )
    },
    {
      key: "role",
      label: "Rol",
      icon: <Shield size={16} />,
      render: (item) => (
        <div>
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              item.role === UserRole.ADMIN
                ? "bg-purple-100 text-purple-800"
                : item.role === UserRole.COORDINATOR
                ? "bg-blue-100 text-blue-800"
                : item.role === UserRole.TUTOR
                ? "bg-green-100 text-green-800"
                : item.role === UserRole.TEACHER
                ? "bg-yellow-100 text-yellow-800"
                : item.role === UserRole.STUDENT
                ? "bg-gray-100 text-gray-800"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {RoleLabels[item.role as UserRole] || item.role}
          </span>
        </div>
      )
    },
    {
      key: "contact",
      label: "Información",
      icon: <Mail size={16} />,
      render: (item) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-900">{item.email}</p>
          {item.enrollmentNumber && (
            <p className="text-xs text-gray-500 mt-0.5">
              Matrícula: {item.enrollmentNumber}
            </p>
          )}
          {item.lastLogin && (
            <p className="text-xs text-gray-400 mt-0.5">
              Último acceso: {new Date(item.lastLogin).toLocaleDateString()}
            </p>
          )}
        </div>
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
          onChange={() => handleToggleStatus(item.idUser, item.status)}
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
            title="Editar usuario"
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
            Administración de Usuarios
          </h3>
          <p className="text-[13px] text-gray-500">
            Gestiona usuarios del sistema, roles, permisos y estado de las cuentas.
            {userRole === UserRole.COORDINATOR && (
              <span className="block mt-1 text-blue-600">
                Mostrando usuarios de tu división académica.
              </span>
            )}
            {userRole === UserRole.TUTOR && (
              <span className="block mt-1 text-blue-600">
                Mostrando estudiantes de tus grupos asignados.
              </span>
            )}
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

      {/* Role Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filtrar por rol:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleRoleChange("all")}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                selectedRole === "all"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todos los roles
            </button>
            
            {availableRoles.map((role) => (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  selectedRole === role
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {RoleLabels[role] || role}
              </button>
            ))}
          </div>

          {/* Selected role info */}
          {selectedRole !== "all" && (
            <div className="text-sm text-gray-500">
              Mostrando usuarios con rol: {" "}
              <span className="font-medium text-gray-700">
                {RoleLabels[selectedRole as UserRole] || selectedRole}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Users table */}
      <Table
        title={
          selectedRole === "all" 
            ? "Usuarios Registrados en el Sistema"
            : `Usuarios con Rol: ${RoleLabels[selectedRole as UserRole] || selectedRole}`
        }
        columns={columns}
        data={users}
        currentPage={currentPage}
        totalPages={totalPages}
        currentItemsCount={users.length}
        totalItemsCount={totalUsers}
        onPreviousPage={() => setCurrentPage(p => Math.max(p - 1, 1))}
        onNextPage={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
        onSearch={setSearchTerm}
        emptyMessage={
          selectedRole === "all" 
            ? "No se encontraron usuarios en el sistema."
            : `No se encontraron usuarios con el rol: ${RoleLabels[selectedRole as UserRole] || selectedRole}.`
        }
      />

      {/* Modal for create/edit */}
      <Modal
        title={selectedUser ? "Editar información del usuario" : "Agregar nuevo usuario"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <UserForm
          initialData={selectedUser}
          onSave={handleSaveUser}
          onCancel={() => setIsModalOpen(false)}
          loading={formLoading}
        />
      </Modal>
    </>
  );
}