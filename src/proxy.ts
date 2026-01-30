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

        // 4. Incomplete Profile Handler (The Jail)
        if (!isProfileCompleted) {

            if (isProfileCompleteRoute || isLandingPage || isAuthRoute) {
                return NextResponse.next();
            }

            return NextResponse.redirect(new URL('/complete-profile', request.url));
        }

        if (isProfileCompleteRoute && isProfileCompleted) {
            return NextResponse.redirect(new URL('/user/home', request.url));
        }


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
        "/reset-password",
        "/complete-profile",
        "/interests",
        "/location",
    ],
};

