"use client";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  loading?: boolean;
}

export default function Button({
  text,
  onClick,
  loading = false,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="h-12 w-full rounded-lg bg-[#2B2B2B] text-[#F3F3F3] 
                 text-sm md:text-base font-medium mt-2 transition-colors 
                 duration-200 hover:bg-[#3c3c3c] disabled:opacity-60 
                 disabled:cursor-not-allowed flex items-center justify-center gap-2 
                 cursor-pointer"
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      ) : (
        text
      )}
    </button>
  );
}
