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
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, AlertTriangle, Calendar, FileText } from 'lucide-react';
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

    if (authLoading) return <div className="h-screen w-screen bg-[#09090b] flex items-center justify-center text-zinc-500 font-mono text-sm tracking-widest uppercase"><Loader2 className="animate-spin w-4 h-4 mr-3 text-primary" /> System Initializing...</div>;
    if (!user) return null;

    return (
        <div className="flex bg-[#050505] min-h-screen text-zinc-200 font-sans selection:bg-[#5e6ad2] selection:text-white overflow-hidden">
            <Sidebar currentView={view} onNavigate={setView} />

            <main className="flex-1 h-screen overflow-y-auto custom-scrollbar relative bg-[#050505]">
                <div className="max-w-[1920px] mx-auto p-8 lg:p-12">

                    {/* Header */}
                    <header className="mb-10 flex items-center justify-between border-b border-[#27272a] pb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-white tracking-tight">
                                {view === 'dashboard' ? 'Overview' :
                                    view === 'analysis' ? 'Analysis Console' :
                                        view === 'anomalies' ? 'Anomaly Reports' :
                                            view === 'schedule' ? 'Maintenance Schedule' :
                                                view === 'notifications' ? 'System Logs' :
                                                    view.charAt(0).toUpperCase() + view.slice(1)}
                            </h2>
                            <p className="text-sm text-zinc-500 mt-2 font-medium">
                                {view === 'dashboard' ? 'Real-time fleet monitoring and system status.' :
                                    view === 'analysis' ? 'Execute predictive models and review agent logs.' :
                                        view === 'anomalies' ? 'Detailed breakdown of detected vehicle faults.' :
                                            view === 'schedule' ? 'Upcoming service appointments and history.' :
                                                view === 'notifications' ? 'Historical alert log and dispatch records.' :
                                                    'System module.'}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="px-3 py-1 bg-[#18181b] border border-[#27272a] text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                                ENV: PROD-US-EAST
                            </div>
                            <div className="px-3 py-1 bg-[#18181b] border border-[#27272a] text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                                LATENCY: 24ms
                            </div>
                        </div>
                    </header>

                    {/* Content Views */}
                    <AnimatePresence mode="wait">
                        {view === 'dashboard' && (
                            <motion.div
                                key="dashboard"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                {/* KPI Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <KpiCard title="System Status" value="OPERATIONAL" color="text-emerald-500" />
                                    <KpiCard title="Active Agents" value="6" color="text-white" />
                                    <KpiCard title="Analyzed Records" value={analysisResult?.anomalies ? "COMPLETE" : "IDLE"} color="text-white" />
                                    <KpiCard title="Pending Alerts" value="0" color="text-zinc-500" />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
                                    <div className="lg:col-span-2 flex flex-col gap-8">
                                        <div className="p-8 bg-[#09090b] border border-[#27272a] h-full flex flex-col justify-center items-center text-center group hover:border-[#3f3f46] transition-colors cursor-pointer" onClick={() => setView('analysis')}>
                                            <div className="w-16 h-16 bg-[#18181b] border border-[#27272a] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                <Loader2 className="w-8 h-8 text-zinc-500 group-hover:text-primary transition-colors" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">New Analysis</h3>
                                            <p className="text-sm text-zinc-500 max-w-md">Jump to the Analysis Console to ingest new sensor telemetry data.</p>
                                        </div>
                                    </div>
                                    <div className="bg-[#09090b] border border-[#27272a] p-6 overflow-hidden flex flex-col">
                                        <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-zinc-500" /> Recent Logs
                                        </h3>
                                        <NotificationsList />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {view === 'analysis' && (
                            <motion.div
                                key="analysis"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div className="bg-[#09090b] border border-[#27272a] p-8">
                                    <CSVUploader onUpload={handleFileUpload} loading={analyzing} />
                                </div>

                                <AgentVisualization events={events} />

                                {analysisResult && (
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        <div className="lg:col-span-2">
                                            <AnomalyDisplay result={analysisResult} />
                                        </div>
                                        <div>
                                            <ChatInterface
                                                anomalies={analysisResult.anomalies}
                                                analysisResult={analysisResult}
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Full Screen Views for the "Empty" Tabs */}
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
                                <div className="bg-[#09090b] border border-[#27272a] p-8 min-h-[500px]">
                                    <AppointmentsList />
                                </div>
                            </motion.div>
                        )}

                        {view === 'notifications' && (
                            <motion.div key="notifications" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div className="bg-[#09090b] border border-[#27272a] p-8 min-h-[500px]">
                                    <NotificationsList />
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>

                </div>
            </main>
        </div>
    );
}

function KpiCard({ title, value, color }: { title: string, value: string, color: string }) {
    return (
        <div className="p-6 bg-[#09090b] border border-[#27272a] flex flex-col justify-between h-32 hover:border-[#3f3f46] transition-colors">
            <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest">{title}</div>
            <div className={cn("text-3xl font-bold tracking-tight", color)}>{value}</div>
        </div>
    )
}

function EmptyState({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="h-[400px] w-full border border-[#27272a] border-dashed bg-[#09090b] flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[#18181b] flex items-center justify-center mb-6">
                <Icon className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold text-zinc-300">{title}</h3>
            <p className="text-sm text-zinc-500 mt-2 max-w-sm">{desc}</p>
        </div>
    )
}
