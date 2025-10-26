"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import ChatPanel from "@/components/chat/ChatPanel";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const pageTitles: Record<string, string> = {
    "/attendance": "Asistencia",
    "/admin/university": "Universidad",
    "/admin/divisions": "Divisiones",
  };
  const title = pageTitles[pathname] || "Dashboard";

  return (
    <div className="bg-gray-100 min-h-screen flex">
      {/* Sidebar escritorio */}
      <div className="hidden md:block fixed top-4 bottom-4 left-4">
        <Sidebar />
      </div>

      {/* Sidebar móvil (overlay con animación) */}
      <div
        className={`fixed inset-0 z-40 flex md:hidden transition-opacity duration-300 ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Fondo oscuro traslúcido */}
        <div
          className="fixed inset-0 bg-gray-900/30 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>

        {/* Sidebar deslizable */}
        <div
          className={`relative w-64 bg-white rounded-r-xl flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Botón cerrar */}
          <button
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={22} />
          </button>

          <Sidebar />
        </div>
      </div>

      {/* Contenido principal */}
      <main className="flex-1 bg-white rounded-none p-4 md:ml-72 md:mt-4 md:mr-4 md:mb-4 md:p-6 md:rounded-xl relative overflow-x-auto">
        <div className="flex items-center justify-between mb-6 relative">
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>

          {/* Chat Panel */}
          <div className="flex items-center gap-3">
            <ChatPanel />
            <button
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
