import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

/* =====================================================
   JWT CONFIGURATION
   - Used to verify access tokens
   it means in here we are doing this because we are using jose library
   and we need to encode the secret key to bytes for verification process
===================================================== */
const secret = process.env.JWT_ACCESS_SECRET;

if (!secret) {
    throw new Error('JWT_ACCESS_SECRET is not defined');
}

const JWT_SECRET = new TextEncoder().encode(secret);

/* =====================================================
   MIDDLEWARE
   - run middleware for each request to protected routes
   - Redirects users to appropriate pages
===================================================== */

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Get the tokens from cookies
    const token = request.cookies.get('accessToken')?.value;

    // 2.  Route Categories 
    const isLandingPage = pathname === '/';
    const isAuthRoute = pathname.startsWith('/login') ||
        pathname.startsWith('/signup') ||
        pathname.startsWith('/forgot-password') ||
        pathname.startsWith('/verify-otp') ||
        pathname.startsWith('/reset-password') ||
        pathname === '/admin/login';

    const isUserRoute = pathname.startsWith('/user');
    const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';
    const isProfileCompleteRoute = pathname.startsWith('/complete-profile');
    const isInterestsRoute = pathname.startsWith('/interests');
    const isLocationRoute = pathname.startsWith('/location');

    // 3.  Guest Users (No Token)
    if (!token) {
        if (isAdminRoute) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
        if (isUserRoute || isProfileCompleteRoute) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.next();
    }

    try {

        // token verification && extract payload
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const role = payload.role as string;
        const isProfileCompleted = payload.isProfileCompleted as boolean;
        const isInterestsSelected = payload.isInterestsSelected as boolean;
        const isLocationCompleted = payload.isLocationCompleted as boolean;

        // 4. Incomplete Profile Handler (The Jail)
        if (!isProfileCompleted) {
            // Allow access to profile completion route and public routes
            if (isProfileCompleteRoute || isLandingPage || isAuthRoute) {
                return NextResponse.next();
            }
            // Redirect to complete profile if not completed
            return NextResponse.redirect(new URL('/complete-profile', request.url));
        }

        // 5. Profile completed but trying to access profile completion route
        if (isProfileCompleteRoute && isProfileCompleted) {
            return NextResponse.redirect(new URL('/interests', request.url));
        }

        // 6. Interests Selection Handler
        if (!isInterestsSelected) {
            // Allow access to interests route and public routes
            if (isInterestsRoute || isLandingPage || isAuthRoute) {
                return NextResponse.next();
            }
            // Redirect to interests if not selected
            return NextResponse.redirect(new URL('/interests', request.url));
        }

        // 7. Interests selected but trying to access interests route
        if (isInterestsRoute && isInterestsSelected) {
            return NextResponse.redirect(new URL('/location', request.url));
        }

        // 8. Location Selection Handler
        if (!isLocationCompleted) {
            // Allow access to location route and public routes
            if (isLocationRoute || isLandingPage || isAuthRoute) {
                return NextResponse.next();
            }
            // Redirect to location if not selected
            return NextResponse.redirect(new URL('/location', request.url));
        }

        // 9. Location selected but trying to access location route
        if (isLocationRoute && isLocationCompleted) {
            return NextResponse.redirect(new URL('/user/home', request.url));
        }

        // 10. Authenticated users trying to access landing/auth pages
        if (isLandingPage || isAuthRoute) {
            if (role === 'admin') {
                return NextResponse.redirect(new URL('/admin', request.url));
            }
            return NextResponse.redirect(new URL('/user/home', request.url));
        }

        if (isAdminRoute && role !== 'admin') {
            return NextResponse.redirect(new URL('/user/home', request.url));
        }

        return NextResponse.next();

    } catch (error) {
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
        "/interests",
        "/location",
    ],
};

