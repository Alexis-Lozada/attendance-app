'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

interface ToastProps {
  title: string;
  description?: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({
  title,
  description,
  type = 'success',
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Espera un frame antes de activar la animación (evita saltos al montar)
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    const timer = setTimeout(() => handleClose(), 3500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const styles = {
    success: {
      icon: <CheckCircle2 className="text-green-500 w-5 h-5" />,
    },
    error: {
      icon: <XCircle className="text-red-500 w-5 h-5" />,
    },
  };

  return (
    <div
      className={`fixed top-10 right-10 z-50 transition-all duration-300 ease-out transform ${
        isVisible
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-10 opacity-0 scale-95'
      }`}
    >
      <div className="flex items-start gap-3 px-4 py-4 rounded-lg bg-white border border-gray-200">
        <div className="pt-1">{styles[type].icon}</div>
        <div className="flex flex-col flex-1">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          {description && (
            <p className="text-xs text-gray-600 mt-0.5">{description}</p>
          )}
        </div>
        <button
          onClick={handleClose}
          className="ml-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4 cursor-pointer" />
        </button>
      </div>
    </div>
  );
}
