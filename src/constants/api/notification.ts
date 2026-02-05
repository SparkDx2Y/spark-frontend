export const NOTIFICATION_ENDPOINTS = {
    GET_ALL: '/notifications',
    GET_UNREAD: '/notifications/unread',
    GET_COUNT: '/notifications/count',
    MARK_AS_READ: (notificationId: string) => `/notifications/${notificationId}/read`,
    MARK_ALL_AS_READ: '/notifications/read-all',
} as const;
