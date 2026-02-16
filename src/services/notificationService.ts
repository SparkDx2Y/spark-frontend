import { api } from "@/lib/axios";
import { NOTIFICATION_ENDPOINTS } from "@/constants/api";
import { NotificationResponse, NotificationCountResponse } from "@/types/notification/response";
import { ApiResponse } from "@/types/api";

export const getNotifications = async (limit?: number): Promise<ApiResponse<NotificationResponse[]>> => {
    const response = await api.get<ApiResponse<NotificationResponse[]>>(NOTIFICATION_ENDPOINTS.GET_ALL, {
        params: limit ? { limit } : undefined
    });
    return response.data;
};


export const getNotificationCount = async (): Promise<ApiResponse<NotificationCountResponse>> => {
    const response = await api.get<ApiResponse<NotificationCountResponse>>(NOTIFICATION_ENDPOINTS.GET_COUNT);
    return response.data;
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
    await api.put(NOTIFICATION_ENDPOINTS.MARK_AS_READ(notificationId));
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
    await api.put(NOTIFICATION_ENDPOINTS.MARK_ALL_AS_READ);
};
