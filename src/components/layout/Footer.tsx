import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-16">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>
          © {new Date().getFullYear()} Universidad Tecnológica de Querétaro. Todos los derechos reservados.
        </p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <Link href="/privacy-policy" className="hover:text-gray-700 transition">
            Aviso de privacidad
          </Link>
          <Link href="/terms-of-use" className="hover:text-gray-700 transition">
            Términos de uso
          </Link>
          <a
            href="https://www.uteq.edu.mx/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-700 transition"
          >
            UTEQ
          </a>
        </div>
      </div>
    </footer>
  );
}
