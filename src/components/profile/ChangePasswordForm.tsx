"use client";

import { useState } from "react";
import { Loader2, Save, Eye, EyeOff } from "lucide-react";

interface ChangePasswordFormProps {
  onSave: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
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
    confirmPassword: "",
  });
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      alert("Completa todos los campos.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Contraseña actual */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña actual
        </label>
        <input
          type={show.current ? "text" : "password"}
          value={form.currentPassword}
          onChange={(e) => handleChange("currentPassword", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none pr-9"
        />
        <button
          type="button"
          className="absolute right-3 top-8 text-gray-400"
          onClick={() => setShow((p) => ({ ...p, current: !p.current }))}
        >
          {show.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* Nueva contraseña */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nueva contraseña
        </label>
        <input
          type={show.new ? "text" : "password"}
          value={form.newPassword}
          onChange={(e) => handleChange("newPassword", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none pr-9"
        />
        <button
          type="button"
          className="absolute right-3 top-8 text-gray-400"
          onClick={() => setShow((p) => ({ ...p, new: !p.new }))}
        >
          {show.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* Confirmar contraseña */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirmar nueva contraseña
        </label>
        <input
          type={show.confirm ? "text" : "password"}
          value={form.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none pr-9"
        />
        <button
          type="button"
          className="absolute right-3 top-8 text-gray-400"
          onClick={() => setShow((p) => ({ ...p, confirm: !p.confirm }))}
        >
          {show.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* Botones */}
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
          className="bg-primary text-white text-sm font-medium rounded-md px-4 py-2 hover:brightness-95 transition disabled:opacity-60"
        >
          {changing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 inline mr-2" />
              Guardar cambios
            </>
          )}
        </button>
      </div>
    </form>
  );
}
