'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/firebase/auth';
import { getUserNotifications } from '@/lib/agents/notification-agent';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
    id: string;
    anomaly: {
        type: string;
        severity: 'critical' | 'high' | 'medium' | 'low';
        description: string;
    };
    read: boolean;
    createdAt: number;
}

export default function NotificationsList() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.email) {
            loadNotifications(user.email);
        }
    }, [user]);

    const loadNotifications = async (email: string) => {
        const result = await getUserNotifications(email);
        if (result.success && result.notifications) {
            // Client-side sort
            const sorted = (result.notifications as Notification[]).sort((a, b) => b.createdAt - a.createdAt);
            setNotifications(sorted);
        }
        setLoading(false);
    };

    if (loading) return <div className="animate-pulse h-20 bg-white/5 rounded-lg" />;

    if (notifications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[100px] text-foreground-muted opacity-60">
                <span className="text-2xl mb-2">🔕</span>
                <p className="text-xs">No active alerts</p>
            </div>
        );
    }

    return (
        <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
            <AnimatePresence>
                {notifications.map((notif, index) => (
                    <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative pl-4 py-2 border-l border-border hover:border-primary/50 transition-colors group cursor-default"
                    >
                        {/* Timeline Dot */}
                        <div className={`absolute left-[-5px] top-3 w-2.5 h-2.5 rounded-full border-2 border-background 
                            ${notif.anomaly.severity === 'critical' ? 'bg-error' :
                                notif.anomaly.severity === 'high' ? 'bg-warning' :
                                    'bg-primary'}
                        `} />

                        <div className="flex justify-between items-start">
                            <h4 className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                                {notif.anomaly.type}
                            </h4>
                            <span className="text-[9px] text-foreground-muted uppercase tracking-wider">
                                {new Date(notif.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-[11px] text-foreground-muted mt-1 leading-snug line-clamp-2">
                            {notif.anomaly.description}
                        </p>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
