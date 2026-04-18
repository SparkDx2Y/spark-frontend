export const MATCH_ENDPOINTS = {
    FEED: "/match/feed",
    SWIPE: "/match/swipe",
    ACTIVITY: "/match/activity",
    SUGGEST_DATE: (matchId: string) => `/match/suggest-date/${matchId}`,
} as const;
