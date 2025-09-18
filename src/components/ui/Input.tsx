import { ReactNode } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export default function Input({ iconLeft, iconRight, ...props }: InputProps) {
  return (
    <div className="relative">
      {iconLeft && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2">
          {iconLeft}
        </span>
      )}
      <input
        {...props}
        className={`w-full rounded-lg border border-gray-300 pl-10 pr-10 py-3 focus:border-blue-500 focus:ring focus:ring-blue-200 text-gray-700`}
      />
      {iconRight && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          {iconRight}
        </span>
      )}
    </div>
  );
}
