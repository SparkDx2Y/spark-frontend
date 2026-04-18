export interface NotificationResponse {
    id: string;
    type: 'like' | 'match' | 'message' | 'report_resolved' | 'report_dismissed' | 'profile_view' | 'subscription_expired' | 'subscription_expiring_soon' | 'date_reminder';
    fromUser?: {
        userId: string;
        name: string;
        profilePhoto?: string;
    };
    matchId?: string;
    messageId?: string;
    isRead: boolean;
    createdAt: string;
    isPremiumLocked?: boolean;
}

export interface NotificationCountResponse {
    count: number;
}
