
export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  otp: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  role: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordVerifyOtpPayload {
  otp: string;
}

export interface ResetPasswordPayload {
  newPassword: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}
