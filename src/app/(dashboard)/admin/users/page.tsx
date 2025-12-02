"use client";

import { 
  Users, 
  UserCheck, 
  UserX, 
  Shield, 
  GraduationCap,
  BookOpen,
  SlidersHorizontal,
  MoreVertical, 
  Edit2,
  User as UserIcon,
  Plus
} from "lucide-react";

import Table, { TableColumn } from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import Toast from "@/components/ui/Toast";
import Switch from "@/components/ui/Switch";
import Spinner from "@/components/ui/Spinner";
import UserForm from "@/components/users/UserForm";
import { useUser } from "@/hooks/useUser";
import { UserRole, RoleLabels } from "@/types/roles";
import type { User } from "@/types/user";

interface UserWithImage extends User {
  profileImageUrl?: string;
  fullName: string;
}

export default function UsersPage() {
  const {
    // Data
    users,
    filteredUsers,
    totalUsers,
    availableRoles,
    divisions,
    
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
    setSelectedUser,
    formLoading,
    
    // Actions
    handleSaveUser,
    handleEdit,
    handleToggleStatus,
    
    // State
    loading,
    toast,
    setToast,
    userRole,
    canEditUsers,
    isAdmin,
    isCoordinator,
    userDivision,
  } = useUser();

  if (loading) return <Spinner text="Cargando usuarios del sistema..." fullScreen />;

  // Get role badge color without icons
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case UserRole.COORDINATOR:
        return "bg-purple-100 text-purple-800";
      case UserRole.TUTOR:
        return "bg-blue-100 text-blue-800";
      case UserRole.TEACHER:
        return "bg-green-100 text-green-800";
      case UserRole.STUDENT:
        return "bg-orange-100 text-orange-800";
      case UserRole.USER:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Table columns configuration
  const columns: TableColumn<UserWithImage>[] = [
    {
      key: "user",
      label: "Usuario",
      icon: <UserIcon size={16} />,
      render: (item: UserWithImage) => (
        <div className="flex items-center gap-3 min-w-[200px]">
          {item.profileImageUrl ? (
            <img
              src={item.profileImageUrl}
              alt={item.fullName}
              className="w-10 h-10 aspect-square rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 aspect-square rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
              <UserIcon className="w-5 h-5 text-gray-500" />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900">{item.fullName}</p>
            <p className="text-sm text-gray-500">{item.email}</p>
            {item.enrollmentNumber && (
              <p className="text-xs text-gray-400">{item.enrollmentNumber}</p>
            )}
          </div>
        </div>
      )
    },
    {
      key: "role",
      label: "Rol",
      icon: <Shield size={16} />,
      render: (item: UserWithImage) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(item.role)}`}>
          {RoleLabels[item.role as UserRole] || item.role}
        </span>
      )
    },
    {
      key: "lastLogin",
      label: "Último acceso",
      icon: <UserCheck size={16} />,
      align: "center",
      render: (item: UserWithImage) => (
        <div className="text-center">
          {item.lastLogin ? (
            <span className="text-sm text-gray-700">
              {new Date(item.lastLogin).toLocaleDateString('es-MX', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </span>
          ) : (
            <span className="text-xs text-gray-400">Sin registro</span>
          )}
        </div>
      )
    },
    {
      key: "status",
      label: "Status",
      icon: <SlidersHorizontal size={16} />,
      align: "center",
      render: (item: UserWithImage) => (
        <Switch
          checked={item.status}
          onChange={() => handleToggleStatus(item.idUser, item.status)}
        />
      ),
    },
  ];

  // Add actions column only if user can edit
  if (canEditUsers) {
    columns.push({
      key: "actions",
      label: "Acciones",
      icon: <MoreVertical size={16} />,
      align: "center",
      render: (item: UserWithImage) => (
        <div className="flex justify-center gap-2">
          <button
            title="Editar usuario"
            onClick={() => handleEdit(item)}
            className="flex items-center gap-2 text-sm text-gray-700 border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-100 transition cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>
        </div>
      ),
    });
  }

  // Get role statistics
  const roleStats = availableRoles.reduce((acc, role) => {
    acc[role] = filteredUsers.filter(u => u.role === role).length;
    return acc;
  }, {} as Record<string, number>);

  const activeUsers = filteredUsers.filter(u => u.status).length;
  const inactiveUsers = filteredUsers.filter(u => !u.status).length;

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
            Gestiona los usuarios del sistema académico y sus perfiles.
            {userRole === UserRole.COORDINATOR && (
              <span className="block mt-1 text-blue-600">
                Como coordinador, puedes gestionar tutores, profesores y estudiantes.
              </span>
            )}
          </p>
        </div>

        {canEditUsers && (
          <button
            onClick={() => {
              setSelectedUser(null);
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-primary text-white rounded-lg flex items-center justify-center gap-2 hover:brightness-95 text-sm font-medium transition"
          >
            <Plus size={18} />
            Agregar usuario
          </button>
        )}
      </header>

      {/* Role Filters */}
      {availableRoles.length > 1 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
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
                  {RoleLabels[role as UserRole] || role}
                </button>
              ))}
            </div>
          </div>

          {/* Active filter info */}
          {selectedRole !== "all" && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                Mostrando usuarios con rol: {" "}
                <span className="font-medium text-gray-700">
                  {RoleLabels[selectedRole as UserRole] || selectedRole}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Total Usuarios</p>
              <p className="text-2xl font-semibold text-gray-900">{totalUsers}</p>
              {selectedRole !== "all" && (
                <p className="text-xs text-gray-500">filtrados</p>
              )}
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
              <p className="text-2xl font-semibold text-gray-900">{activeUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <UserX className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Inactivos</p>
              <p className="text-2xl font-semibold text-gray-900">{inactiveUsers}</p>
            </div>
          </div>
        </div>

        {userRole === UserRole.COORDINATOR && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Tu División</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {(roleStats[UserRole.TUTOR] || 0) + (roleStats[UserRole.TEACHER] || 0) + (roleStats[UserRole.STUDENT] || 0)}
                </p>
                <p className="text-xs text-gray-500">usuarios gestionables</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Users table */}
      <Table
        title={
          selectedRole === "all"
            ? "Usuarios Registrados"
            : `Usuarios con rol: ${RoleLabels[selectedRole as UserRole] || selectedRole}`
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
            ? "No se encontraron usuarios."
            : `No se encontraron usuarios con el rol ${RoleLabels[selectedRole as UserRole] || selectedRole}.`
        }
      />

      {/* Modal for edit user */}
      {canEditUsers && (
        <Modal
          title={selectedUser ? "Editar usuario" : "Agregar nuevo usuario"}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <UserForm
            initialData={selectedUser}
            onSave={handleSaveUser}
            onCancel={() => setIsModalOpen(false)}
            loading={formLoading}
            isAdmin={isAdmin}
            isCoordinator={isCoordinator}
            userDivision={userDivision}
            divisions={divisions}
          />
        </Modal>
      )}
    </>
  );
}