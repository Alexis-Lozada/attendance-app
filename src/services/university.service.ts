import { academicApi, storageApi } from "@/services/api";

export interface UniversityResponse {
  idUniversity: number;
  code: string;
  name: string;
  campus: string;
  address: string;
  logo: string; // uuid
  email: string;
  status: boolean;
}

// === Obtener universidad (requiere token) ===
export async function getUniversityById(id: number): Promise<UniversityResponse> {
  const { data } = await academicApi.get(`/universities/${id}`);
  return data;
}

// === Obtener URL real del logo desde storage-ms ===
export async function getLogoUrl(uuid: string): Promise<string | null> {
  try {
    const { data } = await storageApi.get(`/files/${uuid}`);
    return data?.url || null;
  } catch (error) {
    console.error("Error obteniendo logo desde storage-ms:", error);
    return null;
  }
}

// === Subir nuevo logo (storage-ms) ===
export async function uploadUniversityLogo(file: File): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await storageApi.post("/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data.uuid || null;
  } catch (error) {
    console.error("Error subiendo logo a storage-ms:", error);
    return null;
  }
}

// === Actualizar datos de universidad (academic-ms) ===
export async function updateUniversity(id: number, payload: Partial<UniversityResponse>) {
  const { data } = await academicApi.put(`/universities/${id}`, payload);
  return data;
}

// === Flujo completo: subir logo y actualizar universidad ===
export async function updateUniversityWithLogo(
  id: number,
  universityData: Partial<UniversityResponse>,
  logoFile?: File
) {
  let logoUuid = universityData.logo;

  // 1️⃣ Si hay nuevo logo, súbelo primero
  if (logoFile) {
    const uploadedUuid = await uploadUniversityLogo(logoFile);
    if (uploadedUuid) logoUuid = uploadedUuid;
  }

  // 2️⃣ Actualiza la universidad en academic-ms
  const updated = await updateUniversity(id, { ...universityData, logo: logoUuid });
  return updated;
}
