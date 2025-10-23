export interface Division {
    id: number;
    idUniversity: number;
    code: string;
    name: string;
    description: string;
    status: boolean;
}

export interface DivisionFormData {
    codigo: string;
    nombre: string;
    descripcion: string;
    status: boolean;
}