import { GraduationCap } from "lucide-react";

export default function InfoSection() {
  return (
    <section className="bg-white rounded-3xl shadow-sm p-8 flex flex-col md:flex-row items-start gap-6">
      <GraduationCap className="h-12 w-12 text-blue-500 flex-shrink-0" />
      <div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          ¿Por qué tu asistencia es importante?
        </h3>
        <p className="text-gray-600 leading-relaxed">
          La asistencia es clave para tu desarrollo académico. Participar en
          clases fortalece tu aprendizaje, fomenta el intercambio de ideas y
          contribuye al crecimiento personal y profesional de toda la comunidad.
        </p>
      </div>
    </section>
  );
}
