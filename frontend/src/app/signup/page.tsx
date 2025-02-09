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
import { storeUserInSupabase } from '@/app/api/storeUserInSupabase';

const employeeRoles = [
    'HR Manager',
    'Employee',
    'Manager',
    'Team Lead',
    'Department Head',
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
            try {
                const {
                    data: { session },
                    error: sessionError,
                } = await supabase.auth.getSession();

                if (sessionError) {
                    console.error('Session error:', sessionError);
                    return;
                }

                if (session?.access_token) {
                    const {
                        data: { user },
                        error: userError,
                    } = await supabase.auth.getUser(session.access_token);

                    if (userError) {
                        console.error('User fetch error:', userError);
                        return;
                    }

                    if (user) {
                        router.replace(
                            user.user_metadata?.role === 'admin'
                                ? '/admin/dashboard'
                                : '/employee/chat'
                        );
                    }
                }
            } catch (error) {
                console.error('Auth check error:', error);
            }
        };

        checkAuth();
    }, [router]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let finalCompanyId = companyId;
            if (isAdmin) {
                const { data: companyData, error: companyError } =
                    await supabase
                        .from('company')
                        .insert([{ name: companyName }])
                        .select()
                        .single();

                if (companyError) throw companyError;
                finalCompanyId = companyData.id.toString();
            }

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        role: isAdmin ? 'admin' : role,
                        company_id: finalCompanyId,
                        is_admin: isAdmin,
                    },
                },
            });

            if (error) throw error;
            if (!data.user) throw new Error('Signup failed');

            // Store user data in Supabase
            const { success, error: storeError } = await storeUserInSupabase({
                id: data.user.id,
                email,
                role: isAdmin ? 'admin' : role,
                companyId: finalCompanyId,
                isAdmin,
            });

            if (!success) throw storeError;

            // Set auth cookies
            const response = await fetch('/api/auth', {
                method: 'POST',
                body: JSON.stringify({
                    accessToken: data.session?.access_token,
                    refreshToken: data.session?.refresh_token,
                    userId: data.user.id,
                    userEmail: email,
                    userRole: isAdmin ? 'admin' : role,
                    isAdmin,
                    companyId: finalCompanyId,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to set authentication cookies');
            }

            alert(
                isAdmin
                    ? `Signup successful! Your Company ID: ${finalCompanyId}`
                    : 'Signup successful!'
            );

            router.replace(isAdmin ? '/admin/dashboard' : '/employee/chat');
        } catch (err: any) {
            setError(err.message || 'Signup failed');
            console.error('Signup error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOAuthSignup = async (provider: 'google') => {
        if (!isAdmin && !companyId) {
            setError('Please enter a company ID before signing up.');
            return;
        }

        // Store signup details for OAuth callback
        localStorage.setItem(
            'pending_signup',
            JSON.stringify({
                isAdmin,
                companyId: isAdmin ? '' : companyId,
                companyName: isAdmin ? companyName : '',
                role: isAdmin ? 'admin' : role,
            })
        );

        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/login`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        });

        if (error) setError(`Error signing up with ${provider}`);
    };

    const renderAdminForm = () => (
        <form
            onSubmit={handleSignup}
            className="space-y-4"
        >
            <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                    id="companyName"
                    placeholder="Enter company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="adminEmail">Email</Label>
                <Input
                    id="adminEmail"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="adminPassword">Password</Label>
                <Input
                    id="adminPassword"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <Button
                type="submit"
                className="w-full"
                disabled={loading}
            >
                {loading ? 'Signing Up...' : 'Sign Up as Admin'}
            </Button>
        </form>
    );

    const renderEmployeeForm = () => (
        <form
            onSubmit={handleSignup}
            className="space-y-4"
        >
            <div className="space-y-2">
                <Label htmlFor="companyId">Company ID</Label>
                <Input
                    id="companyId"
                    placeholder="Enter company ID"
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
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
            <div className="space-y-2">
                <Label htmlFor="employeePassword">Password</Label>
                <Input
                    id="employeePassword"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <Button
                type="submit"
                className="w-full"
                disabled={loading}
            >
                {loading ? 'Signing Up...' : 'Sign Up as Employee'}
            </Button>
        </form>
    );

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
                            {renderAdminForm()}
                        </TabsContent>
                        <TabsContent value="employee">
                            {renderEmployeeForm()}
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
