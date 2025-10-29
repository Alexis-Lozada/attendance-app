"use client";

import { useEffect, useState } from "react";
import type { Program } from "@/components/programs/ProgramsTypes";
import Select from "@/components/ui/Select";
import { useDivisions } from "@/hooks/useDivisions";
import { Building2 } from "lucide-react";

interface Props {
    initialData?: Program | null;
    onSave: (data: Omit<Program, "id">, id?: number) => void;
    onCancel: () => void;
}

export default function ProgramForm({ initialData, onSave, onCancel }: Props) {
    const [formData, setFormData] = useState<Omit<Program, "id">>({
        idDivision: 0,
        programCode: "",
        programName: "",
        description: "",
        status: true,
    });

    const { divisionOptions, loading: divisionsLoading, error: divisionsError } = useDivisions();

    // 🔹 Si hay datos iniciales, los cargamos al abrir
    useEffect(() => {
        if (initialData) {
            setFormData({
                idDivision: initialData.idDivision,
                programCode: initialData.programCode,
                programName: initialData.programName,
                description: initialData.description,
                status: initialData.status,
            });
        } else {
            setFormData({
                idDivision: 0,
                programCode: "",
                programName: "",
                description: "",
                status: true,
            });
        }
    }, [initialData]);

    const handleChange = (field: keyof Omit<Program, "id">, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleInputChange = (field: keyof Omit<Program, "id">, value: string) => {
        handleChange(field, value);
    };

    const handleSubmit = () => {
        if (!formData.programCode || !formData.programName || !formData.description || !formData.idDivision) {
            alert("Por favor completa todos los campos obligatorios.");
            return;
        }
        onSave(formData, initialData?.id);
    };

    // 🔹 Preparar opciones para el Select con iconos
    const divisionSelectOptions = divisionOptions.map(option => ({
        ...option,
        icon: <Building2 size={16} />
    }));

    return (
        <div className="space-y-4">
            {/* Campos principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Código del Programa *
                    </label>
                    <input
                        type="text"
                        value={formData.programCode}
                        onChange={(e) => handleInputChange("programCode", e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none"
                        placeholder="Ej: ING-SIS, DS-WEB, MC-DATA"
                        maxLength={10}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Programa *
                    </label>
                    <input
                        type="text"
                        value={formData.programName}
                        onChange={(e) => handleInputChange("programName", e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none"
                        placeholder="Ej: Ingeniería en Sistemas"
                    />
                </div>
            </div>

            {/* Select de Divisiones */}
            <div>
                <Select
                    label="División *"
                    options={divisionSelectOptions}
                    value={formData.idDivision}
                    onChange={(value) => handleChange("idDivision", value)}
                    placeholder={divisionsLoading ? "Cargando divisiones..." : "Selecciona una división"}
                    searchable={true}
                    required={true}
                    disabled={divisionsLoading}
                    error={divisionsError || undefined}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción *
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                    placeholder="Breve descripción del programa académico"
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
                    {initialData ? "Guardar Cambios" : "Guardar Programa"}
                </button>
            </div>
        </div>
    );
}