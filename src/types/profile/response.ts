export interface ProfileResponse {
    id: string;
    userId: string;
    name: string;
    age?: number;
    gender?: 'male' | 'female';
    interestedIn?: 'male' | 'female';
    profilePhoto?: string | null;
    coverPhoto?: string | null;
    photos: string[];
    interests?: string[];
    distanceKm?: number;
}


export interface InterestResponse {
    id: string;
    name: string;
}

export interface InterestCategoryWithInterests {
    id: string;
    name: string;
    interests: InterestResponse[];
}

export interface UpdateInterestsResponse {
    message: string;
    isInterestsSelected: boolean;
    profile: ProfileResponse;
}

export interface CompleteProfileResponse {
    message: string;
    isCompleted: boolean;
    profile: ProfileResponse;
}
