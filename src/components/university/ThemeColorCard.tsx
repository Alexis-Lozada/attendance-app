"use client";

import { useState, useEffect } from "react";
import { Palette, Check, Plus } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { updateUniversityThemeColor } from "@/services/configuration.service";

const presetColors = [
  { name: "Morado", value: "#8B5CF6" },
  { name: "Azul", value: "#3B82F6" },
  { name: "Rosa", value: "#EC4899" },
  { name: "Verde", value: "#34D399" },
  { name: "Naranja", value: "#F97316" },
];

export default function ThemeColorCard() {
  const { color, setColor } = useTheme();
  const { user } = useAuth();
  const [selected, setSelected] = useState(color);
  const [customColor, setCustomColor] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSelected(color);
  }, [color]);

  const handleSelect = (color: string) => {
    setSelected(color);
    setColor(color);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    handleSelect(newColor);
  };

  const handleSave = async () => {
    if (!user?.idUniversity) return alert("No se pudo determinar la universidad del usuario");
    setSaving(true);
    try {
      await updateUniversityThemeColor(user.idUniversity, selected);
      alert("Color de tema actualizado correctamente ✅");
    } catch (error) {
      console.error("Error al guardar color:", error);
      alert("Error al guardar el color ❌");
    } finally {
      setSaving(false);
    }
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

      {/* Paleta */}
      <div className="flex items-center gap-4 flex-wrap mb-6">
        {presetColors.map((colorItem) => {
          const isSelected = selected === colorItem.value;
          return (
            <button
              key={colorItem.value}
              onClick={() => handleSelect(colorItem.value)}
              className="relative w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer border transition-all duration-150"
              style={
                isSelected
                  ? {
                      backgroundColor: colorItem.value,
                      boxShadow: `0 0 0 3px white, 0 0 0 5px ${colorItem.value}`,
                      borderColor: "transparent",
                    }
                  : { backgroundColor: colorItem.value, borderColor: "#E5E7EB" }
              }
              title={colorItem.name}
            >
              {isSelected && <Check className="text-white w-5 h-5" strokeWidth={3} />}
            </button>
          );
        })}

        {/* Color personalizado */}
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

      {/* Botón Guardar */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`text-white text-sm font-medium px-4 py-2 rounded-lg shadow transition ${
            saving ? "opacity-60 cursor-not-allowed" : "hover:brightness-95"
          }`}
          style={{ backgroundColor: selected }}
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
