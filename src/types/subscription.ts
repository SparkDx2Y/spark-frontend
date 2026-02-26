export interface SubscriptionFeatures {
    seeWhoLikedYou: boolean;
    seeWhoViewedProfile: boolean;
    chatEnabled: boolean;
    dailyMessageLimit: number;
    mediaSharingEnabled: boolean;
    audioEnabled: boolean;
    videoCallEnabled: boolean;
    swipeLimit: number;
}

export interface SubscriptionPlan {
    _id: string;
    name: string;
    price: number;
    durationValue: number;
    durationUnit: "month" | "year";
    features: SubscriptionFeatures;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface GetSubscriptionsResponse {
    plans: SubscriptionPlan[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

