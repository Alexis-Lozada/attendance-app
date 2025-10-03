import "./globals.css";
import { Poppins } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Attendance Client",
  description: "Sistema de pase de asistencia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={poppins.className}>
        {/* toda la app tiene acceso a useAuth */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
