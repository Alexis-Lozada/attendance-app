export default function HomePage() {
  return (
    <div>
      {/* === Encabezado === */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900">
            Administración de divisiones
          </h3>
          <p className="text-[13px] text-gray-500">
            Aquí puedes visualizar las divisiones activas o inactivas dentro del sistema académico y sus coordinadores asignados.
          </p>
        </div>
      </header>
    </div>
  );
}
