import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-6 py-12 space-y-10">
        {/* Título principal */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
            Términos de Uso
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            El uso de esta plataforma implica la aceptación de los siguientes
            términos y condiciones. Te recomendamos leerlos cuidadosamente antes
            de continuar con el acceso o uso de nuestros servicios.
          </p>
        </div>

        {/* Secciones */}
        <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Acceso al sistema
          </h2>
          <p className="text-gray-600">
            El acceso está destinado únicamente a estudiantes, profesores y
            personal autorizado de la Universidad Tecnológica de Querétaro. El
            uso indebido o no autorizado de la plataforma podrá derivar en la
            suspensión temporal o definitiva de la cuenta.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Responsabilidad del usuario
          </h2>
          <p className="text-gray-600">
            El usuario es responsable de mantener la confidencialidad de sus
            credenciales y de cualquier actividad realizada en su cuenta. La
            universidad no será responsable por el uso indebido de las cuentas
            personales.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Uso adecuado</h2>
          <p className="text-gray-600">
            Está prohibido utilizar la plataforma para actividades que vulneren
            la integridad académica, la seguridad del sistema o los derechos de
            otros usuarios. El incumplimiento de esta norma podrá ser sancionado
            conforme a las políticas institucionales.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Modificaciones</h2>
          <p className="text-gray-600">
            La universidad se reserva el derecho de actualizar estos términos en
            cualquier momento. Los cambios entrarán en vigor desde su
            publicación en esta página, por lo que recomendamos revisarlos
            periódicamente.
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
