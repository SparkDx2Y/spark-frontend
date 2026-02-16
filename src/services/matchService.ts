import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { MATCH_ENDPOINTS } from "@/constants/api";
import { ProfileResponse } from "@/types/profile/response";
import { MatchActionResponse } from "@/types/match/response";
import { SwipeActionPayload } from "@/types/match/payload";


export const getMatchFeed = async (): Promise<ApiResponse<ProfileResponse[]>> => {
    const response = await api.get<ApiResponse<ProfileResponse[]>>(MATCH_ENDPOINTS.FEED);
    return response.data;
};

export const swipeAction = async (payload: SwipeActionPayload): Promise<ApiResponse<MatchActionResponse>> => {
    const response = await api.post<ApiResponse<MatchActionResponse>>(MATCH_ENDPOINTS.SWIPE, payload);
    return response.data;
};
