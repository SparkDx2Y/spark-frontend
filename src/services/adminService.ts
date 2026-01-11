import { api } from "@/lib/axios";
import { ADMIN_ENDPOINTS } from "@/constants/api";

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

// --------------------
// Get users (search + pagination)
// --------------------
export const getAllUsers = async (params: { search?: string; page?: number; limit?: number;}): Promise<GetAllUsersResponse> => {
    const response = await api.get<GetAllUsersResponse>(
        ADMIN_ENDPOINTS.GET_ALL_USERS,
        { params }
    );

    return response.data;
};

// --------------------
// Block / Unblock user
// --------------------
export const updateUserBlockStatus = async (
    userId: string,
    isBlocked: boolean
): Promise<BlockUnblockResponse> => {
    const response = await api.patch<BlockUnblockResponse>(
        ADMIN_ENDPOINTS.UPDATE_USER_BLOCK_STATUS.replace(":userId", userId),
        { isBlocked }
    );

    return response.data;
};
