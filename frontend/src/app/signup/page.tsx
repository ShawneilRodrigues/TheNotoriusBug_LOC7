'use client';

import { useState } from 'react';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();
        if (!response.ok) {
            setMessage(data.message);
        } else {
            setMessage('Signup successful! Check your email for confirmation.');
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
            <form
                onSubmit={handleSignup}
                className="space-y-4"
            >
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 w-full"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 w-full"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-500 px-4 py-2 text-white rounded"
                >
                    Sign Up
                </button>
            </form>
            {message && <p className="mt-2 text-red-500">{message}</p>}
        </div>
    );
}
