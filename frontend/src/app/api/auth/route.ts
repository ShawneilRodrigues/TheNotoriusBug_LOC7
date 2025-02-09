import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { accessToken, refreshToken, userId, userEmail, userRole, isAdmin, companyId } = await req.json();

    if (!accessToken || !refreshToken || !userId || !userEmail) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Retrieve from localStorage if missing (OAuth users)
    const storedCompanyId = req.cookies.get('pending-company-id')?.value;
    const storedUserRole = req.cookies.get('pending-user-role')?.value;

    const finalCompanyId = companyId || storedCompanyId || 'UNKNOWN_COMPANY';
    const finalUserRole = userRole || storedUserRole || 'employee';
    const finalIsAdmin = isAdmin ?? false;

    const response = NextResponse.json({ message: 'Authenticated' });

    // Store tokens
    response.cookies.set('supabase-token', accessToken, { httpOnly: true, secure: false, path: '/', sameSite: 'lax', maxAge: 3600 });
    response.cookies.set('supabase-refresh-token', refreshToken, { httpOnly: true, secure: false, path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 });

    // Store user details
    response.cookies.set('user-id', userId, { httpOnly: true, secure: false, path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 });
    response.cookies.set('user-email', userEmail, { httpOnly: true, secure: false, path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 });

    response.cookies.set('user-role', finalUserRole, { httpOnly: true, secure: false, path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 });
    response.cookies.set('company-id', finalCompanyId, { httpOnly: true, secure: false, path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 });
    response.cookies.set('is-admin', finalIsAdmin.toString(), { httpOnly: true, secure: false, path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 });

    return response;
}
