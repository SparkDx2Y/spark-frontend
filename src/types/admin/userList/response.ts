import { ApiResponse } from '@/types/api';

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

export type GetAllUsersResponse = ApiResponse<{
    users: User[];
    pagination: Pagination;
}>;

export type BlockUnblockResponse = ApiResponse<null>;