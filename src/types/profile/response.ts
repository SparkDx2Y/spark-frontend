export interface ProfileResponse {
    id: string;
    userId: string;
    age?: number;
    gender: 'male' | 'female';
    interestedIn?: 'male' | 'female';
    photos?: string[];
}

export interface CompleteProfileResponse {
    message: string;
    isCompleted: boolean;
    profile: ProfileResponse;
}
