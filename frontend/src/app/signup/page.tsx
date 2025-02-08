'use client';

import { useState } from 'react';
import Link from 'next/link';
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

export default function SignupPage() {
    const [isAdmin, setIsAdmin] = useState(true);
    const [companyName, setCompanyName] = useState('');
    const [companyId, setCompanyId] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically call your API to handle signup
        console.log('Signup:', {
            isAdmin,
            companyName,
            companyId,
            email,
            password,
        });
        // For demo purposes, let's just set an error if fields are empty
        if (
            !email ||
            !password ||
            (isAdmin && !companyName) ||
            (!isAdmin && !companyId)
        ) {
            setError('Please fill in all fields');
        } else {
            setError('');
            // Redirect or show success message
        }
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
                                >
                                    Sign Up as Admin
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
                                >
                                    Sign Up as Employee
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter className="flex flex-col">
                    {error && (
                        <p className="text-red-500 text-sm mb-2">{error}</p>
                    )}
                    <p className="text-sm text-gray-600">
                        Already have an account?{''}
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
