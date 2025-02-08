import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/superbaseClient';
import { RefreshResponse } from '@/types/auth';

export async function GET(req: NextRequest) {
  const refreshToken = req.cookies.get('supabase-refresh-token')?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { message: 'No refresh token' },
      { status: 401 }
    );
  }

  try {
    const { data: session, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken
    });

    if (error) throw error;

    const response = NextResponse.json<RefreshResponse>({
      message: 'Token refreshed',
      access_token: session.access_token
    });

    response.cookies.set('supabase-token', session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: session.expires_in,
    });

    return response;
  } catch (error) {
    console.error('Refresh error:', error);
    return NextResponse.json(
      { message: 'Refresh failed' },
      { status: 401 }
    );
  }
}
