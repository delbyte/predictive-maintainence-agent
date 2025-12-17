'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/firebase/auth';
import { getAppointments } from '@/lib/agents/scheduling-agent';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Appointment {
    id: string;
    details: {
        customerName: string;
        vehicleInfo: string;
        issueDescription: string;
    };
    schedule: {
        date: string;
        status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    };
}

export default function AppointmentsList() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user?.email) {
            loadAppointments(user.email);
        }
    }, [user]);

    const loadAppointments = async (email: string) => {
        setLoading(true);
        setError(null);
        try {
            const result = await getAppointments(email);
            if (result.success && result.appointments) {
                setAppointments(result.appointments as Appointment[]);
            } else {
                setError(result.error || 'Failed to load appointments');
            }
        } catch (err) {
            console.error(err);
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="h-20 animate-pulse bg-surface border border-border" />;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
                <h3 className="text-sm font-bold text-foreground">Scheduled Maintenance</h3>
                <button
                    onClick={() => user?.email && loadAppointments(user.email)}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                    <Clock className="w-3 h-3" /> Refresh
                </button>
            </div>

            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                    {error}
                </div>
            )}

            {!loading && appointments.length === 0 ? (
                <div className="border border-dashed border-border p-6 bg-surface flex flex-col items-center justify-center text-center">
                    <Calendar className="w-5 h-5 text-foreground-muted mb-2" />
                    <p className="text-xs text-foreground-muted">No scheduled maintenance tasks.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {appointments.map((apt) => (
                        <div key={apt.id} className="bg-surface border-b border-border p-4 flex items-start gap-4 hover:bg-surface-hover transition-colors last:border-0">
                            <div className="w-10 h-10 bg-background flex items-center justify-center shrink-0 border border-border">
                                <span className="text-sm font-bold text-foreground">
                                    {new Date(apt.schedule.date).getDate()}
                                </span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">{apt.details.vehicleInfo}</h4>
                                    <StatusBadge status={apt.schedule.status} />
                                </div>
                                <p className="text-[11px] text-foreground-muted mt-1 line-clamp-1 font-mono">{apt.details.issueDescription}</p>

                                <div className="flex gap-4 mt-2">
                                    <div className="flex items-center gap-1.5 text-[10px] text-foreground-dim font-bold">
                                        <Clock className="w-3 h-3" />
                                        {new Date(apt.schedule.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-foreground-dim font-bold">
                                        <MapPin className="w-3 h-3" />
                                        <span>Service Center A</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    return (
        <span className={cn(
            "px-1.5 py-0.5 text-[10px] uppercase font-bold border",
            status === 'confirmed' ? "bg-success/10 text-success border-success/20" :
                status === 'pending' ? "bg-warning/10 text-warning border-warning/20" :
                    "bg-surface text-foreground-muted border-border"
        )}>
            {status}
        </span>
    )
}
