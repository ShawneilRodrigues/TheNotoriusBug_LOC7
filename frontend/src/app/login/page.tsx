'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { parseHashTokens } from '@/utils/auth';
import ModeToggle from '@/components/ModeToggle';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const nextUrl = searchParams.get('next') || '/dashboard';

    useEffect(() => {
        const tokens = parseHashTokens(window.location.hash);

        if (tokens) {
            console.log('OAuth tokens found in URL hash, storing them...');

            // Store tokens in localStorage
            localStorage.setItem('supabase-token', tokens.accessToken);
            localStorage.setItem('supabase-refresh-token', tokens.refreshToken);

            // Store tokens in cookies via API
            fetch('/api/auth', {
                // Removed '/route' from the URL
                method: 'POST',
                body: JSON.stringify({
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            })
                .then(async (response) => {
                    if (!response.ok) {
                        throw new Error('Failed to store tokens');
                    }
                    // Remove hash and redirect user
                    window.history.replaceState(
                        {},
                        '',
                        window.location.pathname
                    );
                    router.replace(nextUrl);
                })
                .catch((error) => {
                    console.error('Error storing tokens:', error);
                });
        }
    }, [router, nextUrl]);

    const loginWithGoogle = () => {
        const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const redirectUrl = encodeURIComponent(
            window.location.origin + '/login'
        );
        window.location.href = `${baseUrl}/auth/v1/authorize?provider=google&redirect_to=${redirectUrl}`;
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <h1>Login</h1>
            <ModeToggle />
            <button
                className="bg-blue-500 px-4 py-2 text-white rounded"
                onClick={loginWithGoogle}
            >
                Login with Google
            </button>
        </div>
    );
}
