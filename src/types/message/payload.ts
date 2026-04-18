export interface SendMessagePayload {
    matchId: string;
    content: string;
    type?: 'text' | 'image' | 'audio' | 'video_call' | 'date_proposal';
    metadata?: {
        placeId?: string;
        name?: string;
        address?: string;
        rating?: number;
        photo?: string;
    };
}
