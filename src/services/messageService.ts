import { api } from "@/lib/axios";
import { MESSAGE_ENDPOINTS } from "@/constants/api";
import { MessageResponse, MatchResponse } from "@/types/message/response";
import { SendMessagePayload } from "@/types/message/payload";

export const sendMessage = async (payload: SendMessagePayload): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>(MESSAGE_ENDPOINTS.SEND, payload);
    return response.data;
};

export const getMatches = async (): Promise<MatchResponse[]> => {
    const response = await api.get<MatchResponse[]>(MESSAGE_ENDPOINTS.GET_MATCHES);
    return response.data;
};

export const getMessages = async (matchId: string, limit?: number): Promise<MessageResponse[]> => {
    const url = MESSAGE_ENDPOINTS.GET_MESSAGES(matchId);
    const response = await api.get<MessageResponse[]>(url, {
        params: limit ? { limit } : undefined
    });
    return response.data;
};

export const markMessagesAsRead = async (matchId: string): Promise<void> => {
    await api.put(MESSAGE_ENDPOINTS.MARK_AS_READ(matchId));
};
