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
import { AgentEvent, AnomalyDetectionResult } from '@/lib/agents/types';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

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

    if (authLoading) return <div className="h-screen w-screen bg-[#09090b] flex items-center justify-center text-zinc-500"><Loader2 className="animate-spin w-5 h-5 mr-2" /> Initializing...</div>;
    if (!user) return null;

    return (
        <div className="flex bg-[#09090b] min-h-screen text-zinc-200 font-sans selection:bg-[#5e6ad2] selection:text-white">
            <Sidebar currentView={view} onNavigate={setView} />

            <main className="flex-1 h-screen overflow-y-auto custom-scrollbar relative">
                <div className="max-w-[1600px] mx-auto p-8">

                    {/* Header */}
                    <header className="mb-8 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">
                                {view === 'dashboard' ? 'Overview' :
                                    view === 'analysis' ? 'Analysis Console' :
                                        view.charAt(0).toUpperCase() + view.slice(1)}
                            </h2>
                            <p className="text-sm text-zinc-500 mt-1">
                                {view === 'dashboard' ? 'Real-time fleet monitoring and system status.' :
                                    view === 'analysis' ? 'Execute predictive models and review agent logs.' :
                                        'System module.'}
                            </p>
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
                                className="space-y-6"
                            >
                                {/* Quick Stats Row would go here */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-6 bg-[#18181b] border border-[#27272a] rounded-lg">
                                        <div className="text-sm text-zinc-500 font-medium">System Status</div>
                                        <div className="text-2xl font-bold text-emerald-500 mt-2">Operational</div>
                                    </div>
                                    <div className="p-6 bg-[#18181b] border border-[#27272a] rounded-lg">
                                        <div className="text-sm text-zinc-500 font-medium">Active Agents</div>
                                        <div className="text-2xl font-bold text-white mt-2">6</div>
                                    </div>
                                    <div className="p-6 bg-[#18181b] border border-[#27272a] rounded-lg">
                                        <div className="text-sm text-zinc-500 font-medium">Analyzed Records</div>
                                        <div className="text-2xl font-bold text-white mt-2">-</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="p-6 bg-[#18181b] border border-[#27272a] rounded-lg">
                                            <h3 className="text-sm font-bold text-white mb-4">Quick Upload</h3>
                                            <CSVUploader onUpload={handleFileUpload} loading={analyzing} />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-white mb-4">Notifications</h3>
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
                    </AnimatePresence>

                </div>
            </main>
        </div>
    );
}
