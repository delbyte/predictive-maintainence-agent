'use client';

import { motion } from 'framer-motion';
import {
    Cpu,
    Smartphone,
    Search,
    Stethoscope, // Diagnosis
    PhoneCall, // Voice Agent
    MessageSquare, // Feedback
    Factory // Manufacturing
} from 'lucide-react';

export default function ProcessFlowChart() {
    const steps = [
        { icon: Cpu, label: 'Edge Detection', sub: 'OBD-II Analysis' },
        { icon: Search, label: 'Deviation Check', sub: 'Analysis Agent' },
        { icon: Stethoscope, label: 'Diagnosis', sub: 'Failure Prob.' },
        { icon: PhoneCall, label: 'Voice Agent', sub: 'Customer Call' },
        { icon: MessageSquare, label: 'Feedback', sub: 'Post-Service' },
        { icon: Factory, label: 'Mfg Insights', sub: 'RCA / CAPA' },
    ];

    return (
        <div className="w-full relative py-12 px-4 overflow-hidden">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-800 -translate-y-1/2" />

            <div className="relative z-10 flex justify-between items-start max-w-5xl mx-auto gap-4">
                {steps.map((step, i) => (
                    <div key={step.label} className="relative group flex flex-col items-center gap-4">
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.2 }}
                            className="bg-[#0c0c0e] border border-zinc-700 p-3 rounded-xl relative z-10 group-hover:border-indigo-500 transition-colors shadow-xl"
                        >
                            <step.icon className="w-5 h-5 text-indigo-400" />
                            {/* Connector Dot */}
                            {i < steps.length - 1 && (
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '100px' }} // Approximate gap width
                                    transition={{ delay: i * 0.2 + 0.2, duration: 0.3 }}
                                    className="absolute top-1/2 left-full h-0.5 bg-indigo-500 origin-left"
                                    style={{ zIndex: -1 }}
                                />
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: i * 0.2 + 0.1 }}
                            className="text-center"
                        >
                            <div className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">{step.label}</div>
                            <div className="text-[9px] text-zinc-500 font-mono mt-1">{step.sub}</div>
                        </motion.div>
                    </div>
                ))}
            </div>
        </div>
    );
}
