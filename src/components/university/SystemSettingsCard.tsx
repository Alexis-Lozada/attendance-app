"use client";

import { useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { Settings } from "lucide-react";

export default function SystemSettingsCard() {
  const [minAttendance, setMinAttendance] = useState([80]);

  const handleSave = () => {
    console.log("Configuración guardada:", {
      minAttendance: minAttendance[0],
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Encabezado */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 bg-white">
          <Settings className="w-4 h-4 text-gray-700" />
        </div>
        <h3 className="text-sm font-medium text-gray-900">Asistencia mínima</h3>
      </div>

      {/* Descripción */}
      <p className="text-sm text-gray-500 mb-4">
        Define el porcentaje mínimo de asistencia requerido para que un estudiante
        acredite una materia o módulo.
      </p>

      {/* Control moderno (Radix Slider) */}
      <div className="flex items-center gap-4 mb-6 py-1">
        {/* Slider visual */}
        <Slider.Root
          className="relative flex items-center select-none w-full h-5"
          value={minAttendance}
          max={100}
          min={50}
          step={1}
          onValueChange={setMinAttendance}
        >
          {/* Barra de fondo */}
          <Slider.Track className="bg-gray-200 relative flex-grow rounded-full h-2">
            <Slider.Range className="absolute h-full rounded-full bg-primary" />
          </Slider.Track>

          {/* Control del usuario */}
          <Slider.Thumb
            className="block w-5 h-5 bg-white border-2 border-primary rounded-full hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            aria-label="Porcentaje mínimo"
          />
        </Slider.Root>

        {/* Valor numérico */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="50"
            max="100"
            value={minAttendance[0]}
            onChange={(e) => setMinAttendance([Number(e.target.value)])}
            className="w-16 border border-gray-300 rounded-md px-2 py-1 text-sm text-center text-gray-900 
                       focus:ring-1 focus:ring-primary focus:outline-none transition"
          />
          <span className="text-sm text-gray-600">%</span>
        </div>
      </div>

      {/* Botón Guardar */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg transition hover:brightness-95"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
