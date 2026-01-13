import { api } from "@/lib/axios";
import { ADMIN_ENDPOINTS } from "@/constants/api";
import { BlockUnblockResponse, GetAllUsersResponse } from "@/types/admin/userList/response";


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
