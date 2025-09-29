"use client";

import { FileText } from "lucide-react";
import { useEffect, useState } from "react";

interface AttendanceStatsProps {
  rate: number; // tasa de asistencia (ej. 89.2)
  diff: number; // diferencia respecto a la clase anterior (ej. +2.8)
  onTime: number; // % a tiempo
  late: number; // % tarde
  pending: number; // % pendiente
}

export default function AttendanceStats({
  rate,
  diff,
  onTime,
  late,
  pending,
}: AttendanceStatsProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  // 🔹 Normalizamos para que nunca se pase de 100
  const total = onTime + late + pending;
  const nOnTime = (onTime / total) * 100;
  const nLate = (late / total) * 100;
  const nPending = (pending / total) * 100;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {/* Encabezado */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 bg-white">
          <FileText className="w-4 h-4 text-gray-700" />
        </div>
        <h3 className="text-sm font-medium text-gray-900">Asistencia de hoy</h3>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Tasa de asistencia */}
        <div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-medium text-gray-900">
              {rate.toFixed(1)}%
            </p>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded ${
                diff >= 0
                  ? "text-green-700 bg-green-100"
                  : "text-red-700 bg-red-100"
              }`}
            >
              {diff > 0 ? `+${diff}%` : `${diff}%`}
            </span>
          </div>
          <span className="text-xs text-gray-500">Tasa de Asistencia</span>
        </div>

        {/* Valores de asistencia */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center">
            <span className="w-4 h-1.5 rounded bg-green-200 mb-1"></span>
            <p className="text-xs text-gray-500">A tiempo</p>
            <p className="text-sm font-medium text-gray-900">
              {nOnTime.toFixed(0)}%
            </p>
          </div>
          <div className="flex flex-col items-center">
            <span className="w-4 h-1.5 rounded bg-orange-200 mb-1"></span>
            <p className="text-xs text-gray-500">Tarde</p>
            <p className="text-sm font-medium text-gray-900">
              {nLate.toFixed(0)}%
            </p>
          </div>
          <div className="flex flex-col items-center">
            <span className="w-4 h-1.5 rounded bg-gray-200 mb-1"></span>
            <p className="text-xs text-gray-500">Pendiente</p>
            <p className="text-sm font-medium text-gray-900">
              {nPending.toFixed(0)}%
            </p>
          </div>
        </div>
      </div>

      {/* Gráfica */}
      <div className="flex items-end gap-0.5 mt-4 w-full h-20">
        {[...Array(30)].map((_, i) => {
          let color = "bg-gray-200"; // por defecto = pendiente
          if (i < (nOnTime / 100) * 30) {
            color = "bg-green-300";
          } else if (i < ((nOnTime + nLate) / 100) * 30) {
            color = "bg-orange-300";
          }

          return (
            <div
              key={i}
              className={`flex-1 ${color} rounded transition-all duration-700 ease-out`}
              style={{
                height: animate ? "100%" : "0%",
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
}
