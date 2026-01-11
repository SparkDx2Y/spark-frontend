import { api } from "@/lib/axios";
import { MATCH_ENDPOINTS } from "@/constants/api";
import { ProfileResponse } from "@/types/profile/response";
import { MatchActionResponse } from "@/types/match/response";
import { SwipeActionPayload } from "@/types/match/payload";


export const getMatchFeed = async (): Promise<ProfileResponse[]> => {
    const response = await api.get<ProfileResponse[]>(MATCH_ENDPOINTS.FEED);
    return response.data;
};

export const swipeAction = async (payload: SwipeActionPayload): Promise<MatchActionResponse> => {
    const response = await api.post<MatchActionResponse>(MATCH_ENDPOINTS.SWIPE, payload);
    return response.data;
};
