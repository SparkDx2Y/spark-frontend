
export interface SignupResponse {
  message: string;
}

export interface VerifyOtpResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    profilePhoto?: string | null;
    interests?: string[];
  };
  isProfileCompleted: boolean;
  isInterestsSelected: boolean;
}

export interface ResendOtpResponse {
  message: string;
}

export interface LoginResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    profilePhoto?: string | null;
    interests?: string[];
  };
  isProfileCompleted: boolean;
  isInterestsSelected: boolean;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ForgotPasswordVerifyOtpResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}


