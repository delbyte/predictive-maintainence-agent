'use client';

import NotificationsList from '@/components/notifications/NotificationsList';
import { motion } from 'framer-motion';

export default function NotificationsPage() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-surface border border-border p-8 min-h-[500px]"
        >
            <NotificationsList />
        </motion.div>
    );
}
