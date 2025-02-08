import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    // Get the tokens
    const accessToken = req.cookies.get('supabase-token')?.value;
    const refreshToken = req.cookies.get('supabase-refresh-token')?.value;
    const currentPath = req.nextUrl.pathname;

    console.log('Middleware - Access Token:', !!accessToken);
    console.log('Middleware - Refresh Token:', !!refreshToken);

    // If we have an access token, let them through
    if (accessToken) {
        return NextResponse.next();
    }

    // If we have a refresh token but no access token, try to refresh
    if (!accessToken && refreshToken) {
        try {
            const response = await fetch(
                `${req.nextUrl.origin}/api/auth/refresh`,
                {
                    method: 'GET',
                    headers: {
                        Cookie: `supabase-refresh-token=${refreshToken}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                const newResponse = NextResponse.next();

                // Set the new access token
                newResponse.cookies.set('supabase-token', data.access_token, {
                    httpOnly: true,
                    secure: false, // for localhost
                    path: '/',
                    sameSite: 'lax',
                    maxAge: 3600
                });

                return newResponse;
            }
        } catch (error) {
            console.error('Refresh error in middleware:', error);
        }
    }

    // If we get here, redirect to login
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('next', currentPath);
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: ['/dashboard/:path*', '/profile/:path*', '/admin/:path*'], // Only protect these routes
};
