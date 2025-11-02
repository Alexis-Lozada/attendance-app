"use client";

import ProfileCard from "@/components/profile/ProfileCard";
import PersonalInfoCard from "@/components/profile/PersonalInfoCard";
import ChangePasswordCard from "@/components/profile/ChangePasswordCard";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/context/AuthContext";
import Spinner from "@/components/ui/Spinner";
import Toast from "@/components/ui/Toast";

export default function ProfilePage() {
  const { user } = useAuth();
  const idUser = user?.idUser ?? 0;

  const {
    userData,
    profileUrl,
    universityName,
    loading,
    uploading,
    toast,
    setToast,
    handleSaveProfile,
    handleProfileImageChange,
  } = useProfile(idUser);

  if (loading) return <Spinner text="Cargando perfil..." fullScreen />;

  return (
    <div className="flex flex-col gap-6 lg:mr-50 relative">
      {/* === Toast === */}
      {toast && (
        <Toast
          title={toast.title}
          description={toast.description}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* === Encabezado === */}
      <header className="flex flex-col gap-1 mb-3">
        <h3 className="text-[15px] font-semibold text-gray-900">
          Configuración de cuenta
        </h3>
        <p className="text-[13px] text-gray-500">
          Administra los detalles de tu perfil e información personal.
        </p>
      </header>

      {/* === Secciones === */}
      <ProfileCard
        userData={userData}
        profileUrl={profileUrl}
        uploading={uploading}
        onProfileImageChange={handleProfileImageChange}
      />

      <PersonalInfoCard
        userData={userData}
        universityName={universityName}
        handleSaveProfile={handleSaveProfile}
      />

      <ChangePasswordCard />
    </div>
  );
}
