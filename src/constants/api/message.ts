export const MESSAGE_ENDPOINTS = {
    SEND: '/messages',
    GET_MATCHES: '/messages/matches',
    GET_COUNT: '/messages/count',
    GET_MESSAGES: (matchId: string) => `/messages/${matchId}`,
    MARK_AS_READ: (matchId: string) => `/messages/${matchId}/read`,
    DELETE: (messageId: string) => `/messages/${messageId}`,
    RESPOND_TO_PROPOSAL: (messageId: string) => `/messages/proposal/${messageId}`,
    GET_DATE_PROPOSALS: '/messages/date-proposals',
} as const;
