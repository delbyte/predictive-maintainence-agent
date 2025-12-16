'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/lib/firebase/auth';
import { motion } from 'framer-motion';

interface Appointment {
    id: string;
    appointmentDate: string;
    duration: number;
    status: string;
    vehicleInfo?: {
        vin: string;
        make: string;
        model: string;
    };
    anomalies: {
        type: string;
        severity: string;
    }[];
    createdAt: number;
}

export default function AppointmentsList() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAppointments();
    }, [user]);

    const loadAppointments = async () => {
        if (!user?.email) return;

        setLoading(true);
        try {
            const q = query(
                collection(db, 'appointments'),
                where('userId', '==', user.email),
                orderBy('appointmentDate', 'desc')
            );

            const querySnapshot = await getDocs(q);
            const apps = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Appointment[];

            setAppointments(apps);
        } catch (error) {
            console.error('Error loading appointments:', error);
        }
        setLoading(false);
    };

    if (loading) {
        return <div className="text-center py-4 text-gray-500">Loading appointments...</div>;
    }

    if (appointments.length === 0) {
        return (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="text-4xl mb-2">📅</div>
                <p className="text-gray-600">No appointments scheduled</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Scheduled Appointments</h3>
            {appointments.map((appointment, index) => {
                const appointmentDate = new Date(appointment.appointmentDate);
                const isPast = appointmentDate < new Date();

                return (
                    <motion.div
                        key={appointment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-white border-2 rounded-lg p-4 ${isPast ? 'border-gray-300 opacity-60' : 'border-blue-500'}`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                    <span className="text-2xl">🔧</span>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Maintenance Appointment</h4>
                                        <p className="text-sm text-gray-600">
                                            {appointmentDate.toLocaleString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {appointment.vehicleInfo && (
                                    <p className="text-sm text-gray-700 mb-2">
                                        <strong>Vehicle:</strong> {appointment.vehicleInfo.make} {appointment.vehicleInfo.model} ({appointment.vehicleInfo.vin})
                                    </p>
                                )}

                                <div className="bg-gray-50 rounded p-3">
                                    <p className="text-xs font-medium text-gray-700 mb-1">Issues to Address:</p>
                                    <ul className="space-y-1">
                                        {appointment.anomalies.map((anomaly, i) => (
                                            <li key={i} className="text-sm text-gray-900 flex items-center space-x-2">
                                                <span className={`w-2 h-2 rounded-full ${anomaly.severity === 'critical' ? 'bg-red-500' :
                                                        anomaly.severity === 'high' ? 'bg-orange-500' :
                                                            anomaly.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                                                    }`} />
                                                <span>{anomaly.type}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <p className="text-xs text-gray-500 mt-2">
                                    Duration: {appointment.duration} minutes • Status: {appointment.status}
                                </p>
                            </div>

                            {!isPast && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                    Upcoming
                                </span>
                            )}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
