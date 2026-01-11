export interface User {
    _id: string;
    name: string;
    email: string;
    isVerified: boolean;
    role: "user" | "admin";
    isBlocked: boolean;
    createdAt: string;
    updatedAt: string;
    profilePhoto?: string | null;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface GetAllUsersResponse {
    message: string;
    data: {
        users: User[];
        pagination: Pagination;
    };
}

export interface BlockUnblockResponse {
    message: string;
}