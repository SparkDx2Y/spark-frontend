import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

/* =====================================================
   JWT CONFIGURATION
   - Used to verify access tokens
   it means in here we are doing this because we are using jose library
   and we need to encode the secret key to bytes for verification process
===================================================== */
const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_ACCESS_SECRET || 'access_secret'
);

/* =====================================================
   MIDDLEWARE
   - run middleware for each request to protected routes
   - Redirects users to appropriate pages
===================================================== */

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Get the tokens from cookies
    const token = request.cookies.get('accessToken')?.value;
    const tempToken = request.cookies.get('temp_token')?.value;

    // 2.  Route Categories - it helps to identify the type of route 
    const isLandingPage = pathname === '/';
    const isAuthRoute = pathname.startsWith('/login') ||
        pathname.startsWith('/signup') ||
        pathname.startsWith('/forgot-password') ||
        pathname.startsWith('/verify-otp') ||
        pathname.startsWith('/reset-password') ||
        pathname === '/admin/login'; // Added admin login

    const isUserRoute = pathname.startsWith('/user');
    const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login'; // Exclude login from admin protection
    const isProfileCompleteRoute = pathname.startsWith('/complete-profile');

    // 3.  Guest Users (No Tokens at all)
    if (!token && !tempToken) {
        if (isAdminRoute) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
        if (isUserRoute || isProfileCompleteRoute) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.next();
    }

    /* =====================================================
       TEMPORARY USER (ONBOARDING STATE)
     - User verified OTP but profile not completed
     - Allow only onboarding-related routes
    ===================================================== */
    if (!token && tempToken) {

        // Allow access to OTP verification and Complete Profile
        if (pathname.startsWith('/verify-otp') || isProfileCompleteRoute) {
            return NextResponse.next();
        }
        // If they try to go anywhere else (like /user or dashboard), force them to their current onboarding step
        if (isUserRoute || isAdminRoute) {
            return NextResponse.redirect(new URL('/complete-profile', request.url));
        }
        return NextResponse.next();
    }

    /* =====================================================
       LOGGED IN USERS (Verify accessToken)
    ===================================================== */
    if (!token) {
        const redirectUrl = isAdminRoute ? '/admin/login' : '/login';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    try {

        // token verification && extract payload && extracts role & profile completion status
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const role = payload.role as string;
        const isProfileCompleted = payload.isProfileCompleted as boolean;

        //  If already logged in, don't allow access to Landing Page or Auth Pages
        if (isLandingPage || isAuthRoute) {

            // If profile is incomplete, redirect to complete profile
            if (!isProfileCompleted) {
                return NextResponse.redirect(new URL('/complete-profile', request.url));
            }

            // If profile is complete, redirect based on role
            if (role === 'admin') {
                return NextResponse.redirect(new URL('/admin', request.url));
            }

            return NextResponse.redirect(new URL('/user/home', request.url));
        }

        //  Protect Admin Routes
        if (isAdminRoute && role !== 'admin') {
            return NextResponse.redirect(new URL('/user/home', request.url));
        }

        //  Protect User Routes based on Profile Completion
        if (isUserRoute && !isProfileCompleted) {
            return NextResponse.redirect(new URL('/complete-profile', request.url));
        }

        // Prevent going back to Complete Profile if already done
        if (isProfileCompleteRoute && isProfileCompleted) {
            return NextResponse.redirect(new URL('/user/home', request.url));
        }

        return NextResponse.next();
    } catch (error) {
        // If token is invalid or expired
        console.error('Middleware JWT Error:', error);

        // Clear cookies and redirect to login if token is corrupt
        const redirectUrl = isAdminRoute ? '/admin/login' : '/login';
        const response = NextResponse.redirect(new URL(redirectUrl, request.url));
        response.cookies.delete('accessToken');
        response.cookies.delete('refreshToken');
        return response;
    }
}

/* =====================================================
   CONFIGURATION
   - Define which routes to apply middleware to
===================================================== */
export const config = {
    matcher: [
        "/",
        "/user/:path*",
        "/admin/:path*",
        "/login",
        "/signup",
        "/forgot-password",
        "/verify-otp",
        "/reset-password",
        "/complete-profile",
    ],
};

