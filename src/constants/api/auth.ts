export const AUTH_ENDPOINTS = {

    SIGNUP: "/auth/signup",
    VERIFY_OTP: "/auth/verify-otp",
    RESEND_OTP: "/auth/resend-otp",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot-password",
    FORGOT_PASSWORD_VERIFY_OTP: "/auth/forgot-password/verify-otp",
    FORGOT_PASSWORD_RESEND_OTP: "/auth/forgot-password/resend-otp",
    RESET_PASSWORD: "/auth/reset-password",
    ME: "/auth/me",
    GOOGLE_LOGIN: "/auth/google-login",
} as const;