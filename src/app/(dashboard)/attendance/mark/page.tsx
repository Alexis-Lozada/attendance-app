"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { attendanceApi } from "@/services/api";

interface ApiResponse {
  idAttendance?: number;
  status?: string;
  attendanceDate?: string;
  studentName?: string;
  enrollmentNumber?: string;
  message?: string;
}

export default function AttendanceMarkPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, initializing } = useAuth();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const groupCourse = searchParams.get("groupCourse");
  const schedule = searchParams.get("schedule");

  useEffect(() => {
    // Esperar a que AuthContext termine de inicializar
    if (initializing) return;

    if (!user) {
      router.push(`/login?redirect=/attendance/mark?groupCourse=${groupCourse}&schedule=${schedule}`);
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
        // Obtener ubicación del navegador
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

        setMessage(`✅ Asistencia registrada correctamente para ${data.studentName || "tu usuario"}.`);
        setSuccess(true);
      } catch (error: any) {
        console.error(error);
        const msg =
          error.response?.data ||
          error.message ||
          "No se pudo registrar la asistencia. Intenta nuevamente.";
        setMessage(`❌ ${msg}`);
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    marcarAsistencia();
  }, [user, initializing, groupCourse, schedule, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-6">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-600">Registrando tu asistencia...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-6">
      <div
        className={`p-6 rounded-xl shadow-md border max-w-md ${
          success ? "border-green-400 bg-green-50" : "border-red-400 bg-red-50"
        }`}
      >
        <h1 className="text-2xl font-semibold mb-3">
          {success ? "Asistencia registrada" : "Error al registrar asistencia"}
        </h1>
        <p className="text-gray-700">{message}</p>

        <button
          onClick={() => router.push("/dashboard")}
          className="mt-6 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Volver al Dashboard
        </button>
      </div>
    </div>
  );
}
