// DivisionsTablePanel.tsx - VERSIÓN RESPONSIVE
"use client";

import {
    List, Type, Building2, FileText, SlidersHorizontal, MoreVertical,
    Edit2, Trash2, ChevronLeft, ChevronRight, Search, X, Columns
} from "lucide-react";
import type { Division, Filters, VisibleColumns, ColumnKey } from "./DivisionsTypes";

// Interfaces para los sub-componentes
interface DivisionsTableProps {
    divisions: Division[];
    visibleColumns: VisibleColumns;
    isGrouped: boolean;
    onToggleStatus: (id: number) => void;
    onEditDivision: (division: Division) => void;
    onDeleteDivision: (id: number) => void;
}

interface DivisionsColumnsProps {
    visibleColumns: VisibleColumns;
    showColumns: boolean;
    setShowColumns: (show: boolean) => void;
    onColumnToggle: (key: ColumnKey) => void;
}

interface DivisionsFiltersProps {
    filters: Filters;
    showFilters: boolean;
    onClose: () => void;
    onFilterChange: (key: keyof Filters, value: string) => void;
    onReset: () => void;
    onApply: () => void;
}

interface DivisionsPaginationProps {
    currentPage: number;
    totalPages: number;
    currentItemsCount: number;
    totalItemsCount: number;
    onPreviousPage: () => void;
    onNextPage: () => void;
}

interface DivisionsTablePanelProps {
    divisions: Division[];
    filters: Filters;
    visibleColumns: VisibleColumns;
    isGrouped: boolean;
    showFilters: boolean;
    showColumns: boolean;
    currentPage: number;
    totalPages: number;
    currentItemsCount: number;
    totalItemsCount: number;
    onToggleStatus: (id: number) => void;
    onEditDivision: (division: Division) => void;
    onDeleteDivision: (id: number) => void;
    onFilterChange: (key: keyof Filters, value: string) => void;
    onColumnToggle: (key: ColumnKey) => void;
    onSetShowFilters: (show: boolean) => void;
    onSetShowColumns: (show: boolean) => void;
    onResetFilters: () => void;
    onApplyFilters: () => void;
    onPreviousPage: () => void;
    onNextPage: () => void;
}

