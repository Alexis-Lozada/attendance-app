"use client";

import { useEffect, useState } from "react";
import { ChevronDown, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getUsersByUniversity } from "@/services/user.service";
import { getFileUrl } from "@/services/storage.service";
import { UserRole, RoleLabels } from "@/types/roles";
import type { Division } from "@/types/division";
import type { User as UserType } from "@/types/user";

interface Props {
  initialData?: Division | null; // 🔹 null → nuevo registro
  onSave: (data: Omit<Division, "idDivision">, id?: number) => void;
  onCancel: () => void;
}

interface UserWithImage extends UserType {
  profileImageUrl?: string;
}

export default function DivisionForm({ initialData, onSave, onCancel }: Props) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Omit<Division, "idDivision">>({
    idUniversity: 0,
    idCoordinator: undefined,
    code: "",
    name: "",
    description: "",
    status: true,
  });

  const [users, setUsers] = useState<UserWithImage[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // 🔹 Load users when component mounts
  useEffect(() => {
    if (!user?.idUniversity) return;

    const loadUsers = async () => {
      try {
        setLoadingUsers(true);
        const userData = await getUsersByUniversity(user.idUniversity);
        
        // Load profile images for users
        const usersWithImages = await Promise.all(
          userData.map(async (u) => {
            let profileImageUrl = undefined;
            if (u.profileImage) {
              profileImageUrl = await getFileUrl(u.profileImage) || undefined;
            }
            return { ...u, profileImageUrl };
          })
        );
        
        // Filter only active COORDINATOR users
        const eligibleUsers = usersWithImages.filter(u => 
          u.status && u.role === UserRole.COORDINATOR
        );
        
        setUsers(eligibleUsers);
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, [user?.idUniversity]);

  // 🔹 Si hay datos iniciales, los cargamos al abrir
  useEffect(() => {
    if (initialData) {
      setFormData({
        idUniversity: initialData.idUniversity,
        idCoordinator: initialData.idCoordinator,
        code: initialData.code,
        name: initialData.name,
        description: initialData.description,
        status: initialData.status,
      });
    } else {
      setFormData({
        idUniversity: 0,
        idCoordinator: undefined,
        code: "",
        name: "",
        description: "",
        status: true,
      });
    }
  }, [initialData]);

  const handleChange = (field: keyof Omit<Division, "idDivision">, value: string | number | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.code || !formData.name || !formData.description) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }
    onSave(formData, initialData?.idDivision); // 🔹 si tiene idDivision, es edición
  };

  const selectedUser = users.find(u => u.idUser === formData.idCoordinator);

  return (
    <div className="space-y-4">
      {/* Campos principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código Académico *
          </label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none"
            placeholder="Ej: ING, DS, MC"
            maxLength={10}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de División *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none"
            placeholder="Ej: Área de Ingeniería"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none resize-none"
          placeholder="Breve descripción de la división académica"
        />
      </div>

      {/* Coordinator Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Coordinador
        </label>
        <div className="relative">
          <select
            value={formData.idCoordinator || ""}
            onChange={(e) => handleChange("idCoordinator", e.target.value ? Number(e.target.value) : undefined)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white appearance-none cursor-pointer focus:ring-1 focus:ring-primary focus:outline-none pr-10"
            disabled={loadingUsers}
          >
            <option value="">Seleccionar coordinador...</option>
            {users.map((user) => (
              <option key={user.idUser} value={user.idUser}>
                {user.firstName} {user.lastName} ({RoleLabels[user.role as UserRole] || user.role})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        
        {/* Selected coordinator preview */}
        {selectedUser && (
          <div className="mt-2 p-2 bg-gray-50 rounded-md border border-gray-200">
            <div className="flex items-center gap-3">
              {selectedUser.profileImageUrl ? (
                <img
                  src={selectedUser.profileImageUrl}
                  alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                  className="w-8 h-8 rounded-md object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-md bg-gray-200 flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {selectedUser.firstName} {selectedUser.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {RoleLabels[selectedUser.role as UserRole] || selectedUser.role}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {loadingUsers && (
          <p className="text-xs text-gray-500 mt-1">Cargando usuarios...</p>
        )}
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          onClick={onCancel}
          className="border border-gray-300 text-gray-700 text-sm font-medium rounded-md px-4 py-2 hover:bg-gray-100 transition"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          className="bg-primary text-white text-sm font-medium rounded-md px-4 py-2 hover:brightness-95 transition"
        >
          {initialData ? "Guardar Cambios" : "Guardar División"}
        </button>
      </div>
    </div>
  );
}