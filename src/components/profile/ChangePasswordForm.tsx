"use client";

import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";

interface ChangePasswordFormProps {
  onSave: (data: {
    currentPassword: string;
    newPassword: string;
  }) => void;
  onCancel: () => void;
  changing: boolean;
}

export default function ChangePasswordForm({
  onSave,
  onCancel,
  changing,
}: ChangePasswordFormProps) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [show, setShow] = useState({
    current: false,
    new: false,
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const validate = () => {
    let valid = true;
    const newErrors = { currentPassword: "", newPassword: "" };

    if (!form.currentPassword) {
      newErrors.currentPassword = "Ingresa tu contraseña actual.";
      valid = false;
    }
    if (!form.newPassword) {
      newErrors.newPassword = "La nueva contraseña es obligatoria.";
      valid = false;
    } else if (form.newPassword.length < 8) {
      newErrors.newPassword = "Debe tener al menos 8 caracteres.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" })); // limpia error al escribir
  };

  return (
    <div className="space-y-4">
      {/* Subtitle */}
      <p className="text-sm text-gray-500 mb-4">
        Usa este formulario para actualizar tu contraseña.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/** === Campo: Contraseña actual === */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña actual
          </label>
          <input
            type={show.current ? "text" : "password"}
            value={form.currentPassword}
            onChange={(e) => handleChange("currentPassword", e.target.value)}
            className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none pr-9 transition-all ${
              errors.currentPassword
                ? "border-red-400 focus:ring-red-400 focus:border-red-400"
                : "border-gray-300"
            }`}
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-400 cursor-pointer"
            onClick={() => setShow((p) => ({ ...p, current: !p.current }))}
          >
            {show.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          {errors.currentPassword && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              {errors.currentPassword}
            </p>
          )}
        </div>

        {/** === Campo: Nueva contraseña === */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nueva contraseña
          </label>
          <input
            type={show.new ? "text" : "password"}
            value={form.newPassword}
            onChange={(e) => handleChange("newPassword", e.target.value)}
            className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none pr-9 transition-all ${
              errors.newPassword
                ? "border-red-400 focus:ring-red-400 focus:border-red-400"
                : "border-gray-300"
            }`}
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-400 cursor-pointer"
            onClick={() => setShow((p) => ({ ...p, new: !p.new }))}
          >
            {show.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          {errors.newPassword ? (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              {errors.newPassword}
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">
              Debe tener al menos 8 caracteres.
            </p>
          )}
        </div>

        {/** === Botones === */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="border border-gray-300 text-gray-700 text-sm font-medium rounded-md px-4 py-2 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={changing}
            className="bg-primary text-white text-sm font-medium rounded-md px-4 py-2 hover:bg-primary/90 transition disabled:opacity-60 cursor-pointer"
          >
            {changing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                Guardando...
              </>
            ) : (
              "Guardar cambios"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}