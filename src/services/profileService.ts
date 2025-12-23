import { api } from "@/lib/axios";
import { PROFILE_ENDPOINTS } from "@/constants/api";
import { CompleteProfilePayload } from "@/types/profile/payload";
import { CompleteProfileResponse, ProfileResponse } from "@/types/profile/response";

export const completeProfile = async (data: CompleteProfilePayload): Promise<CompleteProfileResponse> => {
    const response = await api.post<CompleteProfileResponse>(PROFILE_ENDPOINTS.COMPLETE_PROFILE, data);
    return response.data;
};

export const getMyProfile = async (): Promise<ProfileResponse> => {
    const response = await api.get<ProfileResponse>(PROFILE_ENDPOINTS.GET_PROFILE);
    return response.data;
};
