"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Detectamos si estamos en login o register
  const isAuthPage =
    pathname === "/auth/login" || pathname === "/auth/register";

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Image
            src="/images/uteq-logo.png"
            alt="Logo UTEQ"
            width={40}
            height={40}
            priority
          />
          <span className="font-bold text-lg text-gray-800">Uteq</span>
        </div>

        {/* Botón condicional */}
        {isAuthPage ? (
          <Link
            href="/home"
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Regresar
          </Link>
        ) : (
          <Link
            href="/auth/login"
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Iniciar Sesión
          </Link>
        )}
      </div>
    </header>
  );
}
