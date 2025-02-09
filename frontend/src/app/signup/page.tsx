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

const employeeRoles = [
    'HR',
    'Marketing',
    'Intern',
    'Sales',
    'Finance',
    'Engineering',
];

export default function SignupPage() {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(true);
    const [companyName, setCompanyName] = useState('');
    const [companyId, setCompanyId] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(employeeRoles[0]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const accessToken = localStorage.getItem('supabase-token') || '';
            if (accessToken) fetchUserRole(accessToken);
        };

        const fetchUserRole = async (token: string) => {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser(token);
            if (error || !user) return;
            router.replace(
                user.user_metadata?.role === 'admin'
                    ? '/admin/dashboard'
                    : '/employee/chat'
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
            let finalCompanyId = companyId;
            if (isAdmin) {
                finalCompanyId = `COMP-${Math.random()
                    .toString(36)
                    .substr(2, 6)
                    .toUpperCase()}`;
            }

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        role: isAdmin ? 'admin' : role,
                        companyId: finalCompanyId,
                        isAdmin: isAdmin,
                    },
                },
            });

            if (error) throw error;
            if (!data.user) throw new Error('Signup failed');

            // Store user data in cookies
            fetch('/api/auth', {
                method: 'POST',
                body: JSON.stringify({
                    accessToken: data.session?.access_token,
                    refreshToken: data.session?.refresh_token,
                    userId: data.user.id,
                    userEmail: data.user.email,
                    userRole: isAdmin ? 'admin' : role,
                    isAdmin: isAdmin,
                    companyId: finalCompanyId,
                }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            })
                .then(() => {
                    alert(
                        `Signup successful! ${
                            isAdmin ? 'Your Company ID: ' + finalCompanyId : ''
                        }`
                    );
                    router.replace(
                        isAdmin ? '/admin/dashboard' : '/employee/chat'
                    );
                })
                .catch((error) =>
                    console.error('Error storing tokens:', error)
                );
        } catch (err: any) {
            setError(err.message || 'Signup failed');
        }

        setLoading(false);
    };

    const handleOAuthSignup = async (
        provider: 'google' | 'microsoft' | 'slack'
    ) => {
        if (!companyId || !role) {
            setError(
                'Please enter a company ID and select a role before signing up.'
            );
            return;
        }

        // Store values locally before redirecting
        localStorage.setItem('pending-company-id', companyId);
        localStorage.setItem('pending-user-role', role);

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
                                    <Label htmlFor="role">Role</Label>
                                    <select
                                        id="role"
                                        value={role}
                                        onChange={(e) =>
                                            setRole(e.target.value)
                                        }
                                        className="w-full border rounded-md p-2"
                                    >
                                        {employeeRoles.map((role) => (
                                            <option
                                                key={role}
                                                value={role}
                                            >
                                                {role}
                                            </option>
                                        ))}
                                    </select>
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
                    <Button
                        className="w-full bg-red-500 text-white"
                        onClick={() => handleOAuthSignup('google')}
                    >
                        Sign Up with Google
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