// ==================== MOBILE CARD COMPONENT ====================
function DivisionCard({ 
    division, 
    onToggleStatus, 
    onEdit, 
    onDelete 
}: {
    division: Division;
    onToggleStatus: (id: number) => void;
    onEdit: (division: Division) => void;
    onDelete: (id: number) => void;
}) {
    const getAvatarColor = (code: string): string => {
        const colors: Record<string, string> = {
            "ING": "bg-orange-500",
            "DS": "bg-blue-500",
            "MC": "bg-purple-500",
        };
        return colors[code] || "bg-gray-500";
    };

    return (
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <span className={`w-10 h-10 rounded-full ${getAvatarColor(division.code)} flex items-center justify-center text-white text-sm font-bold`}>
                        {division.code}
                    </span>
                    <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{division.name}</h3>
                        <p className="text-xs text-gray-500">{division.code}</p>
                    </div>
                </div>
                
                {/* Status Toggle */}
                <div
                    onClick={() => onToggleStatus(division.id)}
                    className="relative inline-flex items-center cursor-pointer"
                >
                    <div className={`w-11 h-6 rounded-full transition-colors ${division.status ? 'bg-primary' : 'bg-gray-300'}`}></div>
                    <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all ${division.status ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 line-clamp-2">{division.description}</p>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-gray-200">
                <button
                    onClick={() => onEdit(division)}
                    className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                    <Edit2 size={16} />
                    Editar
                </button>
                <button
                    onClick={() => onDelete(division.id)}
                    className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                    <Trash2 size={16} />
                    Eliminar
                </button>
            </div>
        </div>
    );
}

// Sub-componente: Columnas
function DivisionsColumns({
    visibleColumns,
    showColumns,
    setShowColumns,
    onColumnToggle
}: DivisionsColumnsProps) {
    if (!showColumns) return null;

    const columnOptions: { key: ColumnKey; label: string }[] = [
        { key: "code", label: "Código Académico" },
        { key: "name", label: "Nombre de División" },
        { key: "description", label: "Descripción" },
        { key: "status", label: "Status" },
        { key: "acciones", label: "Acciones" },
    ];

    return (
        <div className="fixed inset-0 z-50 lg:absolute lg:inset-auto lg:top-12 lg:right-0 lg:w-64">
            <div className="lg:hidden fixed inset-0 bg-black/50" onClick={() => setShowColumns(false)} />
            <div className="relative lg:relative bg-white border-2 border-gray-200 rounded-xl shadow-xl p-4 m-4 lg:m-0">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Columnas</h3>
                    <button
                        onClick={() => setShowColumns(false)}
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="space-y-3">
                    {columnOptions.map((column) => (
                        <div key={column.key} className="flex items-center justify-between py-1">
                            <label className="text-sm text-gray-700 cursor-pointer font-medium">
                                {column.label}
                            </label>
                            <div
                                className={`w-5 h-5 border-2 rounded flex items-center justify-center cursor-pointer transition-all duration-200 ${
                                    visibleColumns[column.key] 
                                        ? 'bg-primary border-primary' 
                                        : 'bg-white border-gray-300'
                                }`}
                                onClick={() => onColumnToggle(column.key)}
                            >
                                {visibleColumns[column.key] && (
                                    <svg
                                        className="w-3 h-3 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={3}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Sub-componente: Filtros
function DivisionsFilters({
    filters,
    showFilters,
    onClose,
    onFilterChange,
    onReset,
    onApply
}: DivisionsFiltersProps) {
    if (!showFilters) return null;

    return (
        <div className="fixed inset-0 z-50 lg:absolute lg:inset-auto lg:top-12 lg:right-0 lg:w-80">
            <div className="lg:hidden fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative lg:relative bg-white border-2 border-gray-200 rounded-xl shadow-xl p-4 m-4 lg:m-0 max-h-[80vh] overflow-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Buscar por palabras clave
                        </label>
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-3 text-gray-500" />
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => onFilterChange("search", e.target.value)}
                                placeholder="Buscar..."
                                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-gray-50 text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            value={filters.status}
                            onChange={(e) => onFilterChange("status", e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-gray-50 text-gray-700 text-sm"
                        >
                            <option value="">Todos los estados</option>
                            <option value="active">Activo</option>
                            <option value="inactive">Inactivo</option>
                        </select>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button
                            onClick={onReset}
                            className="flex-1 px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium text-sm"
                        >
                            Resetear
                        </button>
                        <button
                            onClick={onApply}
                            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:brightness-95 transition font-medium text-sm"
                        >
                            Aplicar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sub-componente: Tabla
function DivisionsTable({
    divisions,
    visibleColumns,
    isGrouped,
    onToggleStatus,
    onEditDivision,
    onDeleteDivision
}: DivisionsTableProps) {

    const getAvatarColor = (code: string): string => {
        const colors: Record<string, string> = {
            "ING": "bg-orange-500",
            "DS": "bg-blue-500",
            "MC": "bg-purple-500",
        };
        return colors[code] || "bg-gray-500";
    };

    return (
        <>
            {/* Mobile/Tablet View - Cards */}
            <div className="lg:hidden p-3 sm:p-4 space-y-3">
                {divisions.map((division) => (
                    <DivisionCard
                        key={division.id}
                        division={division}
                        onToggleStatus={onToggleStatus}
                        onEdit={onEditDivision}
                        onDelete={onDeleteDivision}
                    />
                ))}
            </div>

            {/* Desktop View - Table */}
            <div className="hidden lg:block overflow-x-auto">
                {/* Header del contenedor */}
                <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2 bg-gray-50">
                    <List size={18} className="text-gray-700" />
                    <span className="text-sm font-medium text-gray-700">Divisiones Académicas Vigentes</span>
                </div>

                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 text-xs">
                        <tr>
                            <th className="px-4 py-3 w-12">
                                <input type="checkbox" className="rounded border-2 border-gray-300" />
                            </th>
                            {visibleColumns.code && (
                                <th className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <Type size={18} className="text-gray-600" />
                                        <span className="font-semibold">Código Académico</span>
                                    </div>
                                </th>
                            )}
                            {visibleColumns.name && (
                                <th className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <Building2 size={18} className="text-gray-600" />
                                        <span className="font-semibold">Nombre de División</span>
                                    </div>
                                </th>
                            )}
                            {visibleColumns.description && (
                                <th className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <FileText size={18} className="text-gray-600" />
                                        <span className="font-semibold">Descripción</span>
                                    </div>
                                </th>
                            )}
                            {visibleColumns.status && (
                                <th className="px-4 py-3 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <SlidersHorizontal size={18} className="text-gray-600" />
                                        <span className="font-semibold">Status</span>
                                    </div>
                                </th>
                            )}
                            {visibleColumns.acciones && (
                                <th className="px-4 py-3 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <MoreVertical size={18} className="text-gray-600" />
                                        <span className="font-semibold">Acciones</span>
                                    </div>
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {isGrouped ? (
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <td colSpan={6} className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <button className="text-gray-600 hover:text-gray-800">▼</button>
                                        <span className="text-sm font-medium text-gray-700">
                                            Divisiones ({divisions.length})
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            <>
                                {divisions.map((division) => (
                                    <tr key={division.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                                        <td className="px-4 py-3">
                                            <input type="checkbox" className="rounded border-2 border-gray-300" />
                                        </td>
                                        {visibleColumns.code && (
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-8 h-8 rounded-full ${getAvatarColor(division.code)} flex items-center justify-center text-white text-xs font-medium`}>
                                                        {division.code}
                                                    </span>
                                                    <span className="font-medium text-gray-700 text-sm">{division.code}</span>
                                                </div>
                                            </td>
                                        )}
                                        {visibleColumns.name && (
                                            <td className="px-4 py-3">
                                                <span className="font-medium text-gray-700 text-sm">{division.name}</span>
                                            </td>
                                        )}
                                        {visibleColumns.description && (
                                            <td className="px-4 py-3">
                                                <span className="text-gray-700 text-sm">{division.description}</span>
                                            </td>
                                        )}
                                        {visibleColumns.status && (
                                            <td className="px-4 py-3 text-center">
                                                <div
                                                    onClick={() => onToggleStatus(division.id)}
                                                    className="relative inline-flex items-center cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={division.status}
                                                        onChange={() => { }}
                                                        className="sr-only peer"
                                                        readOnly
                                                    />
                                                    <div className={`w-9 h-5 rounded-full transition-colors ${division.status ? 'bg-primary' : 'bg-gray-300'
                                                        }`}></div>
                                                    <div className={`absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all ${division.status ? 'translate-x-4' : 'translate-x-0'
                                                        }`}></div>
                                                </div>
                                            </td>
                                        )}
                                        {visibleColumns.acciones && (
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => onEditDivision(division)}
                                                        className="p-1 rounded hover:bg-gray-200 text-gray-700 transition"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => onDeleteDivision(division.id)}
                                                        className="p-1 rounded hover:bg-gray-200 text-gray-700 transition"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}

// Sub-componente: Paginación
function DivisionsPagination({
    currentPage,
    totalPages,
    currentItemsCount,
    totalItemsCount,
    onPreviousPage,
    onNextPage
}: DivisionsPaginationProps) {
    return (
        <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs sm:text-sm text-gray-700 font-semibold text-center sm:text-left">
                Mostrando {currentItemsCount} de {totalItemsCount} divisiones
                {totalPages > 1 && ` - Página ${currentPage} de ${totalPages}`}
            </p>
            <div className="flex items-center gap-2">
                <button
                    onClick={onPreviousPage}
                    disabled={currentPage === 1}
                    className={`p-2 border-2 border-primary text-primary rounded-lg transition ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-primary hover:text-white"
                        }`}
                >
                    <ChevronLeft size={18} />
                </button>
                <button
                    onClick={onNextPage}
                    disabled={currentPage === totalPages}
                    className={`p-2 border-2 border-primary text-primary rounded-lg transition ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-primary hover:text-white"
                        }`}
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}

// Componente Principal que agrupa todo
export default function DivisionsTablePanel({
    divisions,
    filters,
    visibleColumns,
    isGrouped,
    showFilters,
    showColumns,
    currentPage,
    totalPages,
    currentItemsCount,
    totalItemsCount,
    onToggleStatus,
    onEditDivision,
    onDeleteDivision,
    onFilterChange,
    onColumnToggle,
    onSetShowFilters,
    onSetShowColumns,
    onResetFilters,
    onApplyFilters,
    onPreviousPage,
    onNextPage
}: DivisionsTablePanelProps) {
    return (
        <div className="bg-white rounded-xl border-2 border-gray-200 overflow-visible relative mx-3 sm:mx-4 lg:mx-0">
            {/* Filtros Dropdown */}
            <div className="relative">
                <DivisionsFilters
                    filters={filters}
                    showFilters={showFilters}
                    onClose={() => onSetShowFilters(false)}
                    onFilterChange={onFilterChange}
                    onReset={onResetFilters}
                    onApply={onApplyFilters}
                />
            </div>

            {/* Columnas Dropdown */}
            <div className="relative">
                <DivisionsColumns
                    visibleColumns={visibleColumns}
                    showColumns={showColumns}
                    setShowColumns={onSetShowColumns}
                    onColumnToggle={onColumnToggle}
                />
            </div>

            {/* Tabla */}
            <DivisionsTable
                divisions={divisions}
                visibleColumns={visibleColumns}
                isGrouped={isGrouped}
                onToggleStatus={onToggleStatus}
                onEditDivision={onEditDivision}
                onDeleteDivision={onDeleteDivision}
            />

            {/* Paginación */}
            <DivisionsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                currentItemsCount={currentItemsCount}
                totalItemsCount={totalItemsCount}
                onPreviousPage={onPreviousPage}
                onNextPage={onNextPage}
            />
        </div>
    );
}