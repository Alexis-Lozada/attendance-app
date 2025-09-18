export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Aviso de Privacidad
      </h1>
      <p className="text-gray-600 mb-4">
        En la Universidad Tecnológica de Querétaro valoramos y respetamos tu
        privacidad. Este aviso explica cómo recopilamos, usamos y protegemos
        tus datos personales al utilizar nuestro sistema de asistencia.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Uso de datos</h2>
      <p className="text-gray-600 mb-4">
        La información proporcionada se utiliza únicamente para fines académicos
        relacionados con el control de asistencias, horarios y actividades
        escolares.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Protección</h2>
      <p className="text-gray-600 mb-4">
        Tus datos están protegidos y no serán compartidos con terceros sin tu
        consentimiento expreso, salvo en los casos previstos por la ley.
      </p>

      <p className="text-gray-600 mt-8">
        Última actualización: {new Date().getFullYear()}
      </p>
    </main>
  );
}
