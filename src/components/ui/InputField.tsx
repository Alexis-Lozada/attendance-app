"use client";

import { ReactNode, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputFieldProps {
  label: string;
  placeholder: string;
  type?: string;
  icon?: ReactNode;
  allowPasswordToggle?: boolean;
}

export default function InputField({
  label,
  placeholder,
  type = "text",
  icon,
  allowPasswordToggle = false,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    allowPasswordToggle && type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type;

  return (
    <div>
      {/* Label */}
      <label className="block text-xs md:text-sm font-normal text-[#525252] mb-1">
        {label}
      </label>

      {/* Input con iconos */}
      <div className="flex items-center border border-[#D0D0D0] rounded-lg h-11 px-3 bg-white">
        {icon && <span className="mr-2 text-[#ACACAC]">{icon}</span>}
        <input
          type={inputType}
          placeholder={placeholder}
          className="flex-1 outline-none text-xs md:text-sm text-[#333333] placeholder-[#ACACAC]"
        />
        {allowPasswordToggle && type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="ml-2 text-[#ACACAC] cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}
