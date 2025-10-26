"use client";

import { useState } from "react";
import { X, Plus, SlidersHorizontal } from "lucide-react";

interface DivisionFormData {
    codigo: string;
    nombre: string;
    descripcion: string;
    status: boolean;
}

interface DivisionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: DivisionFormData) => void;
}

export default function DivisionsModal({ isOpen, onClose, onSubmit }: DivisionsModalProps) {
    const [formData, setFormData] = useState<DivisionFormData>({
        codigo: "",
        nombre: "",
        descripcion: "",
        status: true
    });

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!formData.codigo || !formData.nombre || !formData.descripcion) {
            alert("Por favor completa todos los campos obligatorios");
            return;
        }
        onSubmit(formData);
        setFormData({
            codigo: "",
            nombre: "",
            descripcion: "",
            status: true
        });
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <>
            <div className="fixed inset-0 backdrop-blur-sm bg-black/20 z-40 transition-all duration-300" onClick={onClose} />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center p-6 border-b-2 border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900">AGREGAR NUEVA DIVISIÓN</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Código Académico *</label>
                            <input type="text" name="codigo" value={formData.codigo} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900" placeholder="Ej: ING, DS, MC" maxLength={10} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de División *</label>
                            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900" placeholder="Ej: Área de Ingeniería" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
                            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows={4} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900 resize-none" placeholder="Descripción detallada de la división académica" />
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b-2 border-gray-300 mb-4 flex items-center gap-2">
                                <SlidersHorizontal size={20} /> Estado de la División
                            </h3>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setFormData(prev => ({ ...prev, status: true }))} className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${formData.status ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-gray-300'}`}>
                                    Activo
                                </button>
                                <button type="button" onClick={() => setFormData(prev => ({ ...prev, status: false }))} className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${!formData.status ? 'bg-gray-400 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-gray-300'}`}>
                                    Inactivo
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 p-6 border-t-2 border-gray-200 bg-gray-50">
                        <button type="button" onClick={onClose} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-semibold">
                            Cancelar
                        </button>
                        <button type="button" onClick={handleSubmit} className="px-6 py-3 bg-primary text-white rounded-lg hover:brightness-95 transition font-semibold shadow-lg flex items-center gap-2">
                            <Plus size={20} /> Guardar División
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}