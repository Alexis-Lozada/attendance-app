// components/attendance/Calendar.tsx
"use client";

import { useState, ReactNode } from "react";
import {
  addMonths,
  subMonths,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isToday,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const dateFormat = "d";
  const rows = [];
  let days: ReactNode[] = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const isCurrentMonth = isSameMonth(day, monthStart);

      days.push(
        <div
          key={day.toString()}
          className={`flex items-center justify-center aspect-square border border-gray-200 text-sm
  ${!isCurrentMonth ? "text-gray-300" : "text-gray-800"}
  ${isToday(day) ? "bg-gray-100 font-semibold" : ""}
`}

        >
          {format(day, dateFormat, { locale: es })}
        </div>
      );

      day = addDays(day, 1);
    }

    rows.push(
      <div className="grid grid-cols-7" key={day.toString()}>
        {days}
      </div>
    );

    days = [];
  }

  return (
    <div className="bg-white p-4 border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-100"
        >
          <ChevronLeft size={18} />
        </button>
        <h3 className="text-sm font-semibold uppercase text-gray-900">
          {format(currentMonth, "MMM yyyy", { locale: es })}
        </h3>
        <button
          onClick={handleNextMonth}
          className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-100"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-2">
        <div>Do</div>
        <div>Lu</div>
        <div>Ma</div>
        <div>Mi</div>
        <div>Ju</div>
        <div>Vi</div>
        <div>Sa</div>
      </div>

      {/* Días */}
      {rows}
    </div>
  );
}
