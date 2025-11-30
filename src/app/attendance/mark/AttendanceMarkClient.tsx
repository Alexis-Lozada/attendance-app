"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api as attendanceApi } from "@/services/api";

interface ApiResponse {
  idAttendance?: number;
  status?: string;
  attendanceDate?: string;
  studentName?: string;
  enrollmentNumber?: string;
  message?: string;
}

export default function AttendanceMarkClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, initializing } = useAuth();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const groupCourse = searchParams.get("groupCourse");
  const schedule = searchParams.get("schedule");

  useEffect(() => {
    if (initializing) return;

    if (!user) {
      const redirect = `/attendance/mark?groupCourse=${encodeURIComponent(
        groupCourse ?? ""
      )}&schedule=${encodeURIComponent(schedule ?? "")}`;

      router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    if (!groupCourse || !schedule) {
      setMessage("El enlace de asistencia no es válido.");
      setSuccess(false);
      setLoading(false);
      return;
    }

    const marcarAsistencia = async () => {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
        });

        const { latitude, longitude } = position.coords;

        const { data } = await attendanceApi.post<ApiResponse>("/attendances/mark", {
          idStudent: user.idUser,
          idGroupCourse: Number(groupCourse),
          latitude,
          longitude,
        });

        setMessage(
          `Asistencia registrada correctamente para ${data.studentName || "tu usuario"}.`
        );
        setSuccess(true);
      } catch (error: any) {
        console.error(error);
        const msg =
          error?.response?.data ||
          error?.message ||
          "No se pudo registrar la asistencia. Intenta nuevamente.";
        setMessage(msg);
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    marcarAsistencia();
  }, [user, initializing, groupCourse, schedule, router]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <img
            src="https://storage.googleapis.com/roster-storage/logo.png"
            alt="Roster Logo"
            className="w-6 h-6 mr-3"
          />
          <span className="text-base font-medium text-black">Roster · Asistencias</span>
        </div>

        <div className="flex flex-col items-center justify-center text-center py-6">
          <div className="relative w-16 h-16 mb-6">
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-lg md:text-xl font-medium text-black mb-2">
            Registrando tu asistencia
          </h2>
          <p className="text-xs md:text-sm font-light text-black">
            Por favor espera mientras verificamos tu información...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden max-w-md w-full">
      {/* Header */}
      <div className="p-8 pb-6">
        <div className="flex items-center justify-center mb-6">
          <img
            src="https://storage.googleapis.com/roster-storage/logo.png"
            alt="Roster Logo"
            className="w-6 h-6 mr-3"
          />
          <span className="text-base font-medium text-black">Roster · Asistencias</span>
        </div>

        <div className="text-center">
          <h1 className="text-lg md:text-xl font-medium text-black mb-2">
            {success ? "Asistencia registrada" : "Error al registrar"}
          </h1>
          <p className="text-xs md:text-sm font-light text-black">
            {success
              ? "Tu registro ha sido confirmado exitosamente."
              : "No se pudo completar el proceso."}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="px-8">
        <div className="h-px bg-gray-200"></div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div
          className={`p-5 rounded-xl border mb-6 ${
            success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-start">
            <span className="text-2xl mr-3">{success ? "✅" : "❌"}</span>
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  success ? "text-green-900" : "text-red-900"
                }`}
              >
                {message}
              </p>
            </div>
          </div>
        </div>

        {success && (
          <div className="p-4 rounded-xl bg-[#f5f7fa] border border-gray-200 mb-6">
            <p className="text-xs text-gray-600">
              ℹ️ Tu asistencia quedó registrada en el sistema. Puedes cerrar esta ventana o
              regresar al dashboard.
            </p>
          </div>
        )}

        <button
          onClick={() => router.push("/dashboard")}
          className="w-full bg-[#5b8def] hover:bg-[#4a7dd8] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Volver al Dashboard
        </button>
      </div>

      {/* Footer */}
      <div className="px-8 py-5 bg-white border-t border-gray-100">
        <p className="text-xs font-light text-black text-center">
          © 2025 Roster · Sistema de pase de lista
        </p>
      </div>
    </div>
  );
}
