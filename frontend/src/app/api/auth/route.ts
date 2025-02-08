import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { accessToken, refreshToken } = await req.json();

    if (!accessToken || !refreshToken) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const response = NextResponse.json({ message: 'Authenticated' });

    // Set cookies for localhost
    response.cookies.set('supabase-token', accessToken, {
        httpOnly: true,
        secure: false, // Set to false for localhost
        path: '/',
        sameSite: 'lax',
        maxAge: 3600 // 1 hour
    });

    response.cookies.set('supabase-refresh-token', refreshToken, {
        httpOnly: true,
        secure: false, // Set to false for localhost
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
}