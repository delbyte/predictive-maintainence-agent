'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, signOut } from '@/lib/firebase/auth';
import CSVUploader from '@/components/upload/CSVUploader';
import AgentVisualization from '@/components/agents/AgentVisualization';
import AnomalyDisplay from '@/components/results/AnomalyDisplay';
import ChatInterface from '@/components/chat/ChatInterface';
import { AgentState, AgentEvent } from '@/lib/agents/types';

import NotificationsList from '@/components/notifications/NotificationsList';
import AppointmentsList from '@/components/appointments/AppointmentsList';

export default function Dashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AgentState | null>(null);
    const [events, setEvents] = useState<AgentEvent[]>([]);
    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    const handleFileUpload = async (file: File) => {
        setAnalyzing(true);
        setEvents([]);
        setAnalysisResult(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('userEmail', user?.email || '');

            const response = await fetch('/api/analyze', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setAnalysisResult(data.state);
                setEvents(data.events || []);

                if (data.anomalyCount > 0) {
                    setShowChat(true);
                }
            } else {
                alert(`Analysis failed: ${data.error}`);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to analyze file');
        } finally {
            setAnalyzing(false);
        }
    };

    const handleScheduleRequest = async (date: string) => {
        if (!analysisResult?.anomalies || !user?.email) return;

        try {
            const response = await fetch('/api/schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    preferredDate: date,
                    anomalies: analysisResult.anomalies,
                    userEmail: user.email,
                    vehicleInfo: analysisResult.csvData?.vehicleInfo?.[0],
                }),
            });

            const data = await response.json();

            if (data.success) {
                alert(`✅ ${data.message}`);
                // Refresh the page to show the new appointment
                window.location.reload();
            } else {
                alert(`Scheduling failed: ${data.error}`);
            }
        } catch (error) {
            console.error('Scheduling error:', error);
            alert('Failed to schedule appointment');
        }
    };

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Predictive Maintenance Dashboard</h1>
                        <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8">
                    {/* Notifications & Appointments Row */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        <section>
                            <NotificationsList />
                        </section>
                        <section>
                            <AppointmentsList />
                        </section>
                    </div>

                    {/* Upload Section */}
                    <section>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Vehicle Data</h2>
                        <CSVUploader onUpload={handleFileUpload} loading={analyzing} />
                    </section>

                    {/* Agent Visualization */}
                    {events.length > 0 && (
                        <section>
                            <AgentVisualization events={events} />
                        </section>
                    )}

                    {/* Results */}
                    {analysisResult && (
                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Anomalies */}
                            <section>
                                <AnomalyDisplay anomalies={analysisResult.anomalies || []} />
                            </section>

                            {/* Chat Interface */}
                            {showChat && (
                                <section>
                                    <ChatInterface
                                        anomalies={analysisResult.anomalies}
                                        vehicleInfo={analysisResult.csvData?.vehicleInfo?.[0]}
                                        onScheduleRequest={handleScheduleRequest}
                                    />
                                </section>
                            )}
                        </div>
                    )}

                    {/* Empty State */}
                    {!analysisResult && !analyzing && (
                        <div className="text-center py-12">
                            <div className="text-4xl mb-4">📊</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No data analyzed yet
                            </h3>
                            <p className="text-gray-600">
                                Upload a CSV file to begin vehicle analysis
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
