"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { User, Lock } from "lucide-react";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, loading } = useAuth();

  const slides = [
    {
      title: "Bienvenido",
      text: "Inicia sesión para acceder a información verificada sobre salud.",
      image: "/images/login_imagen_1.png",
    },
    {
      title: "Control",
      text: "Lleva un control claro y ordenado de tu asistencia.",
      image: "/images/login_imagen_1.png",
    },
    {
      title: "Reportes",
      text: "Genera reportes de asistencia en cuestión de segundos.",
      image: "/images/login_imagen_1.png",
    },
  ];

  // 👇 Autoplay del carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // 👇 Acción del botón de login
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Por favor ingresa tu correo y contraseña");
      return;
    }

    try {
      await login(email, password); // viene del hook useAuth
    } catch {
      alert("Correo o contraseña inválidos");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-5xl bg-white rounded-xl border border-[#EDEDED] flex flex-col md:flex-row overflow-hidden py-8 md:py-0">
        {/* Lado izquierdo */}
        <div className="hidden md:flex md:w-1/2 bg-[#D9D9D9] flex-col justify-center items-center p-5 md:p-8">
          <div className="w-full max-w-sm self-start">
            <h1 className="text-xl md:text-2xl font-bold text-white text-left">
              {slides[currentSlide].title}
            </h1>
            <p className="text-sm md:text-base font-medium text-white text-left mt-2">
              {slides[currentSlide].text}
            </p>
          </div>
          <div className="mt-5 flex justify-center w-full">
            <Image
              src={slides[currentSlide].image}
              alt="slide"
              width={640}
              height={640}
              quality={100}
              className="w-2/3 md:w-[320px] h-auto"
            />
          </div>
          <div className="flex gap-2 mt-5">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 rounded-full ${
                  currentSlide === index ? "bg-white" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Lado derecho (Formulario) */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-6 md:px-12 py-6 md:py-10">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <h2 className="text-lg md:text-xl font-medium text-black">
                Iniciar sesión
              </h2>
              <p className="text-xs md:text-sm font-light text-black mt-1">
                Ingresa tus credenciales
              </p>
            </div>

            {/* Inputs */}
            <div className="space-y-6">
              <InputField
                label="Correo electrónico"
                placeholder="ejemplo@correo.com"
                type="email"
                icon={<User size={18} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <InputField
                label="Contraseña"
                placeholder="Contraseña"
                type="password"
                icon={<Lock size={18} />}
                allowPasswordToggle
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* 👇 Botón con loading */}
              <Button text="Ingresar" onClick={handleLogin} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
