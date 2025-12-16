'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/firebase/auth';
import { getAppointments } from '@/lib/agents/scheduling-agent';
import { Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-react';

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

    useEffect(() => {
        if (user?.email) {
            loadAppointments(user.email);
        }
    }, [user]);

    const loadAppointments = async (email: string) => {
        const result = await getAppointments(email);
        if (result.success && result.appointments) {
            setAppointments(result.appointments as Appointment[]);
        }
        setLoading(false);
    };

    if (loading) return <div className="h-20 animate-pulse bg-[#18181b] rounded border border-[#27272a]" />;

    if (appointments.length === 0) {
        return (
            <div className="border border-[#27272a] rounded-lg p-6 bg-[#18181b] flex flex-col items-center justify-center text-center">
                <Calendar className="w-5 h-5 text-zinc-600 mb-2" />
                <p className="text-xs text-zinc-500">No scheduled maintenance tasks.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {appointments.map((apt) => (
                <div key={apt.id} className="bg-[#18181b] border border-[#27272a] p-4 rounded-lg flex items-start gap-4">
                    <div className="w-10 h-10 rounded bg-[#27272a] flex items-center justify-center shrink-0 border border-zinc-700">
                        <span className="text-sm font-bold text-zinc-300">
                            {new Date(apt.schedule.date).getDate()}
                        </span>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h4 className="text-xs font-bold text-zinc-200">{apt.details.vehicleInfo}</h4>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] uppercase font-bold border border-emerald-500/20">
                                {apt.schedule.status}
                            </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-1 line-clamp-1">{apt.details.issueDescription}</p>

                        <div className="flex gap-4 mt-2">
                            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                                <Clock className="w-3 h-3" />
                                {new Date(apt.schedule.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                                <MapPin className="w-3 h-3" />
                                <span>Service Center A</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
