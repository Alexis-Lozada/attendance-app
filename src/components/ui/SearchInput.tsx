"use client";

import { Search } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
}

export default function SearchInput({
  placeholder = "Búsqueda rápida...",
}: SearchInputProps) {
  return (
    <div className="flex items-center border border-[#D0D0D0] rounded-lg h-9 px-3 bg-white">
      {/* Icono de lupa */}
      <Search size={16} className="mr-2 text-[#ACACAC]" />
      <input
        type="text"
        placeholder={placeholder}
        className="flex-1 outline-none text-xs md:text-sm text-[#333333] placeholder-[#ACACAC] bg-transparent"
      />
    </div>
  );
}
