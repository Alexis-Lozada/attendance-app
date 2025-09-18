import Image from "next/image";

export default function PromoSection() {
  return (
    <section className="relative bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl p-10 my-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10">
        {/* Texto */}
        <div className="text-white space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-snug">
            El software de control de asistencia que simplifica
            <br /> todo en tu institución
          </h2>
          <p className="text-lg opacity-90">
            Además del control de asistencia, nuestra app permite consultar
            horarios, gestionar asistencias y recibir notificaciones.
          </p>

          <button className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg shadow hover:bg-gray-100 transition">
            Hablemos
          </button>
        </div>

        {/* Imagen */}
        <div className="flex justify-center md:justify-end">
        <div className="relative w-[300px] h-[400px] md:w-[400px] md:h-[400px]">
            <Image
            src="/images/mano_home.jpg"
            alt="App en mano"
            fill
            className="object-contain drop-shadow-2xl"
            priority
            />
        </div>
        </div>

      </div>
    </section>
  );
}
