"use client";

import { Loader2 } from "lucide-react";

interface SpinnerProps {
  text?: string;
  fullScreen?: boolean;
}

export default function Spinner({ text = "Cargando...", fullScreen = false }: SpinnerProps) {
  const containerClasses = fullScreen
    ? "flex flex-col items-center justify-center min-h-[75vh] text-gray-500"
    : "flex flex-col items-center justify-center text-gray-500";

  return (
    <div className={containerClasses}>
      <Loader2 className="w-6 h-6 animate-spin mb-2" />
      <p>{text}</p>
    </div>
  );
}
