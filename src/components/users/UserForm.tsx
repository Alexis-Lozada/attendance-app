"use client";

import { useEffect, useState } from "react";
import type { User } from "@/components/users/UsersTypes";
import Select from "@/components/ui/Select";
import { Mail, IdCard, UserCircle, Shield, User as UserIcon } from "lucide-react";

interface Props {
    initialData?: User | null;
    onSave: (data: Omit<User, "id"> & { password?: string }, id?: number) => void;
    onCancel: () => void;
}

const ROLE_OPTIONS = [
    { value: "ADMIN", label: "Administrador", icon: <Shield size={16} /> },
    { value: "STUDENT", label: "Estudiante", icon: <UserCircle size={16} /> },
    { value: "TEACHER", label: "Profesor", icon: <UserCircle size={16} /> },
    { value: "TUTOR", label: "Tutor", icon: <UserCircle size={16} /> },
];

export default function UserForm({ initialData, onSave, onCancel }: Props) {
    const [formData, setFormData] = useState<Omit<User, "id"> & { password?: string }>({
        idUniversity: 0,
        email: "",
        enrollmentNumber: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "STUDENT",
        status: true,
    });

    const [isEditing, setIsEditing] = useState(false);

    // 🔹 Si hay datos iniciales, los cargamos al abrir
    useEffect(() => {
        if (initialData) {
            setFormData({
                idUniversity: initialData.idUniversity,
                email: initialData.email,
                enrollmentNumber: initialData.enrollmentNumber,
                password: "", // No cargar password por seguridad
                firstName: initialData.firstName,
                lastName: initialData.lastName,
                role: initialData.role,
                status: initialData.status,
            });
            setIsEditing(true);
        } else {
            setFormData({
                idUniversity: 0,
                email: "",
                enrollmentNumber: "",
                password: "",
                firstName: "",
                lastName: "",
                role: "STUDENT",
                status: true,
            });
            setIsEditing(false);
        }
    }, [initialData]);

    const handleChange = (field: keyof typeof formData, value: string | number | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        handleChange(field, value);
    };

    const handleSubmit = () => {
        // Validaciones
        if (!formData.email || !formData.firstName || !formData.lastName || !formData.role) {
            alert("Por favor completa todos los campos obligatorios.");
            return;
        }

        // Si es creación, validar password
        if (!isEditing && (!formData.password || formData.password.length < 6)) {
            alert("La contraseña es obligatoria y debe tener al menos 6 caracteres.");
            return;
        }

        // Preparar datos para enviar
        const dataToSend = { ...formData };
        
        // Si es edición y no se cambió el password, eliminar el campo
        if (isEditing && (!formData.password || formData.password.trim() === "")) {
            delete dataToSend.password;
        }

        onSave(dataToSend, initialData?.id);
    };

    return (
        <div className="space-y-4">
            {/* Campos principales - Grid responsivo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nombre */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre *
                    </label>
                    <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none"
                            placeholder="Ej: Juan"
                        />
                    </div>
                </div>

                {/* Apellido */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apellido *
                    </label>
                    <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none"
                            placeholder="Ej: Pérez"
                        />
                    </div>
                </div>
            </div>

            {/* Email y Matrícula */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none"
                            placeholder="Ej: juan.perez@universidad.edu"
                        />
                    </div>
                </div>

                {/* Matrícula */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de Matrícula
                    </label>
                    <div className="relative">
                        <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            value={formData.enrollmentNumber}
                            onChange={(e) => handleInputChange("enrollmentNumber", e.target.value)}
                            className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none"
                            placeholder="Ej: A12345678"
                        />
                    </div>
                </div>
            </div>

            {/* Password (solo para creación) */}
            {!isEditing && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contraseña *
                    </label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none"
                        placeholder="Mínimo 6 caracteres"
                        minLength={6}
                    />
                </div>
            )}

            {/* Password para edición (opcional) */}
            {isEditing && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nueva Contraseña (dejar vacío para mantener la actual)
                    </label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none"
                        placeholder="Dejar vacío para no cambiar"
                        minLength={6}
                    />
                </div>
            )}

            {/* Select de Rol */}
            <div>
                <Select
                    label="Rol *"
                    options={ROLE_OPTIONS}
                    value={formData.role}
                    onChange={(value) => handleChange("role", value)}
                    placeholder="Selecciona un rol"
                    searchable={true}
                    required={true}
                />
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
                    {isEditing ? "Guardar Cambios" : "Crear Usuario"}
                </button>
            </div>
        </div>
    );
}