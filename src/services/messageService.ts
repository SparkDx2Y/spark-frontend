import { api } from "@/lib/axios";
import { MESSAGE_ENDPOINTS } from "@/constants/api";
import { MessageResponse, MatchResponse } from "@/types/message/response";
import { SendMessagePayload } from "@/types/message/payload";
import { ApiResponse } from "@/types/api";

export const sendMessage = async (payload: SendMessagePayload): Promise<ApiResponse<MessageResponse>> => {
    const response = await api.post<ApiResponse<MessageResponse>>(MESSAGE_ENDPOINTS.SEND, payload);
    return response.data;
};

export const getMatches = async (page?: number, limit?: number, search?: string): Promise<ApiResponse<MatchResponse[]>> => {
    const response = await api.get<ApiResponse<MatchResponse[]>>(MESSAGE_ENDPOINTS.GET_MATCHES, {
        params: { page, limit, search }
    });
    return response.data;
};

export const getUnreadMessageCount = async (): Promise<ApiResponse<{ count: number }>> => {
    const response = await api.get<ApiResponse<{ count: number }>>(MESSAGE_ENDPOINTS.GET_COUNT);
    return response.data;
};

export const getMessages = async (matchId: string, limit?: number): Promise<ApiResponse<MessageResponse[]>> => {
    const url = MESSAGE_ENDPOINTS.GET_MESSAGES(matchId);
    const response = await api.get<ApiResponse<MessageResponse[]>>(url, {
        params: limit ? { limit } : undefined
    });
    return response.data;
};

export const markMessagesAsRead = async (matchId: string): Promise<void> => {
    await api.put(MESSAGE_ENDPOINTS.MARK_AS_READ(matchId));
};

export const deleteMessage = async (messageId: string): Promise<void> => {
    await api.delete(MESSAGE_ENDPOINTS.DELETE(messageId));
};
