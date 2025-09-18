"use client";

import Image from "next/image";
import { Mail, Lock, User, Hash, Eye } from "lucide-react";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";
import Footer from "@/components/layout/Footer";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Contenido principal */}
      <div className="flex flex-grow items-center justify-center">
        <div className="flex w-full max-w-5xl min-h-[650px] rounded-3xl overflow-hidden shadow-md">
          {/* Lado izquierdo con imagen */}
          <div className="flex w-1/2 flex-col justify-center bg-gray-100 p-10">
            <Image
              src="/images/login_imagen_3.png"
              alt="Registro ilustración"
              width={400}
              height={400}
              priority
              className="mx-auto"
            />
            <h1 className="text-4xl font-bold mt-6 text-gray-800 text-center">
              Regístrate
            </h1>
            <p className="text-gray-600 mt-2 text-center max-w-sm mx-auto">
              Crea tu cuenta para comenzar a gestionar tus asistencias.
            </p>
          </div>

          {/* Lado derecho con formulario */}
          <div className="flex w-1/2 items-center justify-center bg-white p-8">
            <div className="w-full max-w-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
                Crear cuenta
              </h2>
              <p className="text-center text-gray-500 mb-8">
                Ingresa tus datos para registrarte
              </p>

              <form className="space-y-5">
                {/* Nombre */}
                <Input
                  type="text"
                  placeholder="Nombre"
                  iconLeft={<User className="h-5 w-5 text-gray-400" />}
                />

                {/* Apellido */}
                <Input
                  type="text"
                  placeholder="Apellido"
                  iconLeft={<User className="h-5 w-5 text-gray-400" />}
                />

                {/* Matrícula */}
                <Input
                  type="text"
                  placeholder="Matrícula"
                  iconLeft={<Hash className="h-5 w-5 text-gray-400" />}
                />

                {/* Correo */}
                <Input
                  type="email"
                  placeholder="Correo electrónico"
                  iconLeft={<Mail className="h-5 w-5 text-gray-400" />}
                />

                {/* Contraseña */}
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  iconLeft={<Lock className="h-5 w-5 text-gray-400" />}
                  iconRight={
                    <Eye
                      className="h-5 w-5 text-gray-400 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  }
                />

                {/* Botón */}
                <Button text="Registrarme" />
              </form>

              {/* Texto para login */}
              <p className="text-center text-sm text-gray-600 mt-6">
                ¿Ya tienes cuenta?{" "}
                <Link
                  href="/auth/login"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
