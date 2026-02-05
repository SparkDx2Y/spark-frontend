export const MESSAGE_ENDPOINTS = {
    SEND: '/messages',
    GET_MATCHES: '/messages/matches',
    GET_MESSAGES: (matchId: string) => `/messages/${matchId}`,
    MARK_AS_READ: (matchId: string) => `/messages/${matchId}/read`,
} as const;
