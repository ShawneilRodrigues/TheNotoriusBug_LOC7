import { NextResponse } from 'next/server';

export async function GET() {
    const response = NextResponse.json({ message: 'Logged out' });
    response.cookies.delete('supabase-token');
    response.cookies.delete('supabase-refresh-token');
    return response;
}