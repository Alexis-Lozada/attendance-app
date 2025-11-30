// hooks/attendance/useStudentImageUrls.ts
"use client";

import { useEffect, useState } from "react";
import { getFileUrl } from "@/services/storage.service";
import type { StudentInfo } from "@/utils/attendance/AttendanceTableUtils";

export function useStudentImageUrls(students: StudentInfo[]) {
  const [imageUrls, setImageUrls] = useState<Record<number, string>>({});

  useEffect(() => {
    let cancelled = false;

    async function loadImages() {
      const newMap: Record<number, string> = {};

      await Promise.all(
        students.map(async (student) => {
          const raw = student.profileImage;
          if (!raw) return;

          // Si ya viene como URL, úsala directo
          if (raw.startsWith("http://") || raw.startsWith("https://")) {
            newMap[student.idStudent] = raw;
            return;
          }

          // Si parece UUID, pedimos al storage-ms
          const url = await getFileUrl(raw);
          if (url) {
            newMap[student.idStudent] = url;
          }
        })
      );

      if (!cancelled) {
        setImageUrls(newMap);
      }
    }

    if (students.length > 0) {
      loadImages();
    } else {
      setImageUrls({});
    }

    return () => {
      cancelled = true;
    };
  }, [students]);

  return imageUrls;
}
