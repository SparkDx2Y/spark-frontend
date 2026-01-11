import { api } from "@/lib/axios";

import { AUTH_ENDPOINTS } from "@/constants/api";
import { ForgotPasswordPayload, ForgotPasswordVerifyOtpPayload, LoginPayload, ResetPasswordPayload, SignupPayload, VerifyOtpPayload } from "@/types/auth/payload";
import { ForgotPasswordResponse, ForgotPasswordVerifyOtpResponse, LoginResponse, ResendOtpResponse, ResetPasswordResponse, SignupResponse, VerifyOtpResponse } from "@/types/auth/response";


// -----------------------------
// SIGNUP
// -----------------------------


export const signup = async (data: SignupPayload): Promise<SignupResponse> => {
  const response = await api.post<SignupResponse>(AUTH_ENDPOINTS.SIGNUP, data)
  return response.data
}


// -----------------------------
// VERIFY OTP
// -----------------------------


export const verifyOtp = async (data: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
  const response = await api.post<VerifyOtpResponse>(AUTH_ENDPOINTS.VERIFY_OTP, data)
  return response.data
}


// -----------------------------
// RESEND OTP
// -----------------------------

export const resendOtp = async (): Promise<ResendOtpResponse> => {
  const response = await api.post<ResendOtpResponse>(AUTH_ENDPOINTS.RESEND_OTP);
  return response.data;
};


// -----------------------------
// LOGIN
// -----------------------------

export const login = async (data: LoginPayload): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, data);
  return response.data;
};

export const googleLogin = async (token: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(AUTH_ENDPOINTS.GOOGLE_LOGIN, { token });
  return response.data;
};



// -----------------------------
// FORGOT PASSWORD
// -----------------------------

export const forgotPassword = async (data: ForgotPasswordPayload): Promise<ForgotPasswordResponse> => {
  const response = await api.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, data);
  return response.data
}

// -----------------------------
// Verify FORGOT PASSWORD
// -----------------------------

export const verifyForgotPasswordOtp = async (data: ForgotPasswordVerifyOtpPayload): Promise<ForgotPasswordVerifyOtpResponse> => {
  const response = await api.post(AUTH_ENDPOINTS.FORGOT_PASSWORD_VERIFY_OTP, data)
  return response.data
}

// -----------------------------
// Reset Password
// -----------------------------

export const resetPassword = async (data: ResetPasswordPayload): Promise<ResetPasswordResponse> => {
  const response = await api.post(AUTH_ENDPOINTS.RESET_PASSWORD, data)
  return response.data
}

// -----------------------------
// Logout
// -----------------------------

export const logout = async (): Promise<{ message: string }> => {
  const response = await api.post(AUTH_ENDPOINTS.LOGOUT)
  return response.data
}

// -----------------------------
// Get Current User
// -----------------------------

export const getCurrentUser = async (): Promise<Omit<LoginResponse, 'message'>> => {
  const response = await api.get(AUTH_ENDPOINTS.ME);
  return response.data;
};