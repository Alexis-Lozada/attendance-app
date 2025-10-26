// DivisionsToolbar.tsx - VERSIÓN RESPONSIVE
"use client";

import { Search, Download, Group, Filter, Columns, Menu } from "lucide-react";
import { useState } from "react";

interface DivisionsToolbarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    isGrouped: boolean;
    onToggleGroup: () => void;
    onShowFilters: () => void;
    onShowColumns: () => void;
    onExport: () => void;
}

export default function DivisionsToolbar({
    searchTerm,
    onSearchChange,
    isGrouped,
    onToggleGroup,
    onShowFilters,
    onShowColumns,
    onExport
}: DivisionsToolbarProps) {
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    return (
        <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200 bg-gray-50 relative overflow-visible">
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Left Side: Search */}
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por código, nombre o descripción..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900 placeholder-gray-400 text-sm"
                        />
                    </div>
                </div>

                {/* Desktop Actions */}
                <div className="hidden lg:flex gap-3">
                    <button
                        onClick={onExport}
                        className="px-4 py-2.5 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-900 rounded-lg transition-all font-semibold flex items-center gap-2 text-sm"
                    >
                        <Download size={18} />
                        Exportar
                    </button>

                    <button
                        onClick={onToggleGroup}
                        className="px-4 py-2.5 bg-primary hover:brightness-95 text-white rounded-lg transition-all font-semibold flex items-center gap-2 text-sm"
                    >
                        <Group size={18} />
                        {isGrouped ? "Desagrupar" : "Agrupar"}
                    </button>

                    <button
                        onClick={onShowFilters}
                        className="px-4 py-2.5 bg-primary hover:brightness-95 text-white rounded-lg transition-all font-semibold flex items-center gap-2 text-sm"
                    >
                        <Filter size={18} />
                        Filtros
                    </button>

                    <button
                        onClick={onShowColumns}
                        className="px-4 py-2.5 bg-primary hover:brightness-95 text-white rounded-lg transition-all font-semibold flex items-center gap-2 text-sm"
                    >
                        <Columns size={18} />
                        Columnas
                    </button>
                </div>

                {/* Mobile/Tablet Actions */}
                <div className="lg:hidden">
                    <button 
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="w-full px-4 py-2.5 bg-primary text-white rounded-lg flex items-center justify-center gap-2 font-semibold text-sm"
                    >
                        <Menu size={18} />
                        Opciones
                    </button>
                    
                    {showMobileMenu && (
                        <div className="mt-2 grid grid-cols-2 gap-2">
                            <button 
                                onClick={() => { onExport(); setShowMobileMenu(false); }} 
                                className="px-3 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                            >
                                <Download size={16} />
                                Exportar
                            </button>
                            <button 
                                onClick={() => { onToggleGroup(); setShowMobileMenu(false); }} 
                                className="px-3 py-2 bg-primary text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                            >
                                <Group size={16} />
                                {isGrouped ? "Desagrupar" : "Agrupar"}
                            </button>
                            <button 
                                onClick={() => { onShowFilters(); setShowMobileMenu(false); }} 
                                className="px-3 py-2 bg-primary text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                            >
                                <Filter size={16} />
                                Filtros
                            </button>
                            <button 
                                onClick={() => { onShowColumns(); setShowMobileMenu(false); }} 
                                className="px-3 py-2 bg-primary text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                            >
                                <Columns size={16} />
                                Columnas
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}