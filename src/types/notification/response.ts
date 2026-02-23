export interface NotificationResponse {
    id: string;
    type: 'like' | 'match' | 'message' | 'report_resolved' | 'report_dismissed';
    fromUser: {
        userId: string;
        name: string;
        profilePhoto?: string;
    };
    matchId?: string;
    messageId?: string;
    isRead: boolean;
    createdAt: string;
}

export interface NotificationCountResponse {
    count: number;
}
