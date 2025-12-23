export interface CompleteProfilePayload {
    age?: number;
    gender?: 'male' | 'female';
    interestedIn?: 'male' | 'female';
    photos?: string[];
}
