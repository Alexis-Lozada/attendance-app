import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-6 py-12 space-y-10">
        {/* Título principal */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
            Aviso de Privacidad
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            En la Universidad Tecnológica de Querétaro valoramos tu privacidad.
            Este aviso explica cómo recopilamos, usamos y protegemos tu
            información personal al utilizar nuestro sistema de asistencia.
          </p>
        </div>

        {/* Secciones */}
        <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Uso de datos</h2>
          <p className="text-gray-600">
            La información proporcionada se utiliza únicamente para fines
            académicos relacionados con el control de asistencias, horarios y
            actividades escolares. No se empleará con propósitos comerciales ni
            publicitarios.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Protección</h2>
          <p className="text-gray-600">
            Tus datos están resguardados con medidas de seguridad administrativas,
            técnicas y físicas que buscan garantizar la confidencialidad y evitar
            accesos no autorizados. No serán compartidos con terceros sin tu
            consentimiento expreso, salvo en los casos previstos por la ley.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Derechos del usuario
          </h2>
          <p className="text-gray-600">
            Puedes solicitar en cualquier momento el acceso, rectificación,
            cancelación o oposición al uso de tus datos personales. Para ello
            deberás ponerte en contacto con el área administrativa de la
            Universidad.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Contacto</h2>
          <p className="text-gray-600">
            Si tienes dudas respecto al manejo de tus datos personales, puedes
            escribirnos al correo{" "}
            <span className="font-medium text-indigo-600">
              privacidad@uteq.edu.mx
            </span>{" "}
            donde con gusto atenderemos tus inquietudes.
          </p>
        </section>

        {/* Última actualización */}
        <p className="text-gray-500 text-sm text-center">
          Última actualización: {new Date().getFullYear()}
        </p>
      </main>

      <Footer />
    </div>
  );
}
