'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Database, Brain, AlertTriangle, CheckCircle } from 'lucide-react';

export default function ProcessFlowChart() {
    const steps = [
        { icon: Database, label: "Telemetry Ingest", color: "text-zinc-400", border: "border-zinc-700" },
        { icon: Brain, label: "Inference Engine", color: "text-purple-400", border: "border-purple-500" },
        { icon: AlertTriangle, label: "Threshold Check", color: "text-amber-400", border: "border-amber-500" },
        { icon: CheckCircle, label: "Action Taken", color: "text-green-400", border: "border-green-500" }
    ];

    return (
        <div className="w-full py-12 bg-[#0c0c0e] border border-white/10 flex items-center justify-center overflow-x-auto">
            <div className="flex items-center gap-4 min-w-max px-8">
                {steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className={`flex flex-col items-center gap-3`}
                        >
                            <div className={`w-16 h-16 rounded-2xl bg-black border ${step.border} flex items-center justify-center relative group`}>
                                <div className={`absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity`} />
                                <step.icon className={`w-6 h-6 ${step.color}`} />
                            </div>
                            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">{step.label}</span>
                        </motion.div>

                        {i < steps.length - 1 && (
                            <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                whileInView={{ width: 'auto', opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 + 0.1 }}
                            >
                                <ArrowRight className="w-5 h-5 text-zinc-600" />
                            </motion.div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
