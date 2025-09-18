"use client";

import { ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export default function Button({
  children,
  onClick,
  type = "button",
  className,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(
        "h-12 w-full rounded-lg bg-[#2B2B2B] text-[#F3F3F3] text-sm md:text-base font-medium mt-2 transition-colors duration-200 hover:bg-[#3c3c3c] cursor-pointer",
        className
      )}
    >
      {children}
    </button>
  );
}
