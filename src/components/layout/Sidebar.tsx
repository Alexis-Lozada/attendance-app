"use client";

import Link from "next/link";
import { LayoutDashboard, Clock, Calendar, BookOpen, Settings,}
from "lucide-react";
import SearchInput from "@/components/ui/SearchInput";

export default function Sidebar() {
  return (
    <aside className="w-64 h-full bg-white rounded-xl flex flex-col">
      {/* Parte superior fija */}
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-5">
          <div className="bg-black text-white w-8 h-8 flex items-center justify-center rounded-md font-bold">
            R
          </div>
          <span className="font-medium text-lg text-gray-900">Roster</span>
        </div>

        {/* Institución académica */}
        <div
          className="mx-4 mb-3 rounded-lg px-3 py-3 flex items-center gap-3"
          style={{ backgroundColor: "#FDFDFD", border: "1px solid #F0F0F0" }}
        >
          <img
            src="/images/uteq-logo.png"
            alt="UTEQ"
            className="w-8 h-8 rounded-md object-contain"
          />
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
        {/* Menú */}
        <div className="px-2 mt-2 mb-1">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Menú
          </span>
        </div>

        <nav className="space-y-1 text-sm">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link
            href="/attendance"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-white"
            style={{ backgroundColor: "#2B2B2B" }}
          >
            <Clock size={18} />
            Asistencia
          </Link>
          <Link
            href="/schedule"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            <Calendar size={18} />
            Horario
          </Link>
          <Link
            href="/courses"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            <BookOpen size={18} />
            Cursos
          </Link>
        </nav>

        {/* Otros */}
        <div className="px-2 mt-4 mb-1">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Otros
          </span>
        </div>

        <nav className="space-y-1 text-sm">
          <Link
            href="/settings"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            <Settings size={18} />
            Configuración
          </Link>
        </nav>
      </div>

      {/* Parte inferior fija (usuario) */}
      <div className="px-4 py-3 flex items-center gap-3 border-t border-gray-100">
        <img
          src="/images/user.jpg"
          alt="User"
          className="w-10 h-10 rounded-md"
        />
        <div>
          <p className="text-sm font-medium text-gray-900">Alexis Lozada</p>
          <p className="text-xs text-gray-500">Estudiante</p>
        </div>
      </div>
    </aside>
  );
}
