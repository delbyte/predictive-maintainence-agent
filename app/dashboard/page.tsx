'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import CSVUploader from '@/components/upload/CSVUploader';
import AgentVisualization from '@/components/agents/AgentVisualization';
import AnomalyDisplay from '@/components/results/AnomalyDisplay';
import ChatInterface from '@/components/chat/ChatInterface';
import NotificationsList from '@/components/notifications/NotificationsList';
import AppointmentsList from '@/components/appointments/AppointmentsList';
import { AgentEvent, AnomalyDetectionResult } from '@/lib/agents/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertTriangle, Calendar, FileText, Activity, Server, Database, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [view, setView] = useState('dashboard');

    // State
    const [analyzing, setAnalyzing] = useState(false);
    const [events, setEvents] = useState<AgentEvent[]>([]);
    const [analysisResult, setAnalysisResult] = useState<AnomalyDetectionResult | null>(null);

    // Auth Guard
    useEffect(() => {
        if (!authLoading && !user) router.push('/');
    }, [user, authLoading, router]);

    const handleFileUpload = async (file: File) => {
        setAnalyzing(true);
        setView('analysis'); // Force switch to analysis view
        setEvents([]);
        setAnalysisResult(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('userEmail', user?.email || '');

            const response = await fetch('/api/analyze', { method: 'POST', body: formData });
            if (!response.ok || !response.body) throw new Error('Analysis initialization failed');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.type === 'agent_event') {
                                setEvents(p => [...p, data.event]);
                            } else if (data.type === 'complete') {
                                setAnalysisResult(data.state);
                            }
                        } catch (e) { console.warn(e); }
                    }
                }
            }
        } catch (error) {
            console.error(error);
            alert('System Error: Analysis failed to start.');
        } finally {
            setAnalyzing(false);
        }
    };

    if (authLoading) return <div className="h-screen w-screen bg-background flex items-center justify-center text-foreground-muted font-mono text-sm tracking-widest uppercase"><Loader2 className="animate-spin w-4 h-4 mr-3 text-primary" /> Initializing...</div>;
    if (!user) return null;

    return (
        <div className="flex bg-background min-h-screen text-foreground font-sans overflow-hidden">
            <Sidebar currentView={view} onNavigate={setView} />

            <main className="flex-1 h-screen overflow-y-auto custom-scrollbar relative bg-background flex flex-col">
                {/* Functional Header */}
                <header className="h-14 border-b border-border bg-surface flex items-center justify-between px-8 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <h2 className="text-sm font-bold text-foreground">
                            {view === 'dashboard' ? 'Overview' :
                                view === 'analysis' ? 'Analysis Console' :
                                    view === 'anomalies' ? 'Anomaly Reports' :
                                        view === 'schedule' ? 'Maintenance Schedule' :
                                            view === 'notifications' ? 'System Logs' :
                                                view.charAt(0).toUpperCase() + view.slice(1)}
                        </h2>
                        <span className="text-border">/</span>
                        <p className="text-xs text-foreground-muted">
                            {view === 'dashboard' ? 'Real-time Monitoring' :
                                view === 'analysis' ? 'Ingest & Process' :
                                    'Module Active'}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <StatusBadge label="ENV" value="PROD-EAST" />
                        <StatusBadge label="LATENCY" value="24ms" active />
                    </div>
                </header>

                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-[1600px] mx-auto">
                        <AnimatePresence mode="wait" initial={false}>
                            {view === 'dashboard' && (
                                <motion.div
                                    key="dashboard"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-6"
                                >
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <KpiCard title="System Output" value="NOMINAL" icon={Activity} trend="+1.2%" />
                                        <KpiCard title="Active Agents" value="6" icon={Zap} trend="STABLE" />
                                        <KpiCard title="Processed Sets" value={analysisResult?.anomalies ? "COMPLETED" : "IDLE"} icon={Database} />
                                        <KpiCard title="Server Load" value="12%" icon={Server} trend="-0.5%" />
                                    </div>

                                    {/* Main Dashboard Layout */}
                                    <div className="grid grid-cols-12 gap-6 h-[600px]">
                                        <div className="col-span-8 flex flex-col gap-6">
                                            {/* Quick Action / Hero */}
                                            <div onClick={() => setView('analysis')} className="flex-1 bg-surface border border-border p-8 flex flex-col justify-center items-center cursor-pointer group hover:bg-surface-hover transition-colors border-dashed hover:border-solid hover:border-primary/50">
                                                <div className="w-16 h-16 bg-background border border-border flex items-center justify-center mb-6 group-hover:scale-105 transition-transform group-hover:border-primary/50">
                                                    <Loader2 className="w-8 h-8 text-foreground-muted group-hover:text-primary transition-colors" />
                                                </div>
                                                <h3 className="text-lg font-bold text-foreground mb-2">New Analysis Session</h3>
                                                <p className="text-sm text-foreground-muted max-w-sm text-center">Initialize a new predictive maintenance workflow by ingesting vehicle telemetry data.</p>
                                                <button className="mt-6 px-4 py-2 bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors">
                                                    Start Ingestion
                                                </button>
                                            </div>
                                        </div>

                                        <div className="col-span-4 bg-surface border border-border flex flex-col">
                                            <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-surface-hover">
                                                <span className="text-xs font-bold uppercase text-foreground-dim">Recent Logs</span>
                                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                            </div>
                                            <div className="flex-1 overflow-hidden p-0">
                                                <NotificationsList />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {view === 'analysis' && (
                                <motion.div
                                    key="analysis"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="grid grid-cols-12 gap-6 h-full"
                                >
                                    {/* Left Panel: Upload & Pipeline */}
                                    <div className="col-span-4 flex flex-col gap-6">
                                        <div className="bg-surface border border-border p-6 shadow-sm">
                                            <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Data Source</h3>
                                            <CSVUploader onUpload={handleFileUpload} loading={analyzing} />
                                        </div>

                                        {/* Pipeline Monitor - Replaces old Agent Viz style */}
                                        <div className="flex-1">
                                            <AgentVisualization events={events} />
                                        </div>
                                    </div>

                                    {/* Right Panel: Results & Chat */}
                                    <div className="col-span-8 flex flex-col gap-6">
                                        {analysisResult ? (
                                            <>
                                                <AnomalyDisplay result={analysisResult} />
                                                <div className="flex-1 bg-surface border border-border flex flex-col">
                                                    <div className="px-4 py-2 border-b border-border text-xs font-bold uppercase text-foreground-dim">
                                                        Interactive Agent Interface
                                                    </div>
                                                    <ChatInterface
                                                        anomalies={analysisResult.anomalies}
                                                        analysisResult={analysisResult}
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="h-full border border-dashed border-border flex items-center justify-center text-foreground-muted bg-surface/50">
                                                <div className="text-center">
                                                    <Loader2 className={cn("w-8 h-8 mx-auto mb-4 text-border", analyzing && "animate-spin text-primary")} />
                                                    <p className="text-sm font-mono">{analyzing ? "PROCESSING STREAM..." : "WAITING FOR DATA"}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Other views handled simply for now */}
                            {view === 'anomalies' && (
                                <motion.div key="anomalies" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    {analysisResult ? (
                                        <AnomalyDisplay result={analysisResult} />
                                    ) : (
                                        <EmptyState icon={AlertTriangle} title="No Active Reports" desc="Run an analysis to generate anomaly reports." />
                                    )}
                                </motion.div>
                            )}

                            {view === 'schedule' && (
                                <motion.div key="schedule" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <div className="bg-surface border border-border p-8 min-h-[500px]">
                                        <AppointmentsList />
                                    </div>
                                </motion.div>
                            )}

                            {view === 'notifications' && (
                                <motion.div key="notifications" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <div className="bg-surface border border-border p-8 min-h-[500px]">
                                        <NotificationsList />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatusBadge({ label, value, active }: { label: string, value: string, active?: boolean }) {
    return (
        <div className="flex items-center bg-background border border-border px-2 py-0.5 text-[10px] font-mono">
            <span className="text-foreground-dim mr-2">{label}:</span>
            <span className={cn("font-bold", active ? "text-success" : "text-foreground-muted")}>{value}</span>
        </div>
    )
}

function KpiCard({ title, value, icon: Icon, trend }: { title: string, value: string, icon: any, trend?: string }) {
    return (
        <div className="p-4 bg-surface border border-border flex flex-col justify-between h-28 group hover:border-primary/30 transition-colors">
            <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-foreground-dim uppercase tracking-wider">{title}</span>
                <Icon className="w-4 h-4 text-foreground-dim group-hover:text-primary transition-colors" />
            </div>
            <div className="flex items-end justify-between">
                <span className="text-2xl font-bold tracking-tight text-foreground">{value}</span>
                {trend && <span className={cn("text-[10px] font-mono", trend.startsWith('+') ? "text-success" : trend.startsWith('-') ? "text-success" : "text-foreground-muted")}>{trend}</span>}
            </div>
        </div>
    )
}

function EmptyState({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="h-[400px] w-full border border-border border-dashed bg-surface flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-background border border-border flex items-center justify-center mb-6">
                <Icon className="w-6 h-6 text-foreground-muted" />
            </div>
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
            <p className="text-sm text-foreground-muted mt-1 max-w-sm">{desc}</p>
        </div>
    )
}
