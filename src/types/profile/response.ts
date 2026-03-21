import { ApiResponse } from '@/types/api';

export interface ProfileResponse {
    id: string;
    userId: string;
    name: string;
    age?: number;
    bio?: string;
    gender?: 'male' | 'female';
    interestedIn?: 'male' | 'female';
    profilePhoto?: string | null;
    coverPhoto?: string | null;
    photos: string[];
    interests?: string[];
    distanceKm?: number;
    hasSwiped?: boolean;
}

export interface InterestResponse {
    id: string;
    name: string;
}


export type UpdateInterestsResponse = ApiResponse<{
    isInterestsSelected: boolean;
    profile: ProfileResponse;
}>;

export type CompleteProfileResponse = ApiResponse<{
    isCompleted: boolean;
    profile: ProfileResponse;
}>;
