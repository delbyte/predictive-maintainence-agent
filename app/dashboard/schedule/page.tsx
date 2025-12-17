'use client';

import AppointmentsList from '@/components/appointments/AppointmentsList';
import { motion } from 'framer-motion';

export default function SchedulePage() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-surface border border-border p-8 min-h-[500px]"
        >
            <AppointmentsList />
        </motion.div>
    );
}
