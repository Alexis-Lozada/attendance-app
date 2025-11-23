// /utils/attendance/DateUtils.ts

// Convierte "HH:mm" o "HH:mm:ss" a "10:00 AM"
export function formatTimeAMPM(timeStr: string): string {
  if (!timeStr) return "";

  const parts = timeStr.split(":");
  let hours = parseInt(parts[0] || "0", 10);
  const minutes = parseInt(parts[1] || "0", 10);

  const period = hours >= 12 ? "PM" : "AM";
  let h12 = hours % 12;
  if (h12 === 0) h12 = 12;

  const minutesStr = String(minutes).padStart(2, "0");

  return `${h12}:${minutesStr} ${period}`;
}

// Traduce dayOfWeek del backend a español (por si lo usas en otros lados)
export function formatDayOfWeekEs(dayOfWeek: string): string {
  const map: Record<string, string> = {
    MONDAY: "Lunes",
    TUESDAY: "Martes",
    WEDNESDAY: "Miércoles",
    THURSDAY: "Jueves",
    FRIDAY: "Viernes",
    SATURDAY: "Sábado",
    SUNDAY: "Domingo",
  };

  const key = (dayOfWeek || "").toUpperCase();
  return map[key] ?? dayOfWeek;
}

// Mapa común para días de la semana
const weekdayMap: Record<string, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

// 🔧 helper interno para parsear "HH:mm" / "HH:mm:ss"
function parseTime(timeStr: string): { hours: number; minutes: number } {
  const parts = (timeStr || "00:00").split(":");
  const hours = parseInt(parts[0] || "0", 10);
  const minutes = parseInt(parts[1] || "0", 10);
  return { hours, minutes };
}

// 🔧 helper interno: capitalizar primera letra
function capitalizeFirst(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Calcula la fecha de la PRÓXIMA clase según:
// - dayOfWeek (MONDAY, FRIDAY, etc.)
// - startTime / endTime
// Regla:
//  - Si hoy es ese día y AÚN no termina la clase → usar hoy
//  - Si ya terminó o es otro día → usar la siguiente ocurrencia de ese día
export function getNextClassDate(
  dayOfWeek: string,
  startTime: string,
  endTime: string
): Date {
  const now = new Date();
  const { hours: startH, minutes: startM } = parseTime(startTime);
  const { hours: endH, minutes: endM } = parseTime(endTime);

  const key = (dayOfWeek || "").toUpperCase();
  const targetIndex =
    weekdayMap[key] !== undefined ? weekdayMap[key] : now.getDay();
  const todayIndex = now.getDay();

  const result = new Date(now);

  // Caso: hoy es el mismo día de la semana
  if (todayIndex === targetIndex) {
    const endToday = new Date(now);
    endToday.setHours(endH, endM, 0, 0);

    // Si la clase NO ha terminado aún → usamos hoy
    if (now <= endToday) {
      result.setHours(startH, startM, 0, 0);
      return result;
    }
    // Si ya terminó → caemos al cálculo de la siguiente semana
  }

  // Diferencia de días hacia el próximo target
  let delta = (targetIndex - todayIndex + 7) % 7;
  if (delta === 0) delta = 7; // mismo día pero siguiente semana

  result.setDate(result.getDate() + delta);
  result.setHours(startH, startM, 0, 0);

  return result;
}

// Devuelve algo como: "Martes 17 de enero 2020"
export function formatClassDateEs(
  dayOfWeek: string,
  startTime: string,
  endTime: string
): string {
  const date = getNextClassDate(dayOfWeek, startTime, endTime);

  const weekday = capitalizeFirst(
    date.toLocaleDateString("es-MX", { weekday: "long" })
  );
  const day = date.getDate();
  const month = date.toLocaleDateString("es-MX", { month: "long" });
  const year = date.getFullYear();

  // Ej: "Martes 17 de enero 2020"
  return `${weekday} ${day} de ${month} ${year}`;
}

// ✅ Devuelve true SOLO si ahora mismo es el día y la hora del horario
export function isNowWithinClass(
  dayOfWeek: string,
  startTime: string,
  endTime: string
): boolean {
  const now = new Date();

  const key = (dayOfWeek || "").toUpperCase();
  const targetIndex =
    weekdayMap[key] !== undefined ? weekdayMap[key] : now.getDay();

  // Si hoy no es el día de la clase → falso
  if (now.getDay() !== targetIndex) return false;

  const { hours: startH, minutes: startM } = parseTime(startTime);
  const { hours: endH, minutes: endM } = parseTime(endTime);

  const start = new Date(now);
  start.setHours(startH, startM, 0, 0);

  const end = new Date(now);
  end.setHours(endH, endM, 0, 0);

  return now >= start && now <= end;
}
