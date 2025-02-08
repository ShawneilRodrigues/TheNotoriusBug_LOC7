'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout');
        localStorage.removeItem('supabase-token');
        localStorage.removeItem('supabase-refresh-token');
        router.replace('/login');
    };

    return (
        <nav className="flex justify-between items-center p-4 bg-gray-100">
            <div className="flex gap-4">
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/profile">Profile</Link>
            </div>
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded"
            >
                Logout
            </button>
        </nav>
    );
}
