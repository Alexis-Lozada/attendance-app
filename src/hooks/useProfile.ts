"use client";

import { useEffect, useRef, useState } from "react";
import { getUserById, updateUserProfile } from "@/services/user.service";
import { getFileUrl, uploadFile } from "@/services/storage.service";
import { getUniversityById } from "@/services/university.service"; // ✅ nuevo
import { useAuth } from "@/context/AuthContext";
import type { User } from "@/types/user";

export function useProfile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [universityName, setUniversityName] = useState<string>("—"); // ✅ nuevo
  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    type: "success" | "error";
  } | null>(null);

  // === Cargar datos del usuario ===
  useEffect(() => {
    if (!user?.idUser) return;

    const fetchUserData = async () => {
      try {
        const data = await getUserById(user.idUser);
        let url: string | null = null;
        
        const uni = await getUniversityById(data.idUniversity);
        setUniversityName(uni?.name || "—");

        if (data.profileImage && !data.profileImage.startsWith("http")) {
          url = await getFileUrl(data.profileImage);
        } else if (data.profileImage?.startsWith("http")) {
          url = data.profileImage;
        }

        setProfileUrl(url);
        setUserData(data);
      } catch (error) {
        console.error("Error al obtener usuario:", error);
        setToast({
          title: "Error al cargar usuario",
          description: "No se pudo obtener la información del perfil.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.idUser]);

  // === Subir nueva foto ===
  const handleProfileClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userData) return;

    setUploading(true);
    try {
      const uuid = await uploadFile(file);
      if (!uuid) throw new Error("No se pudo subir el archivo.");

      const updated = await updateUserProfile(userData.idUser, { profileImage: uuid });
      const newUrl = await getFileUrl(uuid);

      setProfileUrl(newUrl);
      setUserData(updated);

      setToast({
        title: "Foto actualizada",
        description: "Tu foto de perfil se actualizó correctamente.",
        type: "success",
      });
    } catch (error) {
      console.error("Error actualizando foto de perfil:", error);
      setToast({
        title: "Error al subir imagen",
        description: "Ocurrió un problema al actualizar tu foto.",
        type: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  // === Modal y edición ===
  const openEditModal = () => setIsModalOpen(true);
  const closeEditModal = () => setIsModalOpen(false);

  const handleSaveProfile = async (formData: Partial<User>) => {
    if (!userData) return;

    try {
      const updated = await updateUserProfile(userData.idUser, formData);
      setUserData(updated);
      setIsModalOpen(false);

      setToast({
        title: "Perfil actualizado",
        description: "Tu información se guardó correctamente.",
        type: "success",
      });
    } catch (error) {
      console.error("Error guardando perfil:", error);
      setToast({
        title: "Error al guardar cambios",
        description: "No se pudieron aplicar los cambios.",
        type: "error",
      });
    }
  };

  return {
    user,
    userData,
    universityName,
    profileUrl,
    loading,
    uploading,
    toast,
    setToast,
    fileInputRef,
    handleProfileClick,
    handleFileChange,
    isModalOpen,
    openEditModal,
    closeEditModal,
    handleSaveProfile,
  };
}
