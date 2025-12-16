'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CSVUploader from '@/components/upload/CSVUploader';
import AgentVisualization from '@/components/agents/AgentVisualization';
import AnomalyDisplay from '@/components/results/AnomalyDisplay';
import ChatInterface from '@/components/chat/ChatInterface';
import NotificationsList from '@/components/notifications/NotificationsList';
import AppointmentsList from '@/components/appointments/AppointmentsList';
import { AgentEvent, AnomalyDetectionResult } from '@/lib/agents/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
    const { user, loading: authLoading, signOut } = useAuth();
    const router = useRouter();
    const [analyzing, setAnalyzing] = useState(false);
    const [events, setEvents] = useState<AgentEvent[]>([]);
    const [analysisResult, setAnalysisResult] = useState<AnomalyDetectionResult | null>(null);
    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    const handleFileUpload = async (file: File) => {
        setAnalyzing(true);
        setEvents([]); // Clear previous events
        setAnalysisResult(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('userEmail', user?.email || '');

            const response = await fetch('/api/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok || !response.body) {
                throw new Error('Failed to start analysis');
            }

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
                                setEvents(prev => [...prev, data.event]);
                            } else if (data.type === 'complete') {
                                setAnalysisResult(data.state);
                                if (data.anomalyCount > 0) setShowChat(true);
                            } else if (data.type === 'error') {
                                alert(`Analysis error: ${data.message}`);
                            }
                        } catch (e) {
                            console.warn('Parse error', e);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to analyze file');
        } finally {
            setAnalyzing(false);
        }
    };

    if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground-muted">Loading System...</div>;
    if (!user) return null;

    return (
        <div className="min-h-screen font-sans bg-background p-6 lg:p-12 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-[500px] bg-primary/5 blur-[120px] pointer-events-none rounded-full" />

            <div className="relative z-10 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Predictive Maintenance<span className="text-primary">.ai</span></h1>
                        <p className="text-sm text-foreground-muted mt-1">Autonomous Vehicle Monitoring System</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-xs text-right hidden sm:block">
                            <div className="text-foreground">{user.email}</div>
                            <div className="text-success flex items-center justify-end gap-1">
                                <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                                Online
                            </div>
                        </div>
                        <button
                            onClick={() => signOut()}
                            className="text-xs px-3 py-1.5 rounded border border-white/10 hover:bg-white/5 transition-colors text-foreground-muted hover:text-foreground"
                        >
                            Sign Out
                        </button>
                    </div>
                </header>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Context & Chat (30%) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Upload Card */}
                        <div className="glass-panel p-6 rounded-xl">
                            <h3 className="text-sm font-medium text-foreground mb-4 uppercase tracking-wider opacity-70">Data Ingestion</h3>
                            <CSVUploader onUpload={handleFileUpload} loading={analyzing} />
                        </div>

                        {/* Quick Stats / History */}
                        <div className="glass-panel p-6 rounded-xl min-h-[300px]">
                            <h3 className="text-sm font-medium text-foreground mb-4 uppercase tracking-wider opacity-70">System Events</h3>
                            <NotificationsList />
                        </div>
                    </div>

                    {/* Right Column: Visualization & Results (70%) */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Agent Visualization */}
                        <div className="h-[500px] w-full">
                            <AgentVisualization events={events} />
                        </div>

                        {/* Results Area */}
                        <AnimatePresence>
                            {analysisResult && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <AnomalyDisplay result={analysisResult} />
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>
                </div>

                {/* Floating Chat (or Fixed Bottom Right) - Integrated nicely */}
                {showChat && analysisResult && (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="fixed bottom-6 right-6 w-96 z-50 shadow-2xl"
                    >
                        <ChatInterface
                            anomalies={analysisResult.anomalies}
                            analysisResult={analysisResult}
                        />
                    </motion.div>
                )}
            </div>
        </div>
    );
}
