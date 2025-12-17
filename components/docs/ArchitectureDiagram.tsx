'use client';

import { motion } from 'framer-motion';

export default function ArchitectureDiagram() {
    return (
        <div className="w-full aspect-video bg-[#0c0c0e] border border-white/10 relative overflow-hidden flex items-center justify-center">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

            <div className="relative z-10 flex items-center gap-12">
                {/* Input Layer */}
                <div className="flex flex-col gap-4">
                    {['IoT Sensors', 'Video Feeds', 'Logs'].map((label, i) => (
                        <motion.div
                            key={label}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.2 }}
                            className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 rounded-sm w-32 text-center"
                        >
                            {label}
                        </motion.div>
                    ))}
                </div>

                {/* Central Neural Mesh */}
                <div className="relative w-48 h-48">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-2 border-indigo-500/20 rounded-full border-dashed"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-4 border-2 border-purple-500/20 rounded-full border-dashed"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-indigo-600/10 backdrop-blur-sm border border-indigo-500 rounded-full flex items-center justify-center relative">
                            <span className="text-xs font-bold text-indigo-400">GEMINI</span>
                            <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
                        </div>
                    </div>

                    {/* Connecting Lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <motion.path d="M 0 24 L 70 70" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="1" strokeDasharray="4 4" />
                        <motion.path d="M 0 96 L 70 96" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="1" strokeDasharray="4 4" />
                        <motion.path d="M 0 168 L 70 120" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="1" strokeDasharray="4 4" />
                    </svg>
                </div>

                {/* Output Layer */}
                <div className="flex flex-col gap-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="px-4 py-3 bg-indigo-950/30 border border-indigo-500/50 text-indigo-300 text-xs rounded-sm w-40"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                            <strong>Anomaly Predicted</strong>
                        </div>
                        Confidence: 99.8%
                    </motion.div>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="px-4 py-3 bg-purple-950/30 border border-purple-500/50 text-purple-300 text-xs rounded-sm w-40"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                            <strong>Auto-Schedule</strong>
                        </div>
                        Ticket #8829 Created
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
