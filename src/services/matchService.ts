import { api } from "@/lib/axios";
import { MATCH_ENDPOINTS } from "@/constants/api";
import { ProfileResponse } from "@/types/profile/response";

export interface MatchActionResponse {
    isMatch: boolean;
}

export const getMatchFeed = async (): Promise<ProfileResponse[]> => {
    const response = await api.get<ProfileResponse[]>(MATCH_ENDPOINTS.GET_FEED);
    return response.data;
};

export const swipeAction = async (targetId: string, action: 'like' | 'pass'): Promise<MatchActionResponse> => {
    const response = await api.post<MatchActionResponse>(MATCH_ENDPOINTS.ACTION, { targetId, action });
    return response.data;
};
