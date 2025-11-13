"use client";

import { X } from "lucide-react";
import { useRef } from "react";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "small" | "medium" | "large" | "xlarge";
}

export default function Modal({ 
  title, 
  isOpen, 
  onClose, 
  children,
  size = "medium" 
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  // Configuración de tamaños
  const sizeClasses = {
    small: "max-w-md",
    medium: "max-w-lg",
    large: "max-w-2xl",
    xlarge: "max-w-4xl"
  };

  return (
    <div
      ref={modalRef}
      onClick={handleBackgroundClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div
        className={`bg-white w-full ${sizeClasses[size]} rounded-xl border border-gray-200 p-6 relative animate-fadeIn max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()} // evita cerrar al hacer clic dentro
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-600 cursor-pointer" />
          </button>
        </div>

        {/* Content - con scroll si es necesario */}
        <div className="overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}