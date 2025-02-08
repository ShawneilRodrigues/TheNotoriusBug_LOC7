'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/superbaseClient';
import { parseHashTokens } from '@/utils/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const nextUrl = searchParams.get('next') || '/dashboard'; // Default redirect
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // ✅ Auto-redirect if tokens exist
    useEffect(() => {
        const checkAuth = async () => {
            const accessToken = localStorage.getItem('supabase-token') || '';
            const refreshToken =
                localStorage.getItem('supabase-refresh-token') || '';

            if (accessToken) {
                fetchUserRole(accessToken);
                return;
            }

            if (!accessToken && refreshToken) {
                try {
                    const response = await fetch('/api/auth/refresh', {
                        method: 'GET',
                        credentials: 'include',
                    });
                    if (response.ok) {
                        const data = await response.json();
                        localStorage.setItem(
                            'supabase-token',
                            data.access_token
                        );
                        fetchUserRole(data.access_token);
                        return;
                    }
                } catch (error) {
                    console.error('Error refreshing session:', error);
                }
            }

            setLoading(false);
        };

        checkAuth();
    }, [router]);

    useEffect(() => {
        const tokens = parseHashTokens(window.location.hash);

        if (tokens) {
            console.log('OAuth tokens found in URL hash, storing them...');

            // Store tokens in localStorage
            localStorage.setItem('supabase-token', tokens.accessToken);
            localStorage.setItem('supabase-refresh-token', tokens.refreshToken);

            // Store tokens in cookies via API
            fetch('/api/auth', {
                method: 'POST',
                body: JSON.stringify({
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            })
                .then(async (response) => {
                    if (!response.ok) throw new Error('Failed to store tokens');

                    // Remove hash from URL
                    window.history.replaceState(
                        {},
                        '',
                        window.location.pathname
                    );

                    // Fetch user role and redirect accordingly
                    fetchUserRole(tokens.accessToken);
                })
                .catch((error) => {
                    console.error('Error storing tokens:', error);
                });
        }
    }, [router]);

    const fetchUserRole = async (token: string) => {
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser(token);

        if (error || !user) {
            console.error('Error fetching user role:', error);
            return;
        }

        const role = user?.user_metadata?.role;
        console.log('User Role:', role);

        // Redirect based on role
        if (role === 'admin') {
            router.replace('/admin/dashboard');
        } else {
            router.replace('/employee/chat');
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            return;
        }

        console.log('Login successful:', data);
        fetchUserRole(data.session?.access_token || '');
    };

    const loginWithGoogle = () => {
        const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const redirectUrl = encodeURIComponent(
            window.location.origin + '/login'
        );
        window.location.href = `${baseUrl}/auth/v1/authorize?provider=google&redirect_to=${redirectUrl}`;
    };

    if (loading)
        return (
            <div className="flex items-center justify-center min-h-screen">
                Checking authentication...
            </div>
        );

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Log In</CardTitle>
                    <CardDescription>
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleLogin}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                        >
                            Log In
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col">
                    {error && (
                        <p className="text-red-500 text-sm mb-2">{error}</p>
                    )}

                    <div className="w-full text-center text-gray-600 my-2">
                        OR
                    </div>

                    <Button
                        className="w-full bg-red-500 text-white"
                        onClick={loginWithGoogle}
                    >
                        Sign in with Google
                    </Button>

                    <p className="text-sm text-gray-600 mt-4">
                        Don't have an account?{' '}
                        <Link
                            href="/signup"
                            className="text-blue-500 hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
