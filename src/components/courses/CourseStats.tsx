"use client";

import { BookOpen, SlidersHorizontal, GraduationCap } from "lucide-react";

interface CourseStatsProps {
  totalCourses: number;       // cantidad tras filtros
  totalActive: number;        // activos tras filtros
  totalModules: number;       // suma de módulos tras filtros
}

export default function CourseStats({
  totalCourses,
  totalActive,
  totalModules,
}: CourseStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Total Cursos</p>
            <p className="text-2xl font-semibold text-gray-900">{totalCourses}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <SlidersHorizontal className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Activos</p>
            <p className="text-2xl font-semibold text-gray-900">{totalActive}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Total Módulos</p>
            <p className="text-2xl font-semibold text-gray-900">{totalModules}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
