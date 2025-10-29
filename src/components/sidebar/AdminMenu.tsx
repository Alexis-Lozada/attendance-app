"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Layers, ChevronDown, ChevronUp, University, FolderTree, BookOpen, Users } from "lucide-react";
import NavItem from "@/components/sidebar/NavItem";

type AdminMenuProps = { className?: string };

export default function AdminMenu({ className = "" }: AdminMenuProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Abre automáticamente en /admin/* después de hidratar
  useEffect(() => {
    if (pathname.startsWith("/admin/")) setOpen(true);
  }, [pathname]);

  // Línea vertical hasta mitad del último item
  const listRef = useRef<HTMLDivElement | null>(null);
  const lastItemRef = useRef<HTMLAnchorElement | null>(null);
  const [lineHeight, setLineHeight] = useState(0);

  const recalc = () => {
    const c = listRef.current, last = lastItemRef.current;
    if (!c || !last) return;
    const top = c.getBoundingClientRect().top;
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
        onClick={() => setOpen((v) => !v)}
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
            <NavItem
              href="/admin/university"
              icon={<University size={18} />}
              label="Universidad"
            />
            <NavItem
              href="/admin/divisions"
              icon={<FolderTree size={18} />}
              label="Divisiones"
            />
            <NavItem
              href="/admin/programs"
              icon={<BookOpen size={18} />}
              label="Programas"
            />
            <NavItem
              href="/admin/groups"
              icon={<Users size={18} />}
              label="Grupos"
              ref={lastItemRef} // <- el último para cortar la línea a la mitad
            />
          </div>
        </div>
      )}
    </div>
  );
}
