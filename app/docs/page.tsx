'use client';

import { motion } from 'framer-motion';
import { Book, Cpu, Shield, Zap, Activity, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500 font-sans">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <ArrowLeft className="w-4 h-4 text-zinc-400" />
                        <span className="text-sm font-mono text-zinc-400">Back to Home</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-indigo-600 flex items-center justify-center">
                            <Book className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-bold tracking-wider text-sm">DOCS<span className="text-indigo-500">.AI</span></span>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto pt-32 pb-20 px-6 grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-12">

                {/* Sidebar */}
                <aside className="hidden lg:block space-y-8 sticky top-32 self-start">
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Getting Started</h3>
                        <ul className="space-y-2 border-l border-white/10 ml-1">
                            <li><a href="#intro" className="block pl-4 py-1 text-sm text-indigo-400 border-l border-indigo-500 -ml-[1px]">Introduction</a></li>
                            <li><a href="#architecture" className="block pl-4 py-1 text-sm text-zinc-400 hover:text-white transition-colors">Architecture</a></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Core Modules</h3>
                        <ul className="space-y-2 border-l border-white/10 ml-1">
                            <li><a href="#anomaly-detection" className="block pl-4 py-1 text-sm text-zinc-400 hover:text-white transition-colors">Anomaly Detection</a></li>
                            <li><a href="#predictive-analytics" className="block pl-4 py-1 text-sm text-zinc-400 hover:text-white transition-colors">Predictive Analytics</a></li>
                            <li><a href="#auto-remediation" className="block pl-4 py-1 text-sm text-zinc-400 hover:text-white transition-colors">Auto-Remediation</a></li>
                        </ul>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="space-y-16">

                    {/* Header */}
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-mono uppercase tracking-widest">
                            <span className="w-2 h-2 bg-indigo-500 rounded-none animate-pulse" />
                            Documentation V1.0
                        </div>
                        <h1 className="text-5xl font-bold tracking-tight">System Documentation</h1>
                        <p className="text-xl text-zinc-400 max-w-2xl">
                            Comprehensive guide to the Automobile AI's neural architecture and operational capabilities.
                        </p>
                    </div>

                    {/* Article 1: Intro */}
                    <section id="intro" className="space-y-6">
                        <div className="flex items-center gap-3 text-indigo-400">
                            <Activity className="w-6 h-6" />
                            <h2 className="text-2xl font-bold text-white">Introduction</h2>
                        </div>
                        <div className="prose prose-invert max-w-none text-zinc-300">
                            <p>
                                The <strong>Automobile AI</strong> represents a paradigm shift in industrial fleet management.
                                Unlike traditional heuristic-based monitoring systems, our platform utilizes a mesh of specialized AI agents
                                to continuously analyze telemetry data in real-time.
                            </p>
                            <div className="my-8 p-6 bg-[#0c0c0e] border border-white/10 rounded-none relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <h3 className="text-lg font-bold text-white mb-2 relative z-10">The Agentic Advantage</h3>
                                <p className="text-sm text-zinc-400 relative z-10">
                                    By delegating monitoring tasks to autonomous agents, the system achieves a reaction time of under 50ms
                                    for critical anomalies, reducing downtime by an average of 45% in deployed environments.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Article 2: Architecture */}
                    <section id="architecture" className="space-y-6 pt-10 border-t border-white/10">
                        <div className="flex items-center gap-3 text-purple-400">
                            <Cpu className="w-6 h-6" />
                            <h2 className="text-2xl font-bold text-white">Neural Architecture</h2>
                        </div>
                        <p className="text-zinc-300 leading-relaxed">
                            At the core lies the <strong>Gemini-Powered Inference Engine</strong>. This multi-modal model processes
                            unstructured sensor logs, vibration patterns, and thermal imaging data simultaneously.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="p-6 border border-white/10 bg-white/5 hover:border-indigo-500/50 transition-colors">
                                <Zap className="w-5 h-5 text-indigo-400 mb-4" />
                                <h4 className="font-bold text-white mb-2">Fast Path</h4>
                                <p className="text-sm text-zinc-400">
                                    Heuristic-based immediate triggers for known failure signatures (e.g., thermal runaway).
                                </p>
                            </div>
                            <div className="p-6 border border-white/10 bg-white/5 hover:border-purple-500/50 transition-colors">
                                <BrainCircuit className="w-5 h-5 text-purple-400 mb-4" />
                                <h4 className="font-bold text-white mb-2">Deep Path</h4>
                                <p className="text-sm text-zinc-400">
                                    Complex pattern recognition for emerging anomalies over extended time windows (e.g., bearing wear).
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Article 3: Anomaly Detection */}
                    <section id="anomaly-detection" className="space-y-6 pt-10 border-t border-white/10">
                        <div className="flex items-center gap-3 text-cyan-400">
                            <Shield className="w-6 h-6" />
                            <h2 className="text-2xl font-bold text-white">Anomaly Detection Protocols</h2>
                        </div>
                        <p className="text-zinc-300 leading-relaxed">
                            Our detection algorithms utilize an ensemble approach, combining Isolation Forests with LSTM autoencoders
                            to detect outliers in time-series data.
                        </p>
                        <div className="bg-[#050505] border border-white/10 p-6 font-mono text-sm text-zinc-400">
                            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                                <span className="text-green-500">●</span>
                                <span>system_log_stream.json</span>
                            </div>
                            <p>
                                <span className="text-purple-400">timestamp</span>: "2024-12-17T10:42:01Z"<br />
                                <span className="text-purple-400">sensor_id</span>: "TURBINE-04"<br />
                                <span className="text-purple-400">vibration_hz</span>: <span className="text-red-400">1450.2</span> <span className="text-zinc-600">// Critical Threshold Exceeded</span><br />
                                <span className="text-purple-400">confidence</span>: 0.98
                            </p>
                        </div>
                        <p className="text-zinc-300 leading-relaxed mt-4">
                            When a threshold is breached, the relevant agent automatically instantiates a maintenance ticket
                            and calculates the optimal intervention window to minimize operational impact.
                        </p>
                    </section>

                </main>
            </div>
        </div>
    );
}

function BrainCircuit(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
            <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
            <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
            <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
            <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
            <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
            <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
            <path d="M6 18a4 4 0 0 1-1.97-3.284" />
            <path d="M17.97 14.716A4 4 0 0 1 16 18" />
        </svg>
    )
}
