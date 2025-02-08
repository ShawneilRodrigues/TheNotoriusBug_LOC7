'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ModeToggle from './ModeToggle';
import GradientText from './gradient-text';

export default function Navbar() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout');
        localStorage.removeItem('supabase-token');
        localStorage.removeItem('supabase-refresh-token');
        router.replace('/login');
    };

    return (
        <nav className="mx-20 px-6 rounded-2xl flex items-center justify-between backdrop-blur-md bg-white/10">
            <div className="text-3xl font-bold text-white">
                <GradientText
                    colors={[
                        '#40ffaa',
                        '#4079ff',
                        '#40ffaa',
                        '#4079ff',
                        '#40ffaa',
                    ]}
                    animationSpeed={3}
                    showBorder={false}
                >
                    AISupportAgent
                </GradientText>
            </div>
            <div className="w-1/3 p-3 rounded-sm flex justify-between items-center gap-5">
                <Link
                    href="/"
                    className="text-white hover:text-gray-300 transition duration-200"
                >
                    Home
                </Link>
                <Link
                    href="#features"
                    className="text-white hover:text-gray-300 transition duration-200"
                >
                    Features
                </Link>
                <Link
                    href="#contact"
                    className="text-white hover:text-gray-300 transition duration-200"
                >
                    Contact Us
                </Link>
                <Link
                    href="/login"
                    className="text-white hover:text-gray-300 transition duration-200"
                >
                    Login
                </Link>
            </div>
        </nav>
    );
}
