'use client';

import { motion } from 'framer-motion';

export default function ArchitectureDiagram() {
    return (
        <div className="w-full aspect-[16/9] bg-[#0c0c0e] border border-white/10 relative overflow-hidden flex items-center justify-center p-8">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

            <div className="relative z-10 w-full max-w-4xl flex items-center justify-between gap-4">

                {/* 1. Edge Layer */}
                <div className="flex flex-col gap-6 items-center group">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2 group-hover:text-indigo-400 transition-colors">Edge Device Layer</div>
                    <div className="flex flex-col gap-3">
                        {['Raspberry Pi 5', 'OBD-II Scanner', 'Thermal Cam'].map((label, i) => (
                            <motion.div
                                key={label}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="px-3 py-2 bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 rounded-sm w-32 text-center hover:border-indigo-500/30 transition-colors"
                            >
                                {label}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Arrow 1 */}
                <ConnectionLine delay={0.5} label="MQTT/HTTPS" />

                {/* 2. Orchestration Layer */}
                <div className="flex flex-col gap-6 items-center group">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2 group-hover:text-indigo-400 transition-colors">Orchestration</div>
                    <div className="relative">
                        <div className="w-24 h-32 bg-zinc-900/50 border border-zinc-800 rounded-lg flex items-center justify-center backdrop-blur-sm">
                            <div className="space-y-4 w-full px-2 flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full border border-indigo-500/30 flex items-center justify-center bg-indigo-500/5">
                                    <span className="text-[8px] text-center text-indigo-300 font-bold">MASTER<br />AGENT</span>
                                </div>
                                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                                    <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} className="h-full w-1/2 bg-indigo-500/50" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Arrow 2 */}
                <ConnectionLine delay={1} />

                {/* 3. Neural Analysis Core */}
                <div className="relative group">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4 text-center group-hover:text-indigo-400 transition-colors">Gemini Analysis</div>
                    <div className="relative w-40 h-40">
                        {/* Spinning Rings */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border border-indigo-500/30 rounded-full border-dashed"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-3 border border-purple-500/30 rounded-full border-dashed"
                        />
                        <motion.div
                            animate={{ rotate: 90 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-6 border border-cyan-500/30 rounded-full border-dashed opacity-50"
                        />

                        {/* Core */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-indigo-600/10 backdrop-blur-md border border-indigo-500/50 rounded-full flex items-center justify-center relative shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                                <span className="text-[10px] font-bold text-indigo-300">ONE</span>
                                <div className="absolute inset-0 rounded-full bg-indigo-500/10 animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Arrow 3 */}
                <ConnectionLine delay={1.5} />

                {/* 4. Action & Feedback */}
                <div className="flex flex-col gap-6 items-center group">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2 group-hover:text-indigo-400 transition-colors">Action & Feedback</div>
                    <div className="flex flex-col gap-3">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 2 }}
                            className="px-4 py-3 bg-indigo-950/20 border border-indigo-500/30 text-indigo-300 text-[10px] rounded-sm w-36"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                                <strong>Voice Agent</strong>
                            </div>
                            Auto-Call Owner
                        </motion.div>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 2.2 }}
                            className="px-4 py-3 bg-purple-950/20 border border-purple-500/30 text-purple-300 text-[10px] rounded-sm w-36"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
                                <strong>Manufacturing</strong>
                            </div>
                            RCA Loop-Back
                        </motion.div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function ConnectionLine({ delay, label }: { delay: number, label?: string }) {
    return (
        <div className="flex-1 h-[1px] bg-zinc-800 relative overflow-visible min-w-[40px] flex items-center justify-center">
            {label && <div className="absolute -top-4 text-[8px] text-zinc-600 font-mono">{label}</div>}
            <motion.div
                className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '400%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: delay, repeatDelay: 0.5 }}
            />
        </div>
    );
}
