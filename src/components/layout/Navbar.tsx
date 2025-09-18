import Image from "next/image";

export default function Navbar() {
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

        {/* Botón */}
        <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
          Iniciar Sesión
        </button>
      </div>
    </header>
  );
}
