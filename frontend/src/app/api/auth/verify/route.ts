// src/app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/superbaseClient';

export async function GET(req: NextRequest) {
    try {
        const accessToken = req.cookies.get('supabase-token')?.value;
        const refreshToken = req.cookies.get('supabase-refresh-token')?.value;

        if (!accessToken) {
            console.log('No access token found in cookies');
            return NextResponse.json(
                { message: 'No access token' },
                { status: 401 }
            );
        }

        // First set the session
        const { data: { session }, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
        });

        if (sessionError) {
            console.log('Session error:', sessionError);
            return NextResponse.json(
                { message: 'Invalid session' },
                { status: 401 }
            );
        }

        // Then get the user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.log('User error:', userError);
            return NextResponse.json(
                { message: 'Invalid user' },
                { status: 401 }
            );
        }

        console.log('User verified successfully');
        return NextResponse.json({
            message: 'Valid token',
            user
        });
    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json(
            { message: 'Invalid token' },
            { status: 401 }
        );
    }
}