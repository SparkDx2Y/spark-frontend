import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { MATCH_ENDPOINTS } from "@/constants/api/match";
import { ProfileResponse } from "@/types/profile/response";
import { MatchActionResponse, ActivityResponse } from "@/types/match/response";
import { SwipeActionPayload } from "@/types/match/payload";


export const getMatchFeed = async (): Promise<ApiResponse<ProfileResponse[]>> => {
    const response = await api.get<ApiResponse<ProfileResponse[]>>(MATCH_ENDPOINTS.FEED);
    return response.data;
};

export const swipeAction = async (payload: SwipeActionPayload): Promise<ApiResponse<MatchActionResponse>> => {
    const response = await api.post<ApiResponse<MatchActionResponse>>(MATCH_ENDPOINTS.SWIPE, payload);
    return response.data;
};

export const getActivity = async (): Promise<ApiResponse<ActivityResponse>> => {
    const response = await api.get<ApiResponse<ActivityResponse>>(MATCH_ENDPOINTS.ACTIVITY);
    return response.data;
};
