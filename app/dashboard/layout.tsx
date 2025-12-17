'use client';

import Sidebar from '@/components/layout/Sidebar';
import { AnalysisProvider } from '@/lib/context/analysis-context';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) router.push('/');
    }, [user, loading, router]);

    if (loading) return <div className="h-screen w-screen bg-background flex items-center justify-center text-foreground-muted font-mono text-sm tracking-widest uppercase"><Loader2 className="animate-spin w-4 h-4 mr-3 text-primary" /> Initializing...</div>;
    if (!user) return null;

    return (
        <AnalysisProvider>
            <div className="flex bg-background min-h-screen text-foreground font-sans overflow-hidden">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <main className="flex-1 h-screen overflow-y-auto custom-scrollbar relative bg-background flex flex-col w-full">
                    {/* Functional Header */}
                    <header className="h-14 border-b border-border bg-surface flex items-center justify-between px-4 lg:px-8 flex-shrink-0">
                        <div className="flex items-center gap-4">
                            {/* Mobile Toggle */}
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden p-2 -ml-2 text-foreground-muted hover:text-white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                            </button>

                            <h2 className="text-sm font-bold text-foreground">
                                {getHeaderTitle(pathname)}
                            </h2>
                            <span className="text-border hidden sm:inline">/</span>
                            <p className="text-xs text-foreground-muted hidden sm:block">
                                {getHeaderSubtitle(pathname)}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center bg-background border border-border px-2 py-0.5 text-[10px] font-mono">
                                <span className="text-foreground-dim mr-2 hidden sm:inline">ENV:</span>
                                <span className="font-bold text-foreground-muted">PROD-EAST</span>
                            </div>
                            <div className="flex items-center bg-background border border-border px-2 py-0.5 text-[10px] font-mono">
                                <span className="text-foreground-dim mr-2 hidden sm:inline">LATENCY:</span>
                                <span className="font-bold text-success">24ms</span>
                            </div>
                        </div>
                    </header>

                    <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
                        <div className="max-w-[1600px] mx-auto">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </AnalysisProvider>
    );
}

function getHeaderTitle(path: string) {
    if (path.includes('/analysis')) return 'Analysis Console';
    if (path.includes('/schedule')) return 'Maintenance Schedule';
    if (path.includes('/notifications')) return 'System Logs';
    if (path.includes('/anomalies')) return 'Anomaly Reports';
    return 'Overview';
}

function getHeaderSubtitle(path: string) {
    if (path.includes('/analysis')) return 'Ingest & Process';
    if (path.includes('/schedule')) return 'Calendar & Slots';
    if (path.includes('/notifications')) return 'Recent Activity';
    return 'Real-time Monitoring';
}
