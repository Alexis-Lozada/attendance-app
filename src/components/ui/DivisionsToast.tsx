"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, X, Info, AlertTriangle } from "lucide-react";

interface DivisionsToastProps {
    title: string;
    description?: string;
    type: "success" | "error" | "info" | "warning";
    onClose: () => void;
    duration?: number;
}

export default function DivisionsToast({
    title,
    description,
    type,
    onClose,
    duration = 5000
}: DivisionsToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <XCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
        warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    };

    const bgColors = {
        success: "bg-green-50 border-green-200",
        error: "bg-red-50 border-red-200",
        info: "bg-blue-50 border-blue-200",
        warning: "bg-yellow-50 border-yellow-200",
    };

    const textColors = {
        success: "text-green-800",
        error: "text-red-800",
        info: "text-blue-800",
        warning: "text-yellow-800",
    };

    return (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full duration-300">
            <div className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg ${bgColors[type]} max-w-sm`}>
                {icons[type]}
                <div className="flex-1">
                    <h4 className={`font-medium ${textColors[type]}`}>{title}</h4>
                    {description && (
                        <p className={`text-sm ${textColors[type]} opacity-80 mt-1`}>{description}</p>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className={`opacity-70 hover:opacity-100 transition ${textColors[type]}`}
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}