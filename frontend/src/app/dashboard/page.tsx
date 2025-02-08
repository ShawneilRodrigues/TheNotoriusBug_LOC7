'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<{ email: string } | null>(null);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                // First check if we have tokens
                const accessToken = localStorage.getItem('supabase-token');
                if (!accessToken) {
                    throw new Error('No access token');
                }

                const response = await fetch('/api/auth/verify', {
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Verification failed');
                }

                const data = await response.json();
                setUserData(data.user);
                setLoading(false);
            } catch (error) {
                console.error('Auth error:', error);
                router.replace('/login');
            }
        };

        verifyAuth();
    }, [router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            {userData && (
                <div>
                    <p>Welcome, {userData.email}</p>
                    {/* Add more dashboard content here */}
                </div>
            )}
        </div>
    );
}
