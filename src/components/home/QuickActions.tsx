import { CalendarDays, Clock, CheckCircle } from "lucide-react";

const actions = [
  {
    title: "Consultar Asistencias",
    description: "Revisa tu historial de asistencias.",
    icon: <CheckCircle className="h-6 w-6 text-green-600" />,
  },
  {
    title: "Ver Horario",
    description: "Consulta tus clases y horarios.",
    icon: <Clock className="h-6 w-6 text-blue-600" />,
  },
  {
    title: "Eventos Escolares",
    description: "Mantente informado de próximos eventos.",
    icon: <CalendarDays className="h-6 w-6 text-orange-600" />,
  },
];

export default function QuickActions() {
  return (
    <div className="bg-gray-100 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Acciones rápidas</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((action, index) => (
          <div
            key={index}
            className="flex items-start space-x-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex-shrink-0">{action.icon}</div>
            <div>
              <h4 className="font-medium text-gray-800">{action.title}</h4>
              <p className="text-sm text-gray-500">{action.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
