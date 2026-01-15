import { api } from "@/lib/axios";
import { PROFILE_ENDPOINTS } from "@/constants/api";
import { CompleteProfilePayload, UpdateProfilePayload } from "@/types/profile/payload";
import { CompleteProfileResponse, InterestCategoryWithInterests, ProfileResponse, UpdateInterestsResponse } from "@/types/profile/response";

export const completeProfile = async (data: CompleteProfilePayload): Promise<CompleteProfileResponse> => {
    const response = await api.post<CompleteProfileResponse>(PROFILE_ENDPOINTS.COMPLETE_PROFILE, data);
    return response.data;
};

export const getMyProfile = async (): Promise<ProfileResponse> => {
    const response = await api.get<ProfileResponse>(PROFILE_ENDPOINTS.GET_PROFILE);
    return response.data;
};

export const updateProfile = async (data: UpdateProfilePayload): Promise<{ message: string; profile: ProfileResponse }> => {
    const response = await api.put<{ message: string; profile: ProfileResponse }>(PROFILE_ENDPOINTS.UPDATE_PROFILE, data);
    return response.data;
};

export const getInterests = async (): Promise<InterestCategoryWithInterests[]> => {
    const response = await api.get<InterestCategoryWithInterests[]>(PROFILE_ENDPOINTS.GET_INTERESTS);
    return response.data;
};

export const updateInterests = async (interests: string[]): Promise<UpdateInterestsResponse> => {
    const response = await api.post<UpdateInterestsResponse>(PROFILE_ENDPOINTS.UPDATE_INTERESTS, { interests });
    return response.data;
};
