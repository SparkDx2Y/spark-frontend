export interface CompleteProfilePayload {
    age?: number;
    gender?: 'male' | 'female';
    interestedIn?: 'male' | 'female';
    profilePhoto?: string | null;
    coverPhoto?: string | null;
    photos?: string[];
}

export interface UpdateProfilePayload {
    age?: number;
    gender?: 'male' | 'female';
    interestedIn?: 'male' | 'female';
    profilePhoto?: string | null;
    coverPhoto?: string | null;
    photos?: string[];
}
