export interface MessageResponse {
    id: string;
    matchId: string;
    senderId: string;
    content: string;
    isRead: boolean;
    createdAt: string;
}

export interface UserInfo {
    userId: string;
    name: string;
    profilePhoto: string;
}

export interface MatchResponse {
    id: string;
    users: UserInfo[];
    lastMessageAt?: string;
    createdAt: string;
}
