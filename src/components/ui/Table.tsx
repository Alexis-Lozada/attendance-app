"use client";

import { ReactNode, useState } from "react";
import { List, ChevronLeft, ChevronRight, Search } from "lucide-react";

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  icon?: ReactNode;
  render?: (item: T) => ReactNode;
  align?: "left" | "center" | "right";
}

interface TableProps<T extends Record<string, any>> {
  title: string;
  columns: TableColumn<T>[];
  data: T[];
  currentPage: number;
  totalPages: number;
  currentItemsCount: number;
  totalItemsCount: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onSearch?: (term: string) => void; // 🔹 Nuevo callback para el buscador
  emptyMessage?: string;
}

/**
 * Tabla genérica con buscador, paginación y estructura visual moderna.
 * Mantiene la tipografía, colores y pesos originales de tu tabla anterior.
 */
export default function Table<T extends Record<string, any>>({
  title,
  columns,
  data,
  currentPage,
  totalPages,
  currentItemsCount,
  totalItemsCount,
  onPreviousPage,
  onNextPage,
  onSearch,
  emptyMessage = "No hay datos para mostrar.",
}: TableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {/* === Encabezado superior === */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        {/* Icono y título */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200">
            <List className="w-4 h-4 text-gray-700" />
          </div>
          <h3 className="text-[14px] font-medium text-gray-900">{title}</h3>
        </div>

        {/* Buscador */}
        <div className="relative w-full sm:w-60">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value;
              setSearchTerm(value);
              onSearch?.(value); // 🔹 Emitir búsqueda al padre
            }}
            className="w-full pl-9 pr-3 py-2 text-[13px] text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                onSearch?.("");
              }}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-[14px]"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* === Tabla === */}
      {data.length > 0 ? (
        <div className="w-full max-w-full overflow-x-auto rounded-md border border-gray-200">
          <div className="min-w-[700px]">
            <table className="w-full text-[13px] text-left text-gray-700">
              <thead className="bg-gray-50 text-gray-700">
                <tr className="border-b border-gray-200">
                  {columns.map((col) => (
                    <th
                      key={String(col.key)}
                      className={`px-5 py-3 font-medium ${
                        col.align === "center"
                          ? "text-center"
                          : col.align === "right"
                          ? "text-right"
                          : "text-left"
                      }`}
                    >
                      <div
                        className={`flex items-center ${
                          col.align === "center"
                            ? "justify-center"
                            : col.align === "right"
                            ? "justify-end"
                            : "justify-start"
                        } gap-2`}
                      >
                        {col.icon && (
                          <span className="text-gray-600 w-4 h-4">{col.icon}</span>
                        )}
                        <span className="text-gray-700">{col.label}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
                
              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    {columns.map((col) => (
                      <td
                        key={String(col.key)}
                        className={`px-5 py-[10px] text-gray-700 ${
                          col.align === "center"
                            ? "text-center"
                            : col.align === "right"
                            ? "text-right"
                            : "text-left"
                        }`}
                      >
                        {col.render
                          ? col.render(item)
                          : String((item as any)[col.key] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-sm text-center py-4">{emptyMessage}</p>
      )}

      {/* === Paginación === */}
      {data.length > 0 && (
        <div className="px-2 py-3 flex flex-col sm:flex-row justify-between items-center gap-3 text-[13px] border-t border-gray-200 mt-4">
          <p className="text-gray-700 font-medium text-center sm:text-left">
            Mostrando {currentItemsCount} de {totalItemsCount} registros — Página{" "}
            {currentPage} de {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onPreviousPage}
              disabled={currentPage === 1}
              className={`p-1.5 border border-primary text-primary rounded-md transition-all ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-primary hover:text-white"
              }`}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={onNextPage}
              disabled={currentPage === totalPages}
              className={`p-1.5 border border-primary text-primary rounded-md transition-all ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-primary hover:text-white"
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
