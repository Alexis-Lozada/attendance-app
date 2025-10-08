"use client";

import { useState } from "react";
import { Settings, X } from "lucide-react";

export default function SystemSettingsCard() {
  const [minAttendance, setMinAttendance] = useState(80);
  const [excludedDates, setExcludedDates] = useState<string[]>([]);

  const handleAddDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (newDate && !excludedDates.includes(newDate)) {
      setExcludedDates([...excludedDates, newDate]);
    }
  };

  const handleRemoveDate = (date: string) => {
    setExcludedDates((prev) => prev.filter((d) => d !== date));
  };

  const handleSave = () => {
    console.log("Configuración guardada:", {
      minAttendance,
      excludedDates,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      {/* Encabezado */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 bg-white">
          <Settings className="w-4 h-4 text-gray-700" />
        </div>
        <h3 className="text-sm font-medium text-gray-900">
          Configuración del sistema
        </h3>
      </div>

      {/* Porcentaje mínimo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Porcentaje mínimo de asistencia para acreditar
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="50"
            max="100"
            step="1"
            value={minAttendance}
            onChange={(e) => setMinAttendance(Number(e.target.value))}
            className="flex-1 accent-[#2B2B2B] cursor-pointer"
          />
          <input
            type="number"
            min="50"
            max="100"
            value={minAttendance}
            onChange={(e) => setMinAttendance(Number(e.target.value))}
            className="w-16 border border-gray-300 rounded-md px-2 py-1 text-sm text-center"
          />
          <span className="text-sm text-gray-600">%</span>
        </div>
      </div>

      {/* Fechas específicas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fechas específicas a excluir
        </label>

        {/* Input para agregar fechas */}
        <div className="flex items-center gap-3 mb-3">
          <input
            type="date"
            onChange={handleAddDate}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#2B2B2B]"
          />
        </div>

        {/* Lista de fechas agregadas */}
        <div className="space-y-1">
          {excludedDates.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No hay fechas excluidas.</p>
          ) : (
            excludedDates.map((date) => (
              <div
                key={date}
                className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md px-3 py-1"
              >
                <span className="text-sm text-gray-700">
                  {new Date(date).toLocaleDateString("es-MX", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <button
                  onClick={() => handleRemoveDate(date)}
                  className="text-gray-500 hover:text-red-500 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Botón guardar */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          className="text-white text-sm font-medium px-4 py-2 rounded-lg shadow transition"
          style={{
            backgroundColor: "#2B2B2B",
          }}
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
