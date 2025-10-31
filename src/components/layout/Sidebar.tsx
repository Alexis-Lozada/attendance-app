"use client";

import Link from "next/link";
import { LayoutDashboard, Clock, Calendar, BookOpen, Settings, LogOut } from "lucide-react";
import SearchInput from "@/components/ui/SearchInput";
import { useAuth } from "@/context/AuthContext";
import AdminMenu from "@/components/sidebar/AdminMenu";
import NavItem from "@/components/sidebar/NavItem";

export default function Sidebar() {
  const { user, logout } = useAuth();

  const handleLogout = () => logout();

  const roleLabels: Record<string, string> = {
    ADMIN: "Administrador",
    STUDENT: "Estudiante",
    TEACHER: "Profesor",
    USER: "Usuario",
  };
  const roleLabel = user?.role ? roleLabels[user.role] || user.role : "Usuario";

  return (
    <aside className="w-64 h-full bg-white rounded-xl flex flex-col">
      {/* Parte superior fija */}
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-5">
          <div className="bg-black text-white w-8 h-8 flex items-center justify-center rounded-md font-bold">R</div>
          <span className="font-medium text-lg text-gray-900">Roster</span>
        </div>

        {/* Institución académica */}
        <div
          className="mx-4 mb-3 rounded-lg px-3 py-3 flex items-center gap-3"
          style={{ backgroundColor: "#FDFDFD", border: "1px solid #F0F0F0" }}
        >
          <img src="/images/uteq-logo.png" alt="UTEQ" className="w-8 h-8 rounded-md object-contain" />
          <div className="flex flex-col min-w-0">
            <span
              className="text-sm font-medium text-gray-900 truncate whitespace-nowrap"
              title="Universidad Autónoma de Querétaro"
            >
              Universidad Autónoma de Querétaro
            </span>
            <span className="text-xs text-gray-500">UTEQ</span>
          </div>
        </div>

        {/* Buscador */}
        <div className="px-4 py-3">
          <SearchInput />
        </div>
      </div>

      {/* Menús con scroll */}
      <div className="flex-1 overflow-y-auto px-2">
        <div className="px-2 mt-2 mb-1">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Menú</span>
        </div>

        <nav className="space-y-1 text-sm">
          <NavItem href="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" withConnector={false} />
          <AdminMenu className="" />
          <NavItem href="/attendance" icon={<Clock size={18} />} label="Asistencia" withConnector={false} />
          <NavItem href="/schedule" icon={<Calendar size={18} />} label="Horario" withConnector={false} />
          <NavItem href="/courses" icon={<BookOpen size={18} />} label="Cursos" withConnector={false} />
        </nav>

        <div className="px-2 mt-4 mb-1">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Otros</span>
        </div>

        <nav className="space-y-1 text-sm">
          <NavItem href="/profile" icon={<Settings size={18} />} label="Mi Perfil" withConnector={false} />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 text-left cursor-pointer"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </nav>
      </div>

      {/* Parte inferior fija (usuario) cliqueable */}
      <Link
        href="/profile"
        className="px-4 py-3 flex items-center gap-3 border-t border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <img src="/images/user.jpg" alt="User" className="w-10 h-10 rounded-md" />
        <div>
          <p className="text-sm font-medium text-gray-900">
            {user ? `${user.firstName} ${user.lastName}` : "Invitado"}
          </p>
          <p className="text-xs text-gray-500">{roleLabel}</p>
        </div>
      </Link>
    </aside>
  );
}
