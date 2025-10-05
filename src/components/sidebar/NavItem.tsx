"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, ReactNode } from "react";

type NavItemProps = {
  href: string;
  icon: ReactNode;
  label: string;
  withConnector?: boolean; // si true, muestra la rayita y aplica indent
  className?: string;
  activeBg?: string; // default "#2B2B2B"
};

const NavItem = forwardRef<HTMLAnchorElement, NavItemProps>(
  ({ href, icon, label, withConnector = true, className = "", activeBg = "#2B2B2B" }, ref) => {
    const pathname = usePathname();
    const isActive = pathname.startsWith(href);

    const base = "relative flex items-center gap-2 px-3 py-2 rounded-md";
    const indent = withConnector ? "ml-2" : ""; // ← solo indenta si hay conector
    const inactive = "text-gray-700 hover:bg-gray-100";
    const active = "text-white";

    return (
      <Link
        href={href}
        ref={ref}
        className={`${base} ${indent} ${isActive ? active : inactive} ${className}`}
        style={isActive ? { backgroundColor: activeBg } : undefined}
      >
        {withConnector && (
          <span className="absolute -left-2 top-1/2 w-2 h-px bg-gray-300" />
        )}
        {icon}
        {label}
      </Link>
    );
  }
);

NavItem.displayName = "NavItem";
export default NavItem;
