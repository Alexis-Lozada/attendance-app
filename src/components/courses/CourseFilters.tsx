"use client";

import { Building2, Hash } from "lucide-react";
import React from "react";

type Division = {
  idDivision: number;
  code: string;
  name: string;
};

interface CourseFiltersProps {
  divisions: Division[];
  semesters: string[];
  selectedDivision: number | "all";
  selectedSemester: string | "all";
  onChangeDivision: (divisionId: number | "all") => void;
  onChangeSemester: (semester: string | "all") => void;
}

export default function CourseFilters({
  divisions,
  semesters,
  selectedDivision,
  selectedSemester,
  onChangeDivision,
  onChangeSemester,
}: CourseFiltersProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Division filter */}
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">División:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onChangeDivision("all")}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
              selectedDivision === "all"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Todas las divisiones
          </button>

          {divisions.map((division) => (
            <button
              key={division.idDivision}
              onClick={() => onChangeDivision(division.idDivision)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                selectedDivision === division.idDivision
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              title={division.name}
            >
              {division.code}
            </button>
          ))}
        </div>

        {/* Semester filter */}
        {semesters.length > 0 && (
          <>
            <div className="flex items-center gap-2 lg:ml-6">
              <Hash className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Semestre:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onChangeSemester("all")}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  selectedSemester === "all"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Todos
              </button>

              {semesters.map((semester) => (
                <button
                  key={semester}
                  onClick={() => onChangeSemester(semester)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                    selectedSemester === semester
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {semester}°
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Active filters info */}
      {(selectedDivision !== "all" || selectedSemester !== "all") && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            Mostrando cursos de:{" "}
            {selectedDivision !== "all" && (
              <span className="font-medium text-gray-700">
                {divisions.find((d) => d.idDivision === selectedDivision)?.name}
              </span>
            )}
            {selectedDivision !== "all" && selectedSemester !== "all" && " • "}
            {selectedSemester !== "all" && (
              <span className="font-medium text-gray-700">Semestre {selectedSemester}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
