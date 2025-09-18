"use client";

import Image from "next/image";
import { Mail, Lock, Eye } from "lucide-react";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import Footer from "@/components/layout/Footer";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <br></br>
      {/* Contenido principal */}
      <div className="flex flex-grow items-center justify-center">
        <div className="flex w-full max-w-5xl min-h-[600px] rounded-3xl overflow-hidden shadow-md">
          {/* Lado izquierdo */}
          <div className="flex w-1/2 flex-col justify-center bg-gray-100 p-10">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">Bienvenido</h1>
            <p className="text-gray-600 mb-8 max-w-sm">
              Accede a la plataforma para llevar el control de tus asistencias
              de manera fácil y segura.
            </p>
            <Image
              src="/images/login_imagen_1.png"
              alt="Ilustración de aula"
              width={400}
              height={400}
              priority
              className="mx-auto"
            />
          </div>

          {/* Lado derecho */}
          <div className="flex w-1/2 items-center justify-center bg-white p-8">
            <div className="w-full max-w-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
                Iniciar sesión
              </h2>
              <p className="text-center text-gray-500 mb-8">
                Ingresa tus credenciales
              </p>

              <form className="space-y-6">
                {/* Input correo */}
                <Input
                  type="email"
                  placeholder="Correo"
                  iconLeft={<Mail className="h-5 w-5 text-gray-400" />}
                />

                {/* Input contraseña */}
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
                <Button text="Ingresar" />
              </form>

              {/* Texto de registro */}
              <p className="text-center text-sm text-gray-600 mt-6">
                ¿No tienes cuenta?{" "}
                <Link
                  href="/auth/register"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Regístrate aquí
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
