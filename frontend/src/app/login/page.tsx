'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/superbaseClient';
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
import { storeUserInSupabase } from '@/app/api/storeUserInSupabase';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const nextUrl = searchParams.get('next') || '/dashboard';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // Simplified session check
    useEffect(() => {
        const checkSession = async () => {
            try {
                const {
                    data: { session },
                    error,
                } = await supabase.auth.getSession();

                if (error) throw error;

                if (session) {
                    const {
                        data: { user },
                        error: userError,
                    } = await supabase.auth.getUser();
                    if (userError) throw userError;

                    if (user) {
                        const role = user.user_metadata?.role || 'employee';
                        router.replace(
                            role === 'admin'
                                ? '/admin/dashboard'
                                : '/employee/chat'
                        );
                        return;
                    }
                }
            } catch (err) {
                console.error('Session check error:', err);
            } finally {
                setIsCheckingAuth(false);
            }
        };

        checkSession();
    }, [router]);

    // Handle login
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.session && data.user) {
                const role = data.user.user_metadata?.role || 'employee';
                const companyId = data.user.user_metadata?.company_id;

                if (!companyId) {
                    throw new Error('No company ID found in user metadata');
                }

                console.log('Storing user data after login:', {
                    id: data.user.id,
                    email: data.user.email,
                    role,
                    companyId: companyId.toString(),
                    isAdmin: role === 'admin',
                });

                // Store user data in Supabase
                const { success, error: storeError } =
                    await storeUserInSupabase({
                        id: data.user.id,
                        email: data.user.email || '',
                        role,
                        companyId: companyId.toString(),
                        isAdmin: role === 'admin',
                        name: data.user.user_metadata?.full_name,
                        phoneNumber: data.user.phone || null,
                    });

                if (!success) {
                    console.error('Failed to store user data:', storeError);
                    throw storeError;
                }

                // Set auth cookies
                const response = await fetch('/api/auth', {
                    method: 'POST',
                    body: JSON.stringify({
                        accessToken: data.session.access_token,
                        refreshToken: data.session.refresh_token,
                        userId: data.user.id,
                        userEmail: data.user.email,
                        userRole: role,
                        isAdmin: role === 'admin',
                        companyId,
                    }),
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to set authentication cookies');
                }

                router.replace(
                    role === 'admin' ? '/admin/dashboard' : '/employee/chat'
                );
            }
        } catch (err: any) {
            setError(err.message || 'Login failed');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle OAuth login
    const loginWithGoogle = async () => {
        try {
            setError('');
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/login`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });

            if (error) throw error;
        } catch (err: any) {
            setError(err.message || 'Failed to login with Google');
            console.error('Google login error:', err);
        }
    };

    if (isCheckingAuth) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

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
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button
                        type="button"
                        className="w-full bg-red-500 hover:bg-red-600 text-white"
                        onClick={loginWithGoogle}
                        disabled={loading}
                    >
                        Sign in with Google
                    </Button>
                    <Link
                        href="/signup"
                        className="text-sm text-center w-full text-gray-600 hover:text-gray-800"
                    >
                        Don't have an account? Sign up
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
