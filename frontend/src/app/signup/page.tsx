'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/utils/superbaseClient';

export default function SignupPage() {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(true);
    const [companyName, setCompanyName] = useState('');
    const [companyId, setCompanyId] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // ✅ Auto-redirect if already authenticated
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
        };

        const fetchUserRole = async (token: string) => {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser(token);
            if (error || !user) return;

            const role = user?.user_metadata?.role;
            router.replace(
                role === 'admin' ? '/admin/dashboard' : '/employee/chat'
            );
        };

        checkAuth();
    }, [router]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (
            !email ||
            !password ||
            (isAdmin && !companyName) ||
            (!isAdmin && !companyId)
        ) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        try {
            let companyID = companyId;

            if (isAdmin) {
                companyID = `COMP-${Math.random()
                    .toString(36)
                    .substr(2, 6)
                    .toUpperCase()}`;
            }

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        role: isAdmin ? 'admin' : 'employee',
                        companyId: companyID,
                    },
                },
            });

            if (error) throw error;

            alert(
                `Signup successful! ${
                    isAdmin ? 'Your Company ID: ' + companyID : ''
                }`
            );

            router.replace(isAdmin ? '/admin/dashboard' : '/employee/chat');
        } catch (err: any) {
            setError(err.message || 'Signup failed');
        }

        setLoading(false);
    };

    const handleOAuthSignup = async (
        provider: 'google' | 'microsoft' | 'slack'
    ) => {
        const redirectUrl = `${window.location.origin}/login`;
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo: redirectUrl },
        });

        if (error) setError(`Error logging in with ${provider}`);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                    <CardDescription>Create your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs
                        defaultValue="admin"
                        className="w-full"
                        onValueChange={(value) => setIsAdmin(value === 'admin')}
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="admin">Admin</TabsTrigger>
                            <TabsTrigger value="employee">Employee</TabsTrigger>
                        </TabsList>
                        <TabsContent value="admin">
                            <form
                                onSubmit={handleSignup}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="companyName">
                                        Company Name
                                    </Label>
                                    <Input
                                        id="companyName"
                                        placeholder="Enter company name"
                                        value={companyName}
                                        onChange={(e) =>
                                            setCompanyName(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="adminEmail">Email</Label>
                                    <Input
                                        id="adminEmail"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="adminPassword">
                                        Password
                                    </Label>
                                    <Input
                                        id="adminPassword"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loading}
                                >
                                    {loading
                                        ? 'Signing Up...'
                                        : 'Sign Up as Admin'}
                                </Button>
                            </form>
                        </TabsContent>
                        <TabsContent value="employee">
                            <form
                                onSubmit={handleSignup}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="companyId">
                                        Company ID
                                    </Label>
                                    <Input
                                        id="companyId"
                                        placeholder="Enter company ID"
                                        value={companyId}
                                        onChange={(e) =>
                                            setCompanyId(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="employeeEmail">Email</Label>
                                    <Input
                                        id="employeeEmail"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="employeePassword">
                                        Password
                                    </Label>
                                    <Input
                                        id="employeePassword"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loading}
                                >
                                    {loading
                                        ? 'Signing Up...'
                                        : 'Sign Up as Employee'}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter className="flex flex-col">
                    {error && (
                        <p className="text-red-500 text-sm mb-2">{error}</p>
                    )}

                    {!isAdmin && (
                        <>
                            <div className="w-full text-center text-gray-600 my-2">
                                OR
                            </div>
                            <Button
                                className="w-full bg-red-500"
                                onClick={() => handleOAuthSignup('google')}
                            >
                                Sign Up with Google
                            </Button>
                            <Button
                                className="w-full bg-blue-600 mt-2"
                                onClick={() => handleOAuthSignup('microsoft')}
                            >
                                Sign Up with Microsoft (Mock)
                            </Button>
                            <Button
                                className="w-full bg-gray-800 mt-2"
                                onClick={() => handleOAuthSignup('slack')}
                            >
                                Sign Up with Slack (Mock)
                            </Button>
                        </>
                    )}

                    <p className="text-sm text-gray-600 mt-4">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="text-blue-500 hover:underline"
                        >
                            Log in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
