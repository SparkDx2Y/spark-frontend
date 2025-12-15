
export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  otp: string;
}

export interface ResendOtpPayload {
  userId: string; 
}

export interface LoginPayload {
  email: string;
  password: string;
}