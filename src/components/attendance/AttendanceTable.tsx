"use client";

import { List } from "lucide-react";

interface Student {
  id: string;
  name: string;
  photo: string;
  absences: number;
  remaining: number;
  attendance: number;
  status: "Presente" | "Ausente" | "Justificado" | "Retardo";
}

const students: Student[] = [
  {
    id: "#2023171015",
    name: "Alexis Lozada",
    photo: "/images/user.jpg",
    absences: 3,
    remaining: 1,
    attendance: 88,
    status: "Presente",
  },
  {
    id: "#2023171015",
    name: "Alexis Lozada",
    photo: "/images/user.jpg",
    absences: 3,
    remaining: 1,
    attendance: 88,
    status: "Ausente",
  },
  {
    id: "#2023171015",
    name: "Alexis Lozada",
    photo: "/images/user.jpg",
    absences: 3,
    remaining: 1,
    attendance: 88,
    status: "Justificado",
  },
  {
    id: "#2023171015",
    name: "Alexis Lozada",
    photo: "/images/user.jpg",
    absences: 3,
    remaining: 1,
    attendance: 88,
    status: "Retardo",
  },
];

export default function AttendanceTable() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {/* Encabezado */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200">
          <List className="w-4 h-4 text-gray-700" />
        </div>
        <h3 className="text-sm font-medium text-gray-900">Lista de Asistencia</h3>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="text-xs text-gray-500 border-b">
              <th className="p-2">
                <input type="checkbox" />
              </th>
              <th className="p-2">Matrícula</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Faltas totales</th>
              <th className="p-2">% Asistencias</th>
              <th className="p-2">Status</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="p-2">
                  <input type="checkbox" />
                </td>
                <td className="p-2 text-gray-700">{s.id}</td>
                <td className="p-2 flex items-center gap-2">
                  <img
                    src={s.photo}
                    alt={s.name}
                    className="w-8 h-8 rounded-md object-cover"
                  />
                  <span className="text-gray-900">{s.name}</span>
                </td>
                <td className="p-2 text-gray-700">
                  {s.absences} faltas / {s.remaining} restante
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded bg-gray-200">
                      <div
                        className="h-2 rounded bg-green-400"
                        style={{ width: `${s.attendance}%` }}
                      ></div>
                    </div>
                    <span>{s.attendance}%</span>
                  </div>
                </td>
                <td className="p-2">
                  {s.status === "Presente" && (
                    <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700 font-medium">
                      Presente
                    </span>
                  )}
                  {s.status === "Ausente" && (
                    <span className="px-2 py-0.5 rounded text-xs bg-red-100 text-red-700 font-medium">
                      Ausente
                    </span>
                  )}
                  {s.status === "Justificado" && (
                    <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700 font-medium">
                      Justificado
                    </span>
                  )}
                  {s.status === "Retardo" && (
                    <span className="px-2 py-0.5 rounded text-xs bg-yellow-100 text-yellow-700 font-medium">
                      Retardo
                    </span>
                  )}
                </td>
                <td className="p-2">
                  <button className="text-gray-400 hover:text-gray-600">⋮</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
