
import { ApiResponse } from '@/types/api';

export type SignupResponse = ApiResponse<string>;

export type VerifyOtpResponse = ApiResponse<{
  user: {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    profilePhoto?: string | null;
    interests?: string[];
    isProfileCompleted: boolean;
    isInterestsSelected: boolean;
    isLocationCompleted: boolean;
  };
}>;

export type ResendOtpResponse = ApiResponse<string>;

export type LoginResponse = ApiResponse<{
  user: {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    profilePhoto?: string | null;
    interests?: string[];
    isProfileCompleted: boolean;
    isInterestsSelected: boolean;
    isLocationCompleted: boolean;
  };
}>;

export type ForgotPasswordResponse = ApiResponse<string>;

export type ForgotPasswordVerifyOtpResponse = ApiResponse<string>;

export type ResetPasswordResponse = ApiResponse<string>;


export type ChangePasswordResponse = ApiResponse<string>;
