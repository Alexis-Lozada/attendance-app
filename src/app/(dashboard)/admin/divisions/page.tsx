// page.tsx - VERSION LIMPIA
"use client";

import { useEffect, useState } from "react";
import DivisionsHeader from "@/components/divisions/DivisionsHeader";
import DivisionsToolbar from "@/components/divisions/DivisionsToolbar";
import DivisionsTablePanel from "@/components/divisions/DivisionsTablePanel";
import DivisionsModal from "@/components/divisions/DivisionsAddModal";
import DivisionEditModal from "@/components/divisions/DivisionEditModal";
import { useAuth } from "@/context/AuthContext";
import type { Division, Filters, VisibleColumns, ColumnKey } from "@/components/divisions/DivisionsTypes";
import {
  getDivisionsByUniversity,
  createDivision,
  updateDivision,
  updateDivisionStatus,
  deleteDivision
} from "@/services/division.service";

export default function DivisionsPage() {
  const { user } = useAuth();
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({ search: "", status: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  const [isGrouped, setIsGrouped] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddDivisionModal, setShowAddDivisionModal] = useState(false);
  const [showEditDivisionModal, setShowEditDivisionModal] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState<Division | null>(null);

  const divisionsPerPage = 5;

  const [visibleColumns, setVisibleColumns] = useState<VisibleColumns>({
    code: true, name: true, description: true, status: true, acciones: true,
  });

  // Cargar divisiones al montar el componente
  useEffect(() => {
    if (!user?.idUniversity) return;

    const loadDivisions = async () => {
      try {
        setLoading(true);
        const data = await getDivisionsByUniversity(user.idUniversity);

        const mappedDivisions: Division[] = data.map(division => ({
          id: division.idDivision,
          idUniversity: division.idUniversity,
          code: division.code,
          name: division.name,
          description: division.description,
          status: division.status
        }));

        setDivisions(mappedDivisions);
      } catch (error) {
        console.error("Error al cargar las divisiones:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDivisions();
  }, [user?.idUniversity]);

  // Handler: Abrir modal de edición
  const handleEditDivision = (division: Division) => {
    setSelectedDivision(division);
    setShowEditDivisionModal(true);
  };

  // Handler: Enviar datos de edición
  const handleUpdateDivision = async (divisionData: any) => {
    const idUniversityToUse = divisionData.idUniversity || user?.idUniversity;

    if (!idUniversityToUse) {
      alert("Error: No se puede identificar la universidad. Por favor, recarga la página.");
      return;
    }

    try {
      const updatePayload = {
        idDivision: divisionData.id,
        idUniversity: idUniversityToUse,
        code: divisionData.codigo,
        name: divisionData.nombre,
        description: divisionData.descripcion,
        status: divisionData.status
      };

      await updateDivision(divisionData.id, updatePayload);

      // Recargar datos desde PostgreSQL
      if (user?.idUniversity) {
        const data = await getDivisionsByUniversity(user.idUniversity);
        const mappedDivisions: Division[] = data.map(division => ({
          id: division.idDivision,
          idUniversity: division.idUniversity,
          code: division.code,
          name: division.name,
          description: division.description,
          status: division.status
        }));
        setDivisions(mappedDivisions);
      }

      setShowEditDivisionModal(false);
      setSelectedDivision(null);
      alert("✅ División actualizada correctamente");

    } catch (error: any) {
      const errorMessage = error.response?.data ||
        error.response?.data?.message ||
        "Error al actualizar la división";

      alert(`Error: ${errorMessage}`);
    }
  };

  // Handler: Cambiar estado de división
  const toggleDivisionStatus = async (id: number) => {
    try {
      const division = divisions.find(d => d.id === id);
      if (!division) return;

      const newStatus = !division.status;
      await updateDivisionStatus(id, newStatus);

      // Actualizar estado local
      setDivisions(divisions =>
        divisions.map(division =>
          division.id === id ? { ...division, status: newStatus } : division
        )
      );

    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Error desconocido al cambiar estado";

      alert(`Error al cambiar estado: ${errorMessage}`);
    }
  };

  // Handler: Agregar nueva división
  const handleAddDivision = async (divisionData: any) => {
    if (!user?.idUniversity) return;

    try {
      const newDivision = await createDivision({
        idUniversity: user.idUniversity,
        code: divisionData.codigo,
        name: divisionData.nombre,
        description: divisionData.descripcion,
        status: divisionData.status
      });

      // Agregar al estado local
      const mappedDivision: Division = {
        id: newDivision.idDivision,
        idUniversity: newDivision.idUniversity,
        code: newDivision.code,
        name: newDivision.name,
        description: newDivision.description,
        status: newDivision.status
      };

      setDivisions(prev => [...prev, mappedDivision]);
      setShowAddDivisionModal(false);
    } catch (error: any) {
      const errorMessage = error.response?.data || "Error al crear la división";
      alert(errorMessage);
    }
  };

  // Handler: Eliminar división
  const handleDeleteDivision = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta división de la base de datos?")) return;

    try {
      await deleteDivision(id);

      // Recargar los datos REALES desde PostgreSQL
      if (user?.idUniversity) {
        const data = await getDivisionsByUniversity(user.idUniversity);
        const mappedDivisions: Division[] = data.map(division => ({
          id: division.idDivision,
          idUniversity: division.idUniversity,
          code: division.code,
          name: division.name,
          description: division.description,
          status: division.status
        }));

        setDivisions(mappedDivisions);
      }

      alert("✅ División eliminada correctamente de la base de datos");

    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "No se pudo eliminar la división de la base de datos";

      alert(`❌ Error al eliminar: ${errorMessage}`);
    }
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({ search: "", status: "" });
    setCurrentPage(1);
  };

  const applyFilters = () => {
    setShowFilters(false);
    setCurrentPage(1);
  };

  const handleColumnToggle = (key: ColumnKey) => {
    setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExport = () => {
    console.log("Exportar divisiones", divisions);
  };

  // Filtrado y paginación
  const filteredDivisions = divisions.filter((division) => {
    const matchesSearch = filters.search === "" ||
      division.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      division.code.toLowerCase().includes(filters.search.toLowerCase()) ||
      division.description.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus = filters.status === "" ||
      (filters.status === "active" && division.status) ||
      (filters.status === "inactive" && !division.status);

    return matchesSearch && matchesStatus;
  });

  const indexOfLastDivision = currentPage * divisionsPerPage;
  const indexOfFirstDivision = indexOfLastDivision - divisionsPerPage;
  const currentDivisions = filteredDivisions.slice(indexOfFirstDivision, indexOfLastDivision);
  const totalPages = Math.ceil(filteredDivisions.length / divisionsPerPage);

  const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const goToPrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  if (!user) return <p className="text-gray-500">Iniciando sesión...</p>;
  if (loading) return <p className="text-gray-500">Cargando divisiones...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <DivisionsHeader
          title="Divisiones Académicas Vigentes"
          description="Gestión de divisiones académicas del sistema"
          onAddDivision={() => setShowAddDivisionModal(true)}
        />

        <DivisionsToolbar
          searchTerm={filters.search}
          onSearchChange={(value) => handleFilterChange("search", value)}
          isGrouped={isGrouped}
          onToggleGroup={() => setIsGrouped(!isGrouped)}
          onShowFilters={() => setShowFilters(!showFilters)}
          onShowColumns={() => setShowColumns(!showColumns)}
          onExport={handleExport}
        />

        <DivisionsTablePanel
          divisions={currentDivisions}
          filters={filters}
          visibleColumns={visibleColumns}
          isGrouped={isGrouped}
          showFilters={showFilters}
          showColumns={showColumns}
          currentPage={currentPage}
          totalPages={totalPages}
          currentItemsCount={currentDivisions.length}
          totalItemsCount={filteredDivisions.length}
          onToggleStatus={toggleDivisionStatus}
          onEditDivision={handleEditDivision}
          onDeleteDivision={handleDeleteDivision}
          onFilterChange={handleFilterChange}
          onColumnToggle={handleColumnToggle}
          onSetShowFilters={setShowFilters}
          onSetShowColumns={setShowColumns}
          onResetFilters={resetFilters}
          onApplyFilters={applyFilters}
          onPreviousPage={goToPrevPage}
          onNextPage={goToNextPage}
        />
      </div>

      {/* Modal para agregar nueva división */}
      <DivisionsModal
        isOpen={showAddDivisionModal}
        onClose={() => setShowAddDivisionModal(false)}
        onSubmit={handleAddDivision}
      />

      {/* Modal para editar división existente */}
      <DivisionEditModal
        isOpen={showEditDivisionModal}
        onClose={() => {
          setShowEditDivisionModal(false);
          setSelectedDivision(null);
        }}
        onSubmit={handleUpdateDivision}
        division={selectedDivision}
      />
    </div>
  );
}