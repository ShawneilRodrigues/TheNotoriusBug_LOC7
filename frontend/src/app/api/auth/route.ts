import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            accessToken,
            refreshToken,
            userId,
            userEmail,
            userRole,
            isAdmin,
            companyId,
        } = body;

        const response = NextResponse.json({ message: 'Authentication successful' }, { status: 200 });

        // Set cookies with appropriate settings for local development
        response.cookies.set('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });
        response.cookies.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });
        response.cookies.set('user', JSON.stringify({
            id: userId,
            email: userEmail,
            role: userRole,
            isAdmin,
            companyId,
        }), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json(
            { message: 'Authentication failed' },
            { status: 500 }
        );
    }
}
