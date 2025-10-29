"use client";

import Calendar from "@/components/attendance/Calendar";
import AttendanceStats from "@/components/attendance/AttendanceStats";
import RiskStudents from "@/components/attendance/RiskStudents";
import AttendanceTable from "@/components/attendance/AttendanceTable";

export default function AttendancePage() {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Columna izquierda */}
      <div className="space-y-6 min-w-[240px] flex-shrink-0 lg:w-1/4">
        <Calendar />

        {/* Filtros */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h4 className="text-sm font-medium mb-2">Curso</h4>
          <p className="text-sm text-gray-600">
            Desarrollo Web Profesional (9IDWI)
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h4 className="text-sm font-medium mb-2">Semestre</h4>
          <p className="text-sm text-gray-600">9no Cuatrimestre</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h4 className="text-sm font-medium mb-2">Grupo</h4>
          <p className="text-sm text-gray-600">IDGS12</p>
        </div>
      </div>

      {/* Columna derecha */}
      <div className="flex-1 space-y-6">
        {/* Contenedor con curso, hora y botón */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Columna 1: Curso */}
          <div>
            <h4 className="text-sm font-medium text-gray-900">
              Desarrollo Web Profesional (9IDWI)
            </h4>
            <p className="text-xs text-gray-500">9no Semestre | Grupo IDGS12</p>
          </div>

          {/* Columna 2: Hora */}
          <div className="md:border-l md:border-gray-200 md:pl-4">
            <h4 className="text-sm font-medium text-gray-900">
              Hora - 10:00 AM a 10:45 AM
            </h4>
            <p className="text-xs text-gray-500">
              Semana 3 - Martes 17 de enero 2020
            </p>
          </div>

          {/* Columna 3: Botón */}
          <div>
            <button className="bg-[#2B2B2B] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#3c3c3c] transition">
              Pasar Asistencia
            </button>
          </div>
        </div>

        {/* Grid de estadísticas y estudiantes en riesgo */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Estadísticas de asistencia */}
          <AttendanceStats
            rate={89.2}
            diff={2.8}
            onTime={86}
            late={12}
            pending={2}
          />

          {/* Estudiantes en riesgo */}
          <RiskStudents />
        </div>

        {/* Lista de asistencia */}
        <AttendanceTable />
      </div>
    </div>
  );
}
