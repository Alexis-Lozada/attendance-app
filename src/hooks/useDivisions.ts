"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getDivisionsByUniversity } from "@/services/division.service";
import type { Division } from "@/components/divisions/DivisionsTypes";

export interface DivisionOption {
    value: number;
    label: string;
}

/**
 * Hook para cargar divisiones y convertirlas en opciones para Select
 */
export function useDivisions() {
    const { user } = useAuth();
    const [divisions, setDivisions] = useState<Division[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 🔹 Cargar divisiones
    useEffect(() => {
        if (!user?.idUniversity) return;

        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getDivisionsByUniversity(user.idUniversity);

                // 🔹 Mapear DivisionResponse[] a Division[]
                const mappedDivisions: Division[] = data.map(division => ({
                    id: division.idDivision,
                    idUniversity: division.idUniversity,
                    code: division.code,
                    name: division.name,
                    description: division.description,
                    status: division.status,
                }));

                const activeDivisions = mappedDivisions.filter(division => division.status);
                setDivisions(activeDivisions);
            } catch (err) {
                console.error("Error al cargar divisiones:", err);
                setError("No se pudieron cargar las divisiones");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [user?.idUniversity]);

    // 🔹 Convertir divisiones a opciones para Select
    const divisionOptions: DivisionOption[] = divisions.map(division => ({
        value: division.id,
        label: `${division.code} - ${division.name}`,
    }));

    return {
        divisions,
        divisionOptions,
        loading,
        error,
    };
}