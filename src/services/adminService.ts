import { api } from "@/lib/axios";
import { ADMIN_ENDPOINTS } from "@/constants/api";
import { BlockUnblockResponse, GetAllUsersResponse } from "@/types/admin/userList/response";
import {
    GetAllCategoriesResponse,
    CreateCategoryResponse,
    GetAllInterestsResponse,
    CreateInterestResponse,
    UpdateCategoryResponse,
    UpdateInterestResponse,
    SetCategoryActiveResponse,
    SetInterestActiveResponse,
    CreateCategoryRequest,
    CreateInterestRequest,
    UpdateCategoryRequest,
    UpdateInterestRequest,
    SetActiveRequest
} from "@/types/admin/interest";
import {
    GetReportsResponse,
    UpdateReportStatusResponse
} from "@/types/admin/report";
import { ReportStatus } from "@/constants/report";


// --------------------
// Get users (search + pagination)
// --------------------
export const getAllUsers = async (params: { search?: string; page?: number; limit?: number; }): Promise<GetAllUsersResponse> => {
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

// --------------------
// Categories & Interests
// --------------------

export const getAllCategories = async (): Promise<GetAllCategoriesResponse> => {
    const response = await api.get<GetAllCategoriesResponse>(ADMIN_ENDPOINTS.GET_CATEGORIES);
    return response.data;
};

export const createCategory = async (data: CreateCategoryRequest): Promise<CreateCategoryResponse> => {
    const response = await api.post<CreateCategoryResponse>(ADMIN_ENDPOINTS.CREATE_CATEGORY, data);
    return response.data;
};

export const updateCategory = async (id: string, data: UpdateCategoryRequest): Promise<UpdateCategoryResponse> => {
    const response = await api.put<UpdateCategoryResponse>(ADMIN_ENDPOINTS.UPDATE_CATEGORY.replace(":id", id), data);
    return response.data;
};

export const setCategoryActive = async (id: string, data: SetActiveRequest): Promise<SetCategoryActiveResponse> => {
    const response = await api.patch<SetCategoryActiveResponse>(ADMIN_ENDPOINTS.SET_CATEGORY_ACTIVE.replace(":id", id), data);
    return response.data;
};

export const getAllInterests = async (): Promise<GetAllInterestsResponse> => {
    const response = await api.get<GetAllInterestsResponse>(ADMIN_ENDPOINTS.GET_INTERESTS);
    return response.data;
};

export const createInterest = async (data: CreateInterestRequest): Promise<CreateInterestResponse> => {
    const response = await api.post<CreateInterestResponse>(ADMIN_ENDPOINTS.CREATE_INTEREST, data);
    return response.data;
};

export const updateInterest = async (id: string, data: UpdateInterestRequest): Promise<UpdateInterestResponse> => {
    const response = await api.put<UpdateInterestResponse>(ADMIN_ENDPOINTS.UPDATE_INTEREST.replace(":id", id), data);
    return response.data;
};

export const setInterestActive = async (id: string, data: SetActiveRequest): Promise<SetInterestActiveResponse> => {
    const response = await api.patch<SetInterestActiveResponse>(ADMIN_ENDPOINTS.SET_INTEREST_ACTIVE.replace(":id", id), data);
    return response.data;
};

// --------------------
// Reports
// --------------------

export const getReports = async (): Promise<GetReportsResponse> => {
    const response = await api.get<GetReportsResponse>(ADMIN_ENDPOINTS.GET_REPORTS);
    return response.data;
};

export const updateReportStatus = async (
    reportId: string,
    status: ReportStatus
): Promise<UpdateReportStatusResponse> => {
    const response = await api.patch<UpdateReportStatusResponse>(
        ADMIN_ENDPOINTS.UPDATE_REPORT_STATUS.replace(":reportId", reportId),
        { status }
    );

    return response.data;
};
