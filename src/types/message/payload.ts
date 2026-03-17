export interface SendMessagePayload {
    matchId: string;
    content: string;
    type?: 'text' | 'image' | 'audio';
}
