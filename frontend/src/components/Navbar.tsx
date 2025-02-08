'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ModeToggle from './ModeToggle';

export default function Navbar() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout');
        localStorage.removeItem('supabase-token');
        localStorage.removeItem('supabase-refresh-token');
        router.replace('/login');
    };

    return (
        <nav className="mx-20 px-4 py-2 rounded-md flex items-center justify-between">
            <div className="text-3xl font-bold text-gray-800">
                AISupportAgent
            </div>
            <div className="w-1/3 p-3 rounded-sm flex justify-between items-center gap-5">
                <Link
                    href="/"
                    className="text-gray-800 hover:text-gray-800"
                >
                    Home
                </Link>
                <Link
                    scroll
                    href="#features"
                    className="text-gray-800 hover:text-gray-800"
                >
                    Features
                </Link>
                <Link
                    href="#contact"
                    className="text-gray-800 hover:text-gray-800"
                >
                    Contact Us
                </Link>
                <Link
                    href="/login"
                    className="text-gray-800 hover:text-gray-800"
                >
                    Login
                </Link>
                <ModeToggle />
            </div>
        </nav>
    );
}
