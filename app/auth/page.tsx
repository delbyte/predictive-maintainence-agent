'use client';

import SignInForm from '@/components/auth/SignInForm';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden font-sans">

            {/* Background Ambience */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-20" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <Link href="/" className="absolute -top-12 left-0 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <div className="bg-[#09090b] border border-white/10 p-1 rounded-none shadow-2xl shadow-indigo-500/10">
                    <div className="p-8 border border-white/5 bg-[#0c0c0e]">
                        <div className="mb-8 text-center">
                            <div className="w-12 h-12 bg-indigo-900/20 border border-indigo-500/20 mx-auto flex items-center justify-center mb-4">
                                <ShieldCheck className="w-6 h-6 text-indigo-500" />
                            </div>
                            <h1 className="text-xl font-bold text-white">Secure Access</h1>
                            <p className="text-sm text-zinc-500 mt-2">Enter credentials to access command center</p>
                        </div>
                        <SignInForm />
                    </div>
                </div>

                <div className="mt-8 text-center text-xs text-zinc-600">
                    <p>Protected by quantum-resistant encryption.</p>
                    <p className="mt-1">Unauthorized access attempts will be logged.</p>
                </div>
            </div>
        </div>
    );
}
