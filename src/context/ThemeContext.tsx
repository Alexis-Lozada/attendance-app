"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getUniversityThemeColor } from "@/services/configuration.service";
import { useAuth } from "@/context/AuthContext";

interface ThemeContextType {
  color: string;
  setColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [color, setColorState] = useState("#3B82F6"); // color por defecto

  // 🔹 Aplica y guarda el color globalmente
  const setColor = (newColor: string) => {
    setColorState(newColor);
    document.documentElement.style.setProperty("--primary-color", newColor);
    localStorage.setItem("themeColor", newColor);
  };

  // 🔹 Carga el color del localStorage o del backend
  useEffect(() => {
    const loadTheme = async () => {
      const savedColor = localStorage.getItem("themeColor");

      if (savedColor) {
        setColor(savedColor);
        return;
      }

      if (user?.idUniversity) {
        try {
          const backendColor = await getUniversityThemeColor(user.idUniversity);
          if (backendColor) setColor(backendColor);
        } catch (error) {
          console.error("Error cargando color del tema:", error);
        }
      }
    };

    loadTheme();
  }, [user?.idUniversity]);

  return (
    <ThemeContext.Provider value={{ color, setColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme debe usarse dentro de ThemeProvider");
  return context;
}
