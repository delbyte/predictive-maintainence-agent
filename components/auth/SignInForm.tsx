'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/firebase/auth';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight } from 'lucide-react';

export default function SignInForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await signIn(email, password);

        if (result.success) {
            router.push('/dashboard');
        } else {
            setError('Invalid credentials. Access denied.');
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                    Operator ID
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#050505] border border-[#27272a] text-white px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-[#0a0a0c] transition-all placeholder:text-zinc-700"
                    placeholder="name@enterprise.com"
                    required
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                    Security Key
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#050505] border border-[#27272a] text-white px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-[#0a0a0c] transition-all placeholder:text-zinc-700"
                    placeholder="••••••••"
                    required
                />
            </div>

            {error && (
                <div className="p-3 bg-red-950/20 border border-red-900/50 text-red-400 text-xs font-mono">
                    ERROR: {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide mt-2"
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <>
                        Authenticate <ArrowRight className="w-4 h-4" />
                    </>
                )}
            </button>

            <div className="text-center pt-2">
                <a href="#" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Recover Access Credentials</a>
            </div>
        </form>
    );
}
