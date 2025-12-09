
export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string; 
}

export interface VerifyOtpPayload {
  userId: string;
  otp: string;
}

export interface ResendOtpPayload {
  userId: string; 
}

export interface LoginPayload {
  email: string;
  password: string;
}