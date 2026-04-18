export interface MessageResponse {
    id: string;
    matchId: string;
    senderId: string;
    content: string;
    type: 'text' | 'image' | 'audio' | 'video_call' | 'date_proposal';
    metadata?: {
        placeId?: string;
        name?: string;
        address?: string;
        rating?: number;
        photo?: string;
        proposalStatus?: 'pending' | 'accepted' | 'declined' | 'suggested';
        lastSuggestedBy?: string;
        scheduledAt?: string;
    };
    isRead: boolean;
    createdAt: string;
}

export interface UserInfo {
    userId: string;
    name: string;
    profilePhoto: string;
    isBlocked: boolean;
}

export interface MatchResponse {
    id: string;
    users: UserInfo[];
    lastMessageAt?: string;
    lastMessage?: string;
    lastMessageType?: 'text' | 'image' | 'audio' | 'video_call' | 'date_proposal';
    createdAt: string;
}
