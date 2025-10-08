"use client";

import { useState } from "react";
import { Palette, Check, Plus } from "lucide-react";

interface Props {
  initialColor?: string;
  onColorSelect?: (color: string) => void;
}

const presetColors = [
  { name: "Morado", value: "#8B5CF6" },
  { name: "Azul", value: "#3B82F6" },
  { name: "Rosa", value: "#EC4899" },
  { name: "Verde", value: "#34D399" },
  { name: "Naranja", value: "#F97316" },
];

export default function ThemeColorCard({ initialColor, onColorSelect }: Props) {
  const [selected, setSelected] = useState(initialColor || "#3B82F6");
  const [customColor, setCustomColor] = useState<string | null>(null);

  const handleSelect = (color: string) => {
    setSelected(color);
    onColorSelect?.(color);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
    handleSelect(color);
  };

  const handleSave = () => {
    console.log("Color guardado:", selected);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Encabezado */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 bg-white">
          <Palette className="w-4 h-4 text-gray-700" />
        </div>
        <h3 className="text-sm font-medium text-gray-900">Tema de color</h3>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Personaliza tu dashboard seleccionando un color principal o define uno manualmente.
      </p>

      {/* Paleta de colores */}
      <div className="flex items-center gap-4 flex-wrap mb-6">
        {presetColors.map((color) => {
          const isSelected = selected === color.value;
          return (
            <button
              key={color.value}
              onClick={() => handleSelect(color.value)}
              className="relative w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer border transition-all duration-150"
              style={
                isSelected
                  ? {
                      backgroundColor: color.value,
                      boxShadow: `0 0 0 3px white, 0 0 0 5px ${color.value}`,
                      borderColor: "transparent",
                    }
                  : { backgroundColor: color.value, borderColor: "#E5E7EB" }
              }
              title={color.name}
            >
              {isSelected && <Check className="text-white w-5 h-5" strokeWidth={3} />}
            </button>
          );
        })}

        {/* Opción para seleccionar color personalizado */}
        <label
          className="relative w-10 h-10 rounded-lg border border-dashed border-gray-300 flex items-center justify-center cursor-pointer transition-all duration-150"
          title="Seleccionar color personalizado"
        >
          <Plus className="w-4 h-4 text-gray-500" />
          <input
            type="color"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleCustomColorChange}
          />
        </label>

        {/* Color personalizado elegido */}
        {customColor && (
          <div
            onClick={() => handleSelect(customColor)}
            className="relative w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer border transition-all duration-150"
            style={
              selected === customColor
                ? {
                    backgroundColor: customColor,
                    boxShadow: `0 0 0 3px white, 0 0 0 5px ${customColor}`,
                    borderColor: "transparent",
                  }
                : { backgroundColor: customColor, borderColor: "#E5E7EB" }
            }
            title="Color personalizado"
          >
            {selected === customColor && <Check className="text-white w-5 h-5" strokeWidth={3} />}
          </div>
        )}
      </div>

      {/* Botón Guardar con color dinámico */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="text-white text-sm font-medium px-4 py-2 rounded-lg shadow transition"
          style={{
            backgroundColor: selected,
          }}
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
