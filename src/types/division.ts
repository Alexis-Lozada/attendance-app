export interface Division {
    id: number;
    idUniversity: number;
    idCoordinator?: number;
    code: string;
    name: string;
    description: string;
    status: boolean;
    // Coordinator information (populated from user data)
    coordinatorName?: string;
    coordinatorImage?: string;
}