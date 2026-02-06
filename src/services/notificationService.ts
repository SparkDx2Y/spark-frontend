import { api } from "@/lib/axios";
import { NOTIFICATION_ENDPOINTS } from "@/constants/api";
import { NotificationResponse, NotificationCountResponse } from "@/types/notification/response";

export const getNotifications = async (limit?: number): Promise<NotificationResponse[]> => {
    const response = await api.get<NotificationResponse[]>(NOTIFICATION_ENDPOINTS.GET_ALL, {
        params: limit ? { limit } : undefined
    });
    return response.data;
};


export const getNotificationCount = async (): Promise<number> => {
    const response = await api.get<NotificationCountResponse>(NOTIFICATION_ENDPOINTS.GET_COUNT);
    return response.data.count;
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
    await api.put(NOTIFICATION_ENDPOINTS.MARK_AS_READ(notificationId));
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
    await api.put(NOTIFICATION_ENDPOINTS.MARK_ALL_AS_READ);
};
