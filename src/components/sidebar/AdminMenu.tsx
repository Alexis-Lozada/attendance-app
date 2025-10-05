"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Layers, ChevronDown, ChevronUp, University, FolderTree, BookOpen, Users } from "lucide-react";

type AdminMenuProps = {
  className?: string; // (opcional) ajustar márgenes desde fuera
};

export default function AdminMenu({ className = "" }: AdminMenuProps) {
  const [open, setOpen] = useState(false);

  // refs para la línea vertical dinámica
  const listRef = useRef<HTMLDivElement | null>(null);
  const lastItemRef = useRef<HTMLAnchorElement | null>(null);
  const [lineHeight, setLineHeight] = useState(0);

  const recalc = () => {
    const container = listRef.current;
    const last = lastItemRef.current;
    if (!container || !last) return;
    const top = container.getBoundingClientRect().top;
    const lb = last.getBoundingClientRect();
    setLineHeight((lb.top - top) + lb.height / 2);
  };

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(recalc);
    const t = setTimeout(recalc, 50);
    window.addEventListener("resize", recalc);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      window.removeEventListener("resize", recalc);
    };
  }, [open]);

  return (
    <div className={className}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
      >
        <span className="flex items-center gap-2">
          <Layers size={18} />
          Administración
        </span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <div className="ml-6 relative mt-1" ref={listRef}>
          {/* línea vertical principal con altura dinámica (mitad de 'Grupos') */}
          <div className="absolute left-0 w-px bg-gray-300" style={{ height: lineHeight }} />
          <div className="space-y-1">
            <Link
              href="/admin/university"
              className="relative flex items-center gap-2 ml-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <span className="absolute -left-2 top-1/2 w-2 h-px bg-gray-300" />
              <University size={18} />
              Universidad
            </Link>

            <Link
              href="/admin/divisions"
              className="relative flex items-center gap-2 ml-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <span className="absolute -left-2 top-1/2 w-2 h-px bg-gray-300" />
              <FolderTree size={18} />
              Divisiones
            </Link>

            <Link
              href="/admin/programs"
              className="relative flex items-center gap-2 ml-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <span className="absolute -left-2 top-1/2 w-2 h-px bg-gray-300" />
              <BookOpen size={18} />
              Programas
            </Link>

            <Link
              href="/admin/groups"
              ref={lastItemRef}
              className="relative flex items-center gap-2 ml-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <span className="absolute -left-2 top-1/2 w-2 h-px bg-gray-300" />
              <Users size={18} />
              Grupos
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
