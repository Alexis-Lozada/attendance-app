export interface Division {
    id: number;
    idUniversity: number;
    code: string;
    name: string;
    description: string;
    status: boolean;
}

export interface Filters {
    search: string;
    status: string;
}

export type ColumnKey = "code" | "name" | "description" | "status" | "acciones";

export interface VisibleColumns {
    code: boolean;
    name: boolean;
    description: boolean;
    status: boolean;
    acciones: boolean;
}