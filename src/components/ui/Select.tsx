"use client";

import { ReactNode, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";

export interface SelectOption {
    value: string | number;
    label: string;
    icon?: ReactNode;
}

interface SelectProps {
    label: string;
    options: SelectOption[];
    value: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    searchable?: boolean;
    required?: boolean;
    disabled?: boolean;
    error?: string;
}

export default function Select({
    label,
    options,
    value,
    onChange,
    placeholder = "Seleccionar...",
    searchable = false,
    required = false,
    disabled = false,
    error,
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const selectedOption = options.find(opt => opt.value === value);
    const filteredOptions = searchable
        ? options.filter(opt =>
            opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : options;

    const handleSelect = (optionValue: string | number) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm("");
    };

    const clearSelection = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
    };

    return (
        <div className="relative">
            {/* Label */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {/* Trigger */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`w-full flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 text-sm text-left transition-all ${disabled
                        ? "bg-gray-100 cursor-not-allowed text-gray-400"
                        : "bg-white hover:border-gray-400 focus:ring-1 focus:ring-primary focus:border-primary"
                    } ${error ? "border-red-500 focus:ring-red-200 focus:border-red-500" : ""}`}
            >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    {selectedOption?.icon && (
                        <span className="text-gray-600 flex-shrink-0">
                            {selectedOption.icon}
                        </span>
                    )}
                    <span className={`truncate ${!selectedOption ? "text-gray-400" : "text-gray-900"}`}>
                        {selectedOption?.label || placeholder}
                    </span>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    {value && !disabled && (
                        <span
                            onClick={clearSelection}
                            className="text-gray-400 hover:text-gray-600 p-0.5 rounded cursor-pointer"
                        >
                            <X size={14} />
                        </span>
                    )}
                    <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""
                            }`}
                    />
                </div>
            </button>

            {/* Error Message */}
            {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
            )}

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {/* Search Input */}
                    {searchable && (
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                    autoFocus
                                />
                            </div>
                        </div>
                    )}

                    {/* Options List */}
                    <div className="py-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleSelect(option.value)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${option.value === value ? "bg-primary/10 text-primary" : "text-gray-700"
                                        }`}
                                >
                                    {option.icon && (
                                        <span className="text-gray-600 flex-shrink-0">
                                            {option.icon}
                                        </span>
                                    )}
                                    <span className="flex-1 truncate">{option.label}</span>
                                </button>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-sm text-gray-500 text-center">
                                No se encontraron opciones
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}