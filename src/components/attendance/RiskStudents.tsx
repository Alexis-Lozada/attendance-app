"use client";

import { FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Student {
  id: number;
  name: string;
  avatar: string;
  absences: number;
  remaining: number;
  risk: number; // porcentaje
  color: "red" | "orange";
}

const students: Student[] = [
  {
    id: 1,
    name: "Alexis Lozada Salinas",
    avatar: "/images/user.jpg",
    absences: 10,
    remaining: 0,
    risk: 58,
    color: "red",
  },
  {
    id: 2,
    name: "Alexis Lozada Salinas",
    avatar: "/images/user.jpg",
    absences: 5,
    remaining: 1,
    risk: 81,
    color: "orange",
  },
  {
    id: 3,
    name: "Estudiante Ejemplo",
    avatar: "/images/user.jpg",
    absences: 7,
    remaining: 2,
    risk: 72,
    color: "orange",
  },
  {
    id: 4,
    name: "Otro Estudiante",
    avatar: "/images/user.jpg",
    absences: 12,
    remaining: 0,
    risk: 45,
    color: "red",
  },
  {
    id: 5,
    name: "Alumno Extra",
    avatar: "/images/user.jpg",
    absences: 4,
    remaining: 1,
    risk: 85,
    color: "orange",
  },
];

export default function RiskStudents() {
  const [page, setPage] = useState(0);
  const pageSize = 2;

  const startIndex = page * pageSize;
  const visibleStudents = students.slice(startIndex, startIndex + pageSize);

  const totalPages = Math.ceil(students.length / pageSize);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-4">
        {/* Título */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200">
            <FileText className="w-4 h-4 text-gray-700" />
          </div>
          <h3 className="text-sm font-medium text-gray-900">
            Estudiantes en riesgo
          </h3>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {startIndex + 1}-{Math.min(startIndex + pageSize, students.length)}{" "}
            de {students.length}
          </span>
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
            className="p-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
            disabled={page === totalPages - 1}
            className="p-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>  
        </div>
      </div>

      {/* Lista de estudiantes */}
      <div className="space-y-3">
        {visibleStudents.map((student) => (
          <div
            key={student.id}
            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
          >
            {/* Avatar */}
            <img
              src={student.avatar}
              alt={student.name}
              className="w-10 h-10 rounded-md object-cover"
            />

            {/* Info */}
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {student.name}
              </p>
              <p className="text-xs text-gray-500">
                {student.absences} faltas / {student.remaining} restante
              </p>

              {/* Barra de progreso */}
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-2 rounded bg-gray-200 overflow-hidden">
                  <div
                    className={`h-full ${
                      student.color === "red"
                        ? "bg-red-400"
                        : "bg-orange-400"
                    }`}
                    style={{ width: `${student.risk}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {student.risk}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
