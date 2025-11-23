"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getUserById } from "@/services/user.service";
import { getFileUrl } from "@/services/storage.service";
import { RoleLabels, UserRole } from "@/types/roles";
import type { User } from "@/types/user";

interface CachedProfile {
  data: User;
  profileUrl: string | null;
}

export default function ProfileInfo() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [profileUrl, setProfileUrl] = useState<string | null>(null);

  const CACHE_KEY = "profile";

  useEffect(() => {
    if (!user) return;

    // 1️⃣ Cargar desde cache primero
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed: CachedProfile = JSON.parse(cached);
        setUserData(parsed.data);
        setProfileUrl(parsed.profileUrl);
      } catch {
        console.warn("Cache de perfil corrupto");
      }
    }

    // 2️⃣ Refrescar en background
    const fetchProfile = async () => {
      try {
        const freshUser = await getUserById(user.idUser);

        // Obtener URL real de imagen
        let realUrl: string | null = null;
        if (freshUser.profileImage) {
          realUrl = await getFileUrl(freshUser.profileImage);
        }

        setUserData(freshUser);
        setProfileUrl(realUrl);

        // Guardar en cache unificado
        const toStore: CachedProfile = {
          data: freshUser,
          profileUrl: realUrl,
        };

        localStorage.setItem(CACHE_KEY, JSON.stringify(toStore));

      } catch (err) {
        console.error("Error refrescando perfil:", err);
      }
    };

    fetchProfile();
  }, [user]);

  if (!userData) return null;

  const roleLabel =
    userData.role ? RoleLabels[userData.role as UserRole] || userData.role : "Usuario";

  return (
    <Link
      href="/profile"
      className="px-4 py-3 flex items-center gap-3 border-t border-gray-100 cursor-pointer"
    >
      <img
        src={profileUrl || "/images/user.jpg"}
        alt="User"
        className="w-10 h-10 rounded-md object-cover"
      />

      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {userData.firstName} {userData.lastName}
        </p>
        <p className="text-xs text-gray-500 truncate">{roleLabel}</p>
      </div>
    </Link>
  );
}
