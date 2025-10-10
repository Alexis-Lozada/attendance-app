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

// obtener universidad (requiere token)
export async function getUniversityById(id: number): Promise<UniversityResponse> {
  const { data } = await academicApi.get(`/universities/${id}`);
  return data;
}

// obtener URL real del logo desde storage-ms
export async function getLogoUrl(uuid: string): Promise<string | null> {
  try {
    const { data } = await storageApi.get(`/files/${uuid}`);
    return data?.url || null;
  } catch (error) {
    console.error("Error obteniendo logo desde storage-ms:", error);
    return null;
  }
}
