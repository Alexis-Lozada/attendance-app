"use client";

import { useEffect, useState } from "react";
import { getUserById, updateUserProfile, changeUserPassword } from "@/services/user.service";
import { getFileUrl, uploadFile } from "@/services/storage.service";
import { getUniversityById } from "@/services/university.service";
import type { User } from "@/types/user";

interface ToastData {
  title: string;
  description: string;
  type: "success" | "error";
}

export function useProfile(idUser: number) {
  const [userData, setUserData] = useState<User | null>(null);
  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const [universityName, setUniversityName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!idUser) return;
    fetchProfileData();
  }, [idUser]);

  async function fetchProfileData() {
    try {
      setLoading(true);
      const user = await getUserById(idUser);
      setUserData(user);

      if (user.profileImage) {
        const url = await getFileUrl(user.profileImage);
        setProfileUrl(url);
      }

      if (user.idUniversity) {
        const uni = await getUniversityById(user.idUniversity);
        setUniversityName(uni.name);
      }
    } catch (error: any) {
      console.error("Error cargando perfil:", error);
      setToast({
        title: "No se pudo cargar la información del perfil",
        description: error?.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProfile(data: Partial<User>) {
    try {
      if (!userData) return;
      const updated = await updateUserProfile(userData.idUser, data);
      setUserData((prev) => ({ ...prev!, ...updated }));
      setToast({
        title: "Perfil actualizado",
        description: "Los cambios se han guardado correctamente.",
        type: "success",
      });
    } catch (error: any) {
      console.error("Error actualizando perfil:", error);
      setToast({
        title: "No se pudo actualizar el perfil",
        description: error?.message,
        type: "error",
      });
    }
  }

  async function handleProfileImageChange(file: File) {
    try {
      if (!userData) return;
      setUploading(true);

      const uuid = await uploadFile(file);
      if (!uuid) throw new Error("Error al subir la imagen.");

      const updated = await updateUserProfile(userData.idUser, { profileImage: uuid });
      const newUrl = await getFileUrl(uuid);

      setProfileUrl(newUrl);
      setUserData((prev) => ({ ...prev!, profileImage: uuid }));

      setToast({
        title: "Imagen actualizada",
        description: "Tu foto de perfil se ha actualizado correctamente.",
        type: "success",
      });
    } catch (error: any) {
      console.error("Error cambiando imagen:", error);
      setToast({
        title: "No se pudo cambiar la imagen de perfil",
        description: error?.message,
        type: "error",
      });
    } finally {
      setUploading(false);
    }
  }

  async function handleChangePassword({
    currentPassword,
    newPassword,
  }: {
    currentPassword: string;
    newPassword: string;
  }) {
    try {
      if (!userData) return;
      setChangingPassword(true);

      await changeUserPassword(userData.idUser, {
        currentPassword,
        newPassword,
      });

      setToast({
        title: "Contraseña actualizada",
        description: "Tu contraseña se ha cambiado correctamente.",
        type: "success",
      });
    } catch (error: any) {
      console.error("Error cambiando contraseña:", error);
      setToast({
        title: "No se pudo cambiar la contraseña",
        description: error?.message,
        type: "error",
      });
    } finally {
      setChangingPassword(false);
    }
  }

  return {
    userData,
    profileUrl,
    universityName,
    loading,
    uploading,
    toast,
    setToast,
    changingPassword,
    handleSaveProfile,
    handleProfileImageChange,
    handleChangePassword,
  };
}
