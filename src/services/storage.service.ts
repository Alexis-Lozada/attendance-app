import { storageApi } from "@/services/api";

export interface FileResponse {
  idFile?: number;
  uuid: string;
  fileName: string;
  contentType?: string;
  url: string;
  uploadedAt?: string;
  status?: boolean;
}

/** Caché global (memoria + persistencia localStorage) */
const fileCache = new Map<string, string>();

// Clave única para almacenar el caché persistente
const CACHE_KEY = "storage-file-cache";

/** Cargar caché previo desde localStorage al iniciar */
(function initializeCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      Object.entries(parsed).forEach(([uuid, url]) =>
        fileCache.set(uuid, url as string)
      );
      console.log(`Caché de archivos restaurado (${fileCache.size} items)`);
    }
  } catch (err) {
    console.error("Error restaurando caché de archivos:", err);
  }
})();

/** Guardar en localStorage cada vez que se agrega algo nuevo */
function persistCache() {
  try {
    const obj: Record<string, string> = {};
    fileCache.forEach((url, uuid) => {
      obj[uuid] = url;
    });
    localStorage.setItem(CACHE_KEY, JSON.stringify(obj));
  } catch (err) {
    console.error("Error persistiendo caché de archivos:", err);
  }
}

/**
 * Obtiene los metadatos de un archivo desde storage-ms.
 * Usa el caché si ya fue obtenido previamente.
 */
export async function getFileByUuid(uuid: string): Promise<FileResponse | null> {
  if (!uuid) return null;

  // Buscar primero en caché
  if (fileCache.has(uuid)) {
    return { uuid, fileName: "", url: fileCache.get(uuid)! };
  }

  try {
    const { data } = await storageApi.get(`/files/${uuid}`);
    if (data?.url) {
      fileCache.set(uuid, data.url);
      persistCache(); // guardar en localStorage
    }
    return data;
  } catch (error) {
    console.error(`Error obteniendo archivo desde storage-ms (${uuid}):`, error);
    return null;
  }
}

/**
 * Devuelve solo la URL (usa caché global y persistente).
 */
export async function getFileUrl(uuid: string): Promise<string | null> {
  if (!uuid) return null;

  // Revisión de caché primero
  if (fileCache.has(uuid)) return fileCache.get(uuid)!;

  try {
    const { data } = await storageApi.get(`/files/${uuid}`);
    const url = data?.url || null;
    if (url) {
      fileCache.set(uuid, url);
      persistCache(); // guardar en localStorage
    }
    return url;
  } catch (error) {
    console.error(`Error obteniendo URL del archivo (${uuid}):`, error);
    return null;
  }
}

/**
 * Sube un archivo al storage-ms y guarda su UUID y URL en caché.
 */
export async function uploadFile(file: File): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await storageApi.post("/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const uuid = data?.uuid || null;
    if (uuid && data?.url) {
      fileCache.set(uuid, data.url);
      persistCache(); // guardar en localStorage
    }
    return uuid;
  } catch (error) {
    console.error("Error subiendo archivo a storage-ms:", error);
    return null;
  }
}

/**
 * Elimina un archivo del storage-ms y limpia el caché.
 */
export async function deleteFile(uuid: string): Promise<void> {
  if (!uuid) return;
  try {
    await storageApi.delete(`/files/${uuid}`);
    fileCache.delete(uuid);
    persistCache(); // guardar en localStorage
    console.log(`Archivo ${uuid} eliminado correctamente`);
  } catch (error) {
    console.error(`Error eliminando archivo (${uuid}):`, error);
  }
}

/**
 * Limpia el caché completo (memoria + localStorage).
 */
export function clearFileCache() {
  fileCache.clear();
  localStorage.removeItem(CACHE_KEY);
  console.log("Caché de archivos limpiado (memoria + localStorage)");
}
