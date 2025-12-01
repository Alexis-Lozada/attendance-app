"use client";

import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const { login, loading } = useAuth();

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Por favor ingresa tu correo y contraseña");
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      setError("Correo o contraseña inválidos");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Lado izquierdo con imagen - 50% */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0">
          <Image
            src="/images/login_imagen_1.jpg"
            alt="Workspace"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay oscuro para mejorar legibilidad del texto */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 max-w-md text-white">
          <blockquote className="space-y-3">
            <p className="text-xl font-medium leading-relaxed">
              "Controla la asistencia de tu equipo de manera simple y eficiente. Todo en un solo lugar."
            </p>
            <footer className="text-sm">
              <div className="font-semibold">Roster</div>
              <div className="text-xs opacity-90">
                Sistema de pase de lista escolar
              </div>
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Lado derecho con formulario - 50% */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          {/* Logo centrado con más espacio abajo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-xl font-medium text-gray-900">
                Roster
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="space-y-1 text-center">
            <h1 className="text-xl font-medium text-gray-900">
              Bienvenido de nuevo
            </h1>
            <p className="text-sm font-light text-gray-600">
              Gestiona tu asistencia de manera eficiente con nuestra plataforma.
            </p>
          </div>

          {/* Mensaje de error */}
          {error && (
            <p className="text-red-600 text-xs text-center">
              {error}
            </p>
          )}

          {/* Formulario */}
          <div className="space-y-4">
            {/* Input Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                onKeyPress={handleKeyPress}
                className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-all text-gray-900 placeholder-gray-400 ${
                  error
                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 focus:border-[#5b8def] focus:ring-2 focus:ring-[#5b8def]/20"
                }`}
              />
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-700">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  onKeyPress={handleKeyPress}
                  className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-all text-gray-900 placeholder-gray-400 pr-10 ${
                    error
                      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-300 focus:border-[#5b8def] focus:ring-2 focus:ring-[#5b8def]/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                className="text-xs text-[#5b8def] hover:text-[#4a7ad8] font-medium transition-colors cursor-pointer"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className="relative w-10 h-5 rounded-full transition-colors duration-200 ease-in-out cursor-pointer"
                style={{
                  backgroundColor: rememberMe ? "#5b8def" : "#e5e7eb",
                }}
              >
                <span
                  className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out"
                  style={{
                    transform: rememberMe ? "translateX(20px)" : "translateX(0)",
                  }}
                />
              </button>
              <label className="text-xs text-gray-600 cursor-pointer select-none">
                Recordar mis datos de acceso
              </label>
            </div>

            {/* Botón Login */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-2.5 px-4 text-sm bg-[#5b8def] hover:bg-[#4a7ad8] text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "Iniciar sesión"
              )}
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-xs text-gray-600 pt-2">
              ¿No tienes una cuenta?{" "}
              <button
                type="button"
                className="text-[#5b8def] hover:text-[#4a7ad8] font-medium transition-colors cursor-pointer"
              >
                Regístrate
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}