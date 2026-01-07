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
}


export interface CompleteProfileResponse {
    message: string;
    isCompleted: boolean;
    profile: ProfileResponse;
}
