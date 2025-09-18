import Image from "next/image";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 items-center gap-12 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-3xl p-10 shadow-sm">
      <div>
        <span className="inline-block text-sm font-medium text-blue-600 mb-2">
          Plataforma oficial de control escolar
        </span>
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Bienvenido al sistema de asistencia
        </h2>
        <p className="text-gray-600 mb-6">
          Gestiona tus asistencias, consulta tus horarios y mantente al día con
          los eventos escolares.
        </p>
        <Button text="Ver mis asistencias" />
      </div>

      <div className="flex justify-center">
        <Image
          src="/images/login_imagen_4.png"
          alt="Aula"
          width={450}
          height={350}
          className="rounded-2xl shadow-lg"
          priority
        />
      </div>
    </section>
  );
}
