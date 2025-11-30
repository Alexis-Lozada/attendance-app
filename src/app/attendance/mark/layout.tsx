"use client";

export default function MarkAttendanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
      {children}
    </div>
  );
}