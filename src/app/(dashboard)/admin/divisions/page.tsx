"use client";

import { useEffect, useState } from "react";
import Table, { TableColumn } from "@/components/ui/Table";
import Switch from "@/components/ui/Switch";
import { useAuth } from "@/context/AuthContext";
import { getDivisionsByUniversity } from "@/services/division.service";
import type { Division } from "@/components/divisions/DivisionsTypes";
import {
  Type,
  Building2,
  FileText,
  SlidersHorizontal,
  MoreVertical,
  Edit2,
  Trash2,
  Plus,
} from "lucide-react";

export default function DivisionsPage() {
  const { user } = useAuth();
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // 🔹 Estado de búsqueda
  const divisionsPerPage = 5;

  useEffect(() => {
    if (!user?.idUniversity) return;

    const loadDivisions = async () => {
      try {
        setLoading(true);
        const data = await getDivisionsByUniversity(user.idUniversity);
        const mappedDivisions: Division[] = data.map((d) => ({
          id: d.idDivision,
          idUniversity: d.idUniversity,
          code: d.code,
          name: d.name,
          description: d.description,
          status: d.status,
        }));
        setDivisions(mappedDivisions);
      } catch (error) {
        console.error("Error al cargar divisiones:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDivisions();
  }, [user?.idUniversity]);

  if (!user) return <p className="text-gray-500">Iniciando sesión...</p>;
  if (loading) return <p className="text-gray-500">Cargando divisiones...</p>;

  // 🔍 Buscar solo por los campos relevantes
  const filteredDivisions = divisions.filter((d) => {
    const term = searchTerm.toLowerCase();
    return (
      d.code?.toLowerCase().includes(term) ||
      d.name?.toLowerCase().includes(term) ||
      d.description?.toLowerCase().includes(term)
    );
  });

  // 🔹 Calcular paginación sobre los datos filtrados
  const totalPages = Math.ceil(filteredDivisions.length / divisionsPerPage);
  const indexOfLast = currentPage * divisionsPerPage;
  const indexOfFirst = indexOfLast - divisionsPerPage;
  const currentDivisions = filteredDivisions.slice(indexOfFirst, indexOfLast);

  const columns: TableColumn<Division>[] = [
    { key: "code", label: "Código Académico", icon: <Type size={16} /> },
    { key: "name", label: "Nombre de División", icon: <Building2 size={16} /> },
    { key: "description", label: "Descripción", icon: <FileText size={16} /> },
    {
      key: "status",
      label: "Status",
      icon: <SlidersHorizontal size={16} />,
      align: "center",
      render: (item) => (
        <div className="flex justify-center">
          <Switch
            checked={item.status}
            onChange={() =>
              setDivisions((prev) =>
                prev.map((d) =>
                  d.id === item.id ? { ...d, status: !d.status } : d
                )
              )
            }
          />
        </div>
      ),
    },
    {
      key: "acciones",
      label: "Acciones",
      icon: <MoreVertical size={16} />,
      align: "center",
      render: () => (
        <div className="flex justify-center gap-3">
          <button
            title="Editar"
            className="text-gray-600 hover:text-primary transition"
          >
            <Edit2 size={15} />
          </button>
          <button
            title="Eliminar"
            className="text-gray-600 hover:text-red-500 transition"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  // 🔹 handler temporal del botón agregar
  const handleAddDivision = () => {
    alert("Abrir modal para agregar nueva división (pendiente)");
  };

  return (
    <div className="flex flex-col gap-8">
      {/* === Header con título, descripción y botón === */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900">
            Lista de divisiones
          </h3>
          <p className="text-[13px] text-gray-500">
            Aquí puedes visualizar las divisiones activas o inactivas dentro del sistema académico.
          </p>
        </div>

        <button
          onClick={handleAddDivision}
          className="w-full sm:w-auto px-5 py-2.5 bg-primary text-white rounded-lg flex items-center justify-center gap-2 transition-all hover:brightness-95 text-sm font-medium"
        >
          <Plus size={18} />
          <span>Nueva división</span>
        </button>
      </header>

      {/* === Tabla === */}
      <section className="space-y-2">
        <Table
          title="Divisiones Académicas Vigentes"
          columns={columns}
          data={currentDivisions}
          currentPage={currentPage}
          totalPages={totalPages}
          currentItemsCount={currentDivisions.length}
          totalItemsCount={filteredDivisions.length}
          onPreviousPage={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          onNextPage={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          onSearch={setSearchTerm} // 🔹 Conecta el buscador
        />
      </section>
    </div>
  );
}
