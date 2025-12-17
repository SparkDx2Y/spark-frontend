
export interface SignupResponse {
  userId: string;
  message: string;
}

export interface VerifyOtpResponse {
  message: string;
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
  };
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


