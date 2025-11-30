import { Suspense } from "react";
import AttendanceMarkClient from "@/app/attendance/mark/AttendanceMarkClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Cargando...</div>}>
      <AttendanceMarkClient />
    </Suspense>
  );
}
