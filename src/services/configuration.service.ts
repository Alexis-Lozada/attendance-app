import { api } from "@/services/api";

export interface ConfigurationResponse {
  idConfiguration: number;
  idUniversity: number;
  parameterName: string;
  parameterValue: string;
  description: string;
}

// === Obtener todas las configuraciones de una universidad ===
export async function getConfigurationsByUniversity(
  idUniversity: number
): Promise<ConfigurationResponse[]> {
  const { data } = await api.get(`/configurations/university/${idUniversity}`);
  return data;
}

// === Obtener el color del tema de la universidad ===
export async function getUniversityThemeColor(
  idUniversity: number
): Promise<string | null> {
  try {
    const configs = await getConfigurationsByUniversity(idUniversity);
    const themeConfig = configs.find(
      (c) => c.parameterName === "theme_primary_color"
    );
    return themeConfig?.parameterValue || null;
  } catch (error) {
    console.error("Error obteniendo color del tema:", error);
    return null;
  }
}

// === Actualizar o crear el color de tema (solo envía idUniversity, no el objeto) ===
export async function updateUniversityThemeColor(
  idUniversity: number,
  color: string
): Promise<void> {
  try {
    const configs = await getConfigurationsByUniversity(idUniversity);
    const themeConfig = configs.find(
      (c) => c.parameterName === "theme_primary_color"
    );

    if (themeConfig) {
      // Evitar peticiones innecesarias si el color no cambió
      if (themeConfig.parameterValue === color) {
        console.log("El color ya está actualizado, no se realizaron cambios.");
        return;
      }

      // ✅ Actualizar existente (solo IDs planos)
      await api.put(`/configurations/${themeConfig.idConfiguration}`, {
        idConfiguration: themeConfig.idConfiguration,
        idUniversity,
        parameterName: themeConfig.parameterName,
        parameterValue: color,
        description: themeConfig.description,
      });

      console.log(
        `Color de tema actualizado para universidad ${idUniversity}: ${color}`
      );
    } else {
      // ✅ Crear nueva configuración si no existe
      await api.post(`/configurations`, {
        idUniversity,
        parameterName: "theme_primary_color",
        parameterValue: color,
        description: "Primary color of the dashboard theme",
      });

      console.log(
        `Color de tema creado para universidad ${idUniversity}: ${color}`
      );
    }
  } catch (error) {
    console.error("Error actualizando color del tema:", error);
    throw error;
  }
}
