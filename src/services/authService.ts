import { api } from "@/lib/axios";

import { AUTH_ENDPOINTS } from "@/constants/api";
import { LoginPayload, ResendOtpPayload, SignupPayload, VerifyOtpPayload } from "@/types/auth/payload";
import { LoginResponse, ResendOtpResponse, SignupResponse, VerifyOtpResponse } from "@/types/auth/response";


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

export const resendOtp = async (data: ResendOtpPayload): Promise<ResendOtpResponse> => {
  const response = await api.post<ResendOtpResponse>(AUTH_ENDPOINTS.RESEND_OTP, data);
  return response.data;
};


// -----------------------------
// LOGIN
// -----------------------------

export const login = async (data: LoginPayload): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, data);
  return response.data;
};
