import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { PROFILE_ENDPOINTS } from "@/constants/api";
import { CompleteProfilePayload, UpdateProfilePayload } from "@/types/profile/payload";
import { CompleteProfileResponse, InterestResponse, ProfileResponse, UpdateInterestsResponse } from "@/types/profile/response";

export const completeProfile = async (data: CompleteProfilePayload): Promise<CompleteProfileResponse> => {
    const response = await api.post<CompleteProfileResponse>(PROFILE_ENDPOINTS.COMPLETE_PROFILE, data);
    return response.data;
};

export const getMyProfile = async (): Promise<ApiResponse<ProfileResponse>> => {
    const response = await api.get<ApiResponse<ProfileResponse>>(PROFILE_ENDPOINTS.GET_PROFILE);
    return response.data;
};

export const updateProfile = async (data: UpdateProfilePayload): Promise<ApiResponse<{ profile: ProfileResponse }>> => {
    const response = await api.put<ApiResponse<{ profile: ProfileResponse }>>(PROFILE_ENDPOINTS.UPDATE_PROFILE, data);
    return response.data;
};

export const getInterests = async (): Promise<ApiResponse<InterestResponse[]>> => {
    const response = await api.get<ApiResponse<InterestResponse[]>>(PROFILE_ENDPOINTS.GET_INTERESTS);
    return response.data;
};

export const updateInterests = async (interests: string[]): Promise<UpdateInterestsResponse> => {
    const response = await api.post<UpdateInterestsResponse>(PROFILE_ENDPOINTS.UPDATE_INTERESTS, { interests });
    return response.data;
};

export const updateLocation = async (latitude: number, longitude: number): Promise<ApiResponse<{ isLocationCompleted: boolean }>> => {
    const response = await api.put<ApiResponse<{ isLocationCompleted: boolean }>>(PROFILE_ENDPOINTS.UPDATE_LOCATION, { latitude, longitude });
    return response.data;
};

export const getPublicProfile = async (userId: string): Promise<ApiResponse<ProfileResponse>> => {
    const response = await api.get<ApiResponse<ProfileResponse>>(PROFILE_ENDPOINTS.PUBLIC_PROFILE(userId));
    return response.data;
};

