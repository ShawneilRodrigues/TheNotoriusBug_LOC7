'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ModeToggle from './ModeToggle';
import GradientText from './gradient-text';
import { motion } from 'framer-motion';

export default function Navbar() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout');
        localStorage.removeItem('supabase-token');
        localStorage.removeItem('supabase-refresh-token');
        router.replace('/login');
    };

    return (
        <motion.nav
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mx-20 px-6 py-3 rounded-2xl flex items-center justify-between backdrop-blur-md bg-white/10 transition-all duration-300 hover:bg-white/20"
        >
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
                {['Home', 'Features', 'Contact Us', 'Login'].map((item, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Link
                            href={item === 'Home' ? '/' : `#${item.toLowerCase().replace(' ', '')}`}
                            className="text-white hover:text-blue-500 transition duration-300"
                        >
                            {item}
                        </Link>
                    </motion.div>
                ))}
            </div>
        </motion.nav>
    );
}
