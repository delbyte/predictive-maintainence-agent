'use client';

import Sidebar from '@/components/layout/Sidebar';
import { AnalysisProvider } from '@/lib/context/analysis-context';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) router.push('/');
    }, [user, loading, router]);

    if (loading) return <div className="h-screen w-screen bg-background flex items-center justify-center text-foreground-muted font-mono text-sm tracking-widest uppercase"><Loader2 className="animate-spin w-4 h-4 mr-3 text-primary" /> Initializing...</div>;
    if (!user) return null;

    return (
        <AnalysisProvider>
            <div className="flex bg-background min-h-screen text-foreground font-sans overflow-hidden">
                <Sidebar />
                <main className="flex-1 h-screen overflow-y-auto custom-scrollbar relative bg-background flex flex-col">
                    {/* Functional Header */}
                    <header className="h-14 border-b border-border bg-surface flex items-center justify-between px-8 flex-shrink-0">
                        <div className="flex items-center gap-4">
                            <h2 className="text-sm font-bold text-foreground">
                                {getHeaderTitle(pathname)}
                            </h2>
                            <span className="text-border">/</span>
                            <p className="text-xs text-foreground-muted">
                                {getHeaderSubtitle(pathname)}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center bg-background border border-border px-2 py-0.5 text-[10px] font-mono">
                                <span className="text-foreground-dim mr-2">ENV:</span>
                                <span className="font-bold text-foreground-muted">PROD-EAST</span>
                            </div>
                            <div className="flex items-center bg-background border border-border px-2 py-0.5 text-[10px] font-mono">
                                <span className="text-foreground-dim mr-2">LATENCY:</span>
                                <span className="font-bold text-success">24ms</span>
                            </div>
                        </div>
                    </header>

                    <div className="flex-1 p-8 overflow-y-auto">
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
