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

    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    // Route Categories
    const isLandingPage = pathname === '/';
    const isAuthRoute =
        pathname.startsWith('/login') ||
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

    /* =====================================================
        TRUE GUEST (No tokens at all)
    ===================================================== */
    if (!accessToken && !refreshToken) {
        if (isAdminRoute) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        if (isUserRoute || isProfileCompleteRoute) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        return NextResponse.next();
    }

    /* =====================================================
        ACCESS TOKEN EXISTS → TRY VERIFY
    ===================================================== */
    if (accessToken) {
        try {
            const { payload } = await jwtVerify(accessToken, JWT_SECRET);

            const role = payload.role as string;
            const isProfileCompleted = payload.isProfileCompleted as boolean;
            const isInterestsSelected = payload.isInterestsSelected as boolean;
            const isLocationCompleted = payload.isLocationCompleted as boolean;

            /* ---------------- Profile Jail Logic ---------------- */

            if (!isProfileCompleted) {
                if (isProfileCompleteRoute || isLandingPage || isAuthRoute) {
                    return NextResponse.next();
                }
                return NextResponse.redirect(new URL('/complete-profile', request.url));
            }

            if (isProfileCompleteRoute && isProfileCompleted) {
                return NextResponse.redirect(new URL('/interests', request.url));
            }

            if (!isInterestsSelected) {
                if (isInterestsRoute || isLandingPage || isAuthRoute) {
                    return NextResponse.next();
                }
                return NextResponse.redirect(new URL('/interests', request.url));
            }

            if (isInterestsRoute && isInterestsSelected) {
                return NextResponse.redirect(new URL('/location', request.url));
            }

            if (!isLocationCompleted) {
                if (isLocationRoute || isLandingPage || isAuthRoute) {
                    return NextResponse.next();
                }
                return NextResponse.redirect(new URL('/location', request.url));
            }

            if (isLocationRoute && isLocationCompleted) {
                return NextResponse.redirect(new URL('/user/home', request.url));
            }

            /* ---------------- Authenticated Restrictions ---------------- */

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

        } catch {
            return NextResponse.next();
        }
    }

    /* =====================================================
       3️⃣ No access token but refresh exists
       Allow request so Axios can refresh
    ===================================================== */
    return NextResponse.next();
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

