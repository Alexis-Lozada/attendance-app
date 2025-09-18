export default function TermsOfUsePage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Términos de Uso
      </h1>
      <p className="text-gray-600 mb-4">
        El uso de esta plataforma implica la aceptación de los siguientes
        términos y condiciones. Te recomendamos leerlos cuidadosamente antes de
        continuar.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Acceso al sistema</h2>
      <p className="text-gray-600 mb-4">
        El acceso está destinado únicamente a estudiantes, profesores y
        personal autorizado de la Universidad Tecnológica de Querétaro.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Responsabilidad</h2>
      <p className="text-gray-600 mb-4">
        El usuario es responsable de mantener la confidencialidad de sus
        credenciales y de cualquier actividad realizada en su cuenta.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Modificaciones</h2>
      <p className="text-gray-600 mb-4">
        La universidad se reserva el derecho de actualizar estos términos en
        cualquier momento. Los cambios entrarán en vigor desde su publicación en
        esta página.
      </p>

      <p className="text-gray-600 mt-8">
        Última actualización: {new Date().getFullYear()}
      </p>
    </main>
  );
}
