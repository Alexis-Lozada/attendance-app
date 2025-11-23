"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  label: string;
  value: string;
  esTutor?: boolean;
  subtitle?: string; // subtítulo opcional (ej: nombre del módulo)
  [key: string]: any;
}

interface FilterSelectProps {
  title: string;
  value: string;
  options: Option[];
  onSelect: (value: string) => void;
  icon?: React.ReactNode;
}

export default function FilterSelect({
  title,
  value,
  options,
  onSelect,
  icon,
}: FilterSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // cerrar si clicas fuera
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectedOption =
    options.find((o) => o.value === value) ||
    options.find((o) => o.label === value);

  return (
    <div ref={ref} className="relative">
      {/* Card */}
      <div
        onClick={() => setOpen(!open)}
        className="bg-white rounded-xl p-4 border border-gray-200 cursor-pointer"
      >
        {/* Título con icono */}
        <div className="flex items-center gap-2 mb-2">
          {icon && <span className="text-gray-900">{icon}</span>}
          <h4 className="text-sm font-medium text-gray-900">{title}</h4>
        </div>

        {/* Valor + flecha */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col text-left">
            <span className="text-sm text-gray-700">
              {selectedOption ? selectedOption.label : "Selecciona..."}
            </span>

            {selectedOption?.subtitle && (
              <span className="text-xs text-gray-500">
                {selectedOption.subtitle}
              </span>
            )}
          </div>

          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-20">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onSelect(opt.value);
                setOpen(false);
              }}
              className="w-full flex items-start justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
            >
              <div className="flex flex-col items-start text-left">
                <span>{opt.label}</span>
                {opt.subtitle && (
                  <span className="text-xs text-gray-500">
                    {opt.subtitle}
                  </span>
                )}
              </div>

              {opt.esTutor && (
                <span className="bg-primary text-white px-2 py-1 rounded-sm font-medium text-xs">
                  Grupo tutorado
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
