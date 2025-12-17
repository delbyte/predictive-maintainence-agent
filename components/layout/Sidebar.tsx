'use client';

import {
    LayoutDashboard,
    Activity,
    Bell,
    Settings,
    LogOut,
    BrainCircuit,
    Wrench,
    FileText,
    ChevronRight,
    Loader2
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
    const [isSigningOut, setIsSigningOut] = useState(false);

    const handleSignOut = async () => {
        setIsSigningOut(true);
        await signOut();
    };

    const navItems = [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'analysis', label: 'Analysis Engine', icon: BrainCircuit },
        { id: 'anomalies', label: 'Anomaly Reports', icon: Activity },
        { id: 'schedule', label: 'Maintenance', icon: Wrench },
        { id: 'notifications', label: 'System Logs', icon: FileText },
    ];

    return (
        <div className="w-64 h-screen bg-surface border-r border-border flex flex-col flex-shrink-0">
            {/* Minimal Header */}
            <div className="h-14 flex items-center px-6 border-b border-border">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary flex items-center justify-center">
                        <Activity className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-bold tracking-tight text-white">PREDICTIVE.AI</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
                <div className="text-[10px] font-bold text-foreground-dim uppercase tracking-wider mb-2 px-2">Module Access</div>
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className={cn(
                            "w-full flex items-center justify-between px-3 py-2 text-sm font-medium transition-colors group rounded-sm",
                            currentView === item.id
                                ? "bg-surface-hover text-white border-l-2 border-primary"
                                : "text-foreground-muted hover:text-foreground hover:bg-surface-hover border-l-2 border-transparent"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon className={cn("w-4 h-4", currentView === item.id ? "text-primary" : "text-foreground-dim group-hover:text-foreground")} />
                            {item.label}
                        </div>
                        {currentView === item.id && <ChevronRight className="w-3 h-3 text-primary" />}
                    </button>
                ))}
            </nav>

            {/* User Footprint */}
            <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3 px-2 mb-4">
                    <div className="w-8 h-8 bg-surface-hover border border-border flex items-center justify-center text-xs font-bold text-foreground">
                        {user?.email?.[0].toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-xs font-medium text-foreground truncate w-32">{user?.email}</p>
                        <p className="text-[10px] text-foreground-dim">Administrator</p>
                    </div>
                </div>

                <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium border border-border hover:bg-surface-hover text-foreground-muted hover:text-foreground transition-colors"
                >
                    {isSigningOut ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
                    {isSigningOut ? 'Terminating...' : 'Sign Out'}
                </button>
            </div>
        </div>
    );
}
