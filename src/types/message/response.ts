export interface MessageResponse {
    id: string;
    matchId: string;
    senderId: string;
    content: string;
    type: 'text' | 'image' | 'audio';
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
    lastMessage?: string;
    lastMessageType?: 'text' | 'image' | 'audio';
    createdAt: string;
}
