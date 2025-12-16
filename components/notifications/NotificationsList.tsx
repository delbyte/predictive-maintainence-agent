'use client';

import { useEffect, useState } from 'react';
import { getUserNotifications } from '@/lib/agents/notification-agent';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/firebase/auth';

interface Notification {
    id: string;
    anomaly: {
        type: string;
        severity: string;
        description: string;
        recommendation: string;
    };
    vehicleInfo?: {
        vin: string;
        make: string;
        model: string;
    };
    createdAt: number;
    read: boolean;
}

export default function NotificationsList() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
    }, [user]);

    const loadNotifications = async () => {
        if (!user?.email) return;

        setLoading(true);
        const result = await getUserNotifications(user.email);
        if (result.success) {
            setNotifications(result.notifications as Notification[]);
        }
        setLoading(false);
    };

    const severityColors: Record<string, string> = {
        critical: 'bg-red-100 border-red-500 text-red-900',
        high: 'bg-orange-100 border-orange-500 text-orange-900',
        medium: 'bg-yellow-100 border-yellow-500 text-yellow-900',
        low: 'bg-blue-100 border-blue-500 text-blue-900',
    };

    if (loading) {
        return <div className="text-center py-4 text-gray-500">Loading notifications...</div>;
    }

    if (notifications.length === 0) {
        return (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-gray-600">No new notifications</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
            <AnimatePresence>
                {notifications.map((notification) => (
                    <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`border-l-4 rounded-lg p-4 ${severityColors[notification.anomaly.severity] || 'bg-gray-100'}`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-semibold">{notification.anomaly.type}</span>
                                    <span className="text-xs uppercase px-2 py-0.5 bg-white rounded-full">
                                        {notification.anomaly.severity}
                                    </span>
                                </div>

                                {notification.vehicleInfo && (
                                    <p className="text-xs opacity-75 mb-2">
                                        {notification.vehicleInfo.make} {notification.vehicleInfo.model} - VIN: {notification.vehicleInfo.vin}
                                    </p>
                                )}

                                <p className="text-sm mb-2">{notification.anomaly.description}</p>

                                <div className="bg-white bg-opacity-50 rounded p-2">
                                    <p className="text-xs font-medium mb-0.5">Recommendation:</p>
                                    <p className="text-sm">{notification.anomaly.recommendation}</p>
                                </div>
                            </div>

                            <span className="text-xs text-gray-600 ml-4">
                                {new Date(notification.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
