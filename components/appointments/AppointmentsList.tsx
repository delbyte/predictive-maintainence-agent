'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/firebase/auth';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

interface Appointment {
    id: string;
    date: string;
    description: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    technician?: string;
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
        try {
            const q = query(
                collection(db, 'appointments'),
                where('userId', '==', email)
            );

            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Appointment[];

            // Client side sort
            setAppointments(data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        } catch (error) {
            console.error('Failed to load appointments', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="animate-pulse h-10 bg-white/5 rounded w-full" />;

    if (appointments.length === 0) return null; // Don't show if empty to save space

    return (
        <div className="glass-panel p-6 rounded-xl mt-6">
            <h3 className="text-sm font-medium text-foreground mb-4 uppercase tracking-wider opacity-70">Scheduled Maintenance</h3>
            <div className="space-y-2">
                {appointments.map((appt) => (
                    <div key={appt.id} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded bg-white/5 flex flex-col items-center justify-center text-xs">
                                <span className="font-bold">{new Date(appt.date).getDate()}</span>
                                <span className="opacity-50 uppercase text-[8px]">{new Date(appt.date).toLocaleString('default', { month: 'short' })}</span>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-foreground">{appt.description}</div>
                                <div className="text-[10px] text-foreground-muted">{new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {appt.technician || 'Auto-Assigned'}</div>
                            </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-success/10 text-success border border-success/20">
                            {appt.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
