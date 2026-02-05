export const PROFILE_ENDPOINTS = {
    COMPLETE_PROFILE: "/profile/complete",
    GET_PROFILE: "/profile/profile",
    UPDATE_PROFILE: "/profile/profile",
    GET_INTERESTS: "/profile/interests",
    UPDATE_INTERESTS: "/profile/interests",
    UPDATE_LOCATION: "/profile/location",
    PUBLIC_PROFILE: (userId: string) => `/profile/${userId}`,
} as const;



