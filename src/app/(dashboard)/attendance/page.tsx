// app/attendance/page.tsx
"use client";

import Calendar from "@/components/attendance/Calendar";

export default function AttendancePage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Columna izquierda (más pequeña) */}
      <div className="lg:col-span-4 space-y-6">
        <Calendar />

        {/* Filtros */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h4 className="text-sm font-medium mb-2">Curso</h4>
          <p className="text-sm text-gray-600">Desarrollo Web Profesional (9IDWI)</p>
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

      {/* Columna derecha (más amplia) */}
      <div className="lg:col-span-8 bg-white rounded-xl p-4 border border-gray-200">
        <h3 className="text-base font-medium mb-4">Attendance List</h3>
        <p className="text-gray-500 text-sm">
          Aquí después vamos a poner la tabla de asistencia.
        </p>
      </div>
    </div>
  );
}
