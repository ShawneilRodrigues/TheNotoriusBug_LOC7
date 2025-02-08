import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/superbaseClient';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
            return NextResponse.json({ message: error.message }, { status: 400 });
        }

        return NextResponse.json({ message: 'User registered successfully', data });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
