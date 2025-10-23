// DivisionsHeader.tsx - VERSIÓN RESPONSIVE
"use client";

import { Plus } from "lucide-react";

interface DivisionsHeaderProps {
    title: string;
    description: string;
    onAddDivision: () => void;
}

export default function DivisionsHeader({ title, description, onAddDivision }: DivisionsHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-4 sm:p-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{title}</h1>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
            <button
                onClick={onAddDivision}
                className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg font-semibold hover:brightness-95 text-sm sm:text-base"
            >
                <Plus size={20} />
                <span className="hidden sm:inline">Nueva División</span>
                <span className="sm:hidden">Agregar</span>
            </button>
        </div>
    );
}