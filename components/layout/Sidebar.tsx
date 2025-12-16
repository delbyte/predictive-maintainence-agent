'use client';

import {
    LayoutDashboard,
    Activity,
    Bell,
    Settings,
    LogOut,
    BrainCircuit,
    Wrench,
    FileText
} from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface SidebarProps {
    onNavigate: (view: string) => void;
    currentView: string;
}

export default function Sidebar({ onNavigate, currentView }: SidebarProps) {
    const { signOut, user } = useAuth();

    const navItems = [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'analysis', label: 'Analysis Engine', icon: BrainCircuit },
        { id: 'anomalies', label: 'Anomaly Reports', icon: Activity },
        { id: 'schedule', label: 'Maintenance', icon: Wrench },
        { id: 'notifications', label: 'System Logs', icon: FileText },
    ];

    return (
        <div className="w-64 h-screen bg-[#09090b] border-r border-[#27272a] flex flex-col flex-shrink-0">
            {/* Branding */}
            <div className="p-6 border-b border-[#27272a]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-white tracking-wide">PREDICTIVE<span className="text-primary">.AI</span></h1>
                        <p className="text-[10px] text-zinc-500 font-mono">V.2.0.0-PRO</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3 px-2">Apps</div>
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                            currentView === item.id
                                ? "bg-[#27272a] text-white shadow-sm"
                                : "text-zinc-400 hover:text-white hover:bg-[#27272a]/50"
                        )}
                    >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-[#27272a] space-y-2">
                <div className="px-3 py-2 rounded-md bg-[#18181b] border border-[#27272a]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                            <span className="text-xs font-bold text-zinc-300">
                                {user?.email?.[0].toUpperCase()}
                            </span>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-medium text-zinc-200 truncate w-32">{user?.email}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] text-zinc-500 uppercase">Connected</span>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-500 hover:text-red-400 hover:bg-red-950/20 rounded-md transition-colors"
                >
                    <LogOut className="w-3.5 h-3.5" />
                    Terminate Session
                </button>
            </div>
        </div>
    );
}
