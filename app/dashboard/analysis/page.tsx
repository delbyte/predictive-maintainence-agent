'use client';

import { useAnalysis } from '@/lib/context/analysis-context';
import { useAuth } from '@/lib/firebase/auth';
import CSVUploader from '@/components/upload/CSVUploader';
import AgentVisualization from '@/components/agents/AgentVisualization';
import AnomalyDisplay from '@/components/results/AnomalyDisplay';
import ChatInterface from '@/components/chat/ChatInterface';
import { Loader2, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function AnalysisPage() {
    const { user } = useAuth();
    const router = useRouter();
    const {
        analyzing, setAnalyzing,
        events, setEvents,
        analysisResult, setAnalysisResult
    } = useAnalysis();

    const handleFileUpload = async (file: File) => {
        setAnalyzing(true);
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

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-12 gap-6 h-full"
        >
            {/* Left Panel: Upload & Pipeline */}
            <div className="col-span-4 flex flex-col gap-6">
                <div className="bg-surface border border-border p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Data Source</h3>
                    <CSVUploader onUpload={handleFileUpload} loading={analyzing} />
                </div>

                {/* Pipeline Monitor */}
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
                                vehicleInfo={analysisResult.anomalies[0] ? { vin: analysisResult.anomalies[0].vin } : undefined}
                                onScheduleRequest={async (dateString) => {
                                    try {
                                        const response = await fetch('/api/schedule', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                preferredDate: dateString,
                                                anomalies: analysisResult.anomalies,
                                                userEmail: user?.email,
                                                vehicleInfo: { vin: 'MOCK-VIN-123456' }
                                            })
                                        });

                                        if (response.ok) {
                                            // Redirect to schedule page
                                            router.push('/dashboard/schedule');
                                        } else {
                                            console.error("Failed to schedule");
                                        }
                                    } catch (e) {
                                        console.error(e);
                                    }
                                }}
                            />
                        </div>
                    </>
                ) : (
                    <div className="h-full border border-dashed border-border flex items-center justify-center text-foreground-muted bg-surface/50">
                        <div className="text-center flex flex-col items-center">
                            <div className={cn("relative w-16 h-16 flex items-center justify-center mb-6 rounded-full bg-surface border border-border", analyzing && "border-primary/50 shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)]")}>
                                <BrainCircuit className={cn("w-8 h-8 text-foreground-muted", analyzing ? "animate-pulse text-primary" : "")} />
                                {analyzing && <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping" />}
                            </div>
                            <h3 className="text-sm font-bold text-foreground mb-1 uppercase tracking-widest">{analyzing ? "Neural Processing" : "System Ready"}</h3>
                            <p className="text-xs font-mono text-foreground-muted">{analyzing ? "Ingesting telemetry stream..." : "Waiting for data stream input"}</p>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
