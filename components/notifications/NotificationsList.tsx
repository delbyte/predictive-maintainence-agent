'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/firebase/auth';
import { getUserNotifications } from '@/lib/agents/notification-agent';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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
            const sorted = (result.notifications as Notification[]).sort((a, b) => b.createdAt - a.createdAt);
            setNotifications(sorted);
        }
        setLoading(false);
    };

    if (loading) return <div className="animate-pulse h-20 bg-[#18181b] rounded-lg border border-[#27272a]" />;

    if (notifications.length === 0) {
        return (
            <div className="border border-[#27272a] rounded-lg p-8 bg-[#18181b] flex flex-col items-center justify-center text-center">
                <Bell className="w-5 h-5 text-zinc-600 mb-2" />
                <p className="text-xs text-zinc-500">No active system alerts.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
            <AnimatePresence>
                {notifications.map((notif, index) => {
                    const severity = notif.anomaly.severity;
                    const Icon = severity === 'critical' ? AlertCircle : severity === 'high' ? AlertTriangle : Info;
                    const color = severity === 'critical' ? 'text-red-500' : severity === 'high' ? 'text-orange-500' : 'text-blue-500';

                    return (
                        <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-[#18181b] border border-[#27272a] p-3 rounded-lg hover:border-zinc-600 transition-colors group cursor-default"
                        >
                            <div className="flex gap-3">
                                <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", color)} />
                                <div>
                                    <div className="flex justify-between items-start w-full">
                                        <h4 className="text-xs font-semibold text-zinc-200">{notif.anomaly.type}</h4>
                                        <span className="text-[10px] text-zinc-500 ml-4 whitespace-nowrap">
                                            {new Date(notif.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-zinc-400 mt-1 leading-snug line-clamp-2">
                                        {notif.anomaly.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </AnimatePresence>
        </div>
    );
}
