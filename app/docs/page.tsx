'use client';

import { motion } from 'framer-motion';
import { Book, Cpu, Shield, Zap, Activity, ArrowLeft, BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import ArchitectureDiagram from '@/components/docs/ArchitectureDiagram';
import ProcessFlowChart from '@/components/docs/ProcessFlowChart';
import WireframeGallery from '@/components/docs/WireframeGallery';
import DataVisuals from '@/components/docs/DataVisuals';

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
                        <div className="w-6 h-6 flex items-center justify-center">
                            <img src="/logo.svg" alt="Docs Logo" className="w-6 h-6" />
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
                <main className="space-y-24">

                    {/* Header */}
                    <div className="space-y-4 pt-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-mono uppercase tracking-widest">
                            <span className="w-2 h-2 bg-indigo-500 rounded-none animate-pulse" />
                            Automotive AI 2.0
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/50">
                            Predictive Fleet<br />Neural System
                        </h1>
                        <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
                            A B2C agentic ecosystem for <span className="text-white">Indian Automotive OEMs</span>.
                            Integrating Raspberry Pi edge computing with voice-first AI agents to transform maintenance from reactive to predictive.
                        </p>
                    </div>

                    {/* Article 1: Context & Problem */}
                    <section id="intro" className="space-y-8">
                        <div className="flex items-center gap-3 text-indigo-400 border-b border-white/10 pb-4">
                            <Activity className="w-6 h-6" />
                            <h2 className="text-2xl font-bold text-white tracking-wider uppercase">01. The Reactive Paradox</h2>
                        </div>
                        <div className="prose prose-invert max-w-none text-zinc-300 space-y-6">
                            <p className="text-lg leading-loose">
                                <strong>The Challenge:</strong> Major Indian automotive OEMs currently operate on a purely reactive maintenance model. Vehicles are serviced only <em>after</em> catastrophic failure occurs.
                                This creates a chain reaction: unplanned breakdowns, erosion of customer trust, overloaded service centers, and—most critically—a complete absence of feedback loops between field failures and manufacturing engineering.
                            </p>
                            <p className="text-lg leading-loose">
                                <strong>Our Solution:</strong> We deploy an Agentic AI ecosystem that places intelligence at the edge. By integrating <strong>Raspberry Pi</strong> units with OBD-II ports, we capture telemetry in real-time. But we don't just log data; we act on it. Autonomous agents predict failures, voice agents proactively call owners to schedule service, and post-service data is fed back to manufacturing.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                                <div className="p-6 bg-[#0c0c0e] border border-white/10 hover:border-red-500/30 transition-colors">
                                    <h3 className="text-white font-bold mb-2">Current State (Reactive)</h3>
                                    <ul className="text-sm text-zinc-400 space-y-2 list-disc pl-4">
                                        <li>Unplanned road-side breakdowns.</li>
                                        <li>Design flaws persist in new models.</li>
                                        <li>Service centers overwhelmed by emergencies.</li>
                                    </ul>
                                    <div className="mt-4 h-1 w-full bg-red-900/20 rounded-full"><div className="h-full w-full bg-red-800 rounded-full" /></div>
                                </div>
                                <div className="p-6 bg-[#0c0c0e] border border-white/10 hover:border-green-500/30 transition-colors">
                                    <h3 className="text-white font-bold mb-2">Future State (Agentic)</h3>
                                    <ul className="text-sm text-zinc-400 space-y-2 list-disc pl-4">
                                        <li>Proactive "Pit-Stop" style maintenance.</li>
                                        <li>Closed-loop RCA for Manufacturing.</li>
                                        <li>Voice-first customer concierge.</li>
                                    </ul>
                                    <div className="mt-4 h-1 w-full bg-green-900/20 rounded-full"><div className="h-full w-2/3 bg-green-500 rounded-full" /></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Article 2: Architecture */}
                    <section id="architecture" className="space-y-8 pt-10 border-t border-white/10">
                        <div className="flex items-center gap-3 text-purple-400 border-b border-white/10 pb-4">
                            <Cpu className="w-6 h-6" />
                            <h2 className="text-2xl font-bold text-white tracking-wider uppercase">02. Edge-to-Action Topology</h2>
                        </div>
                        <p className="text-zinc-300 leading-relaxed text-lg">
                            The architecture is built for speed and autonomy. It begins at the physical layer with <strong>Raspberry Pi Edge Units</strong> collecting raw OBD-II data (Coolant Temp, RPM, Fuel Trim).
                            Deviations are transmitted via MQTT to the cloud, where the <strong>Master Agent</strong> orchestrates a legion of specialized sub-agents.
                        </p>

                        {/* Visual: Architecture Diagram */}
                        <div className="my-12">
                            <ArchitectureDiagram />
                            <p className="text-xs text-zinc-500 text-center font-mono mt-4">FIG-01: RASPBERRY PI & AGENTIC MESH ARCHITECTURE</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="p-8 border border-white/10 bg-white/5 hover:border-indigo-500/50 transition-colors group">
                                <Zap className="w-8 h-8 text-indigo-400 mb-6 group-hover:text-white transition-colors" />
                                <h4 className="font-bold text-xl text-white mb-3">Edge Detection (Pi)</h4>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    Low-latency processing on the Raspberry Pi filters noise. Only significant anomalies (e.g., "Coolant &gt; 105°C sustained") trigger the upstream agents.
                                </p>
                            </div>
                            <div className="p-8 border border-white/10 bg-white/5 hover:border-purple-500/50 transition-colors group">
                                <BrainCircuit className="w-8 h-8 text-purple-400 mb-6 group-hover:text-white transition-colors" />
                                <h4 className="font-bold text-xl text-white mb-3">Voice Agent (Action)</h4>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    Instead of a generic push notification, a conversational Voice Agent calls the customer: <em>"Hello, I detected a potential cooling issue. Can I schedule a check-up for Tuesday?"</em>
                                </p>
                            </div>
                        </div>
                    </section>


                    {/* Article 3: Operational Flow */}
                    <section id="anomaly-detection" className="space-y-8 pt-10 border-t border-white/10">
                        <div className="flex items-center gap-3 text-cyan-400 border-b border-white/10 pb-4">
                            <Shield className="w-6 h-6" />
                            <h2 className="text-2xl font-bold text-white tracking-wider uppercase">03. The Lifecycle Loop</h2>
                        </div>

                        {/* Visual: Flow Chart */}
                        <div className="my-12">
                            <ProcessFlowChart />
                            <p className="text-xs text-zinc-500 text-center font-mono mt-4">FIG-02: DETECTION -&gt; VOICE CALL -&gt; FEEDBACK FLOW</p>
                        </div>

                        <p className="text-zinc-300 leading-relaxed text-lg">
                            The true value lies in the <strong>Manufacturing Feedback Loop</strong>. Post-service data—what was actually broken versus what was predicted—is fed into the Manufacturing Insights Engine. This generates Root Cause Analysis (RCA) reports, allowing engineering teams to fix design flaws at the source, rather than just patching them in the field.
                        </p>

                        {/* Visual: Data Charts */}
                        <div className="my-12">
                            <div className="mb-6 border-l-2 border-indigo-500 pl-4">
                                <h3 className="text-lg font-bold text-white">Fleet-Wide Intelligence</h3>
                                <p className="text-sm text-zinc-400">Web dashboard views for OEM Quality Assurance teams.</p>
                            </div>
                            <DataVisuals />
                        </div>

                        <div className="bg-[#050505] border border-white/10 p-8 font-mono text-sm text-zinc-400 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-50"><Shield className="w-12 h-12 text-zinc-800" /></div>
                            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                                <span className="text-green-500 animate-pulse">●</span>
                                <span>agent_action_log.json</span>
                                <span className="text-xs text-zinc-600 ml-auto uppercase">Voice Agent Transcript</span>
                            </div>
                            <p className="space-y-1">
                                <span className="text-purple-400">agent</span>: "Good afternoon. I'm calling from Tata Motors AI. We detected an irregular vibration pattern in your Safari's transmission."<br />
                                <span className="text-cyan-400">customer</span>: "Is it serious? I have a trip planned."<br />
                                <span className="text-purple-400">agent</span>: "Our diagnosis suggests early bearing fatigue (Prob: 89%). It is safe for city driving, but we recommend service before your trip. Shall I book a slot for tomorrow at 10 AM?"<br />
                                <span className="text-zinc-500">... [Appointment Confirmed] ...</span><br />
                                <span className="text-yellow-400">system_action</span>: "Ticket #9902 created. Feedback loop initiated for QA Team."
                            </p>
                        </div>
                    </section>

                    {/* Article 4: Interface & Touchpoints */}
                    <section id="interface" className="space-y-8 pt-10 border-t border-white/10">
                        <div className="flex items-center gap-3 text-pink-400 border-b border-white/10 pb-4">
                            <Activity className="w-6 h-6" />
                            <h2 className="text-2xl font-bold text-white tracking-wider uppercase">04. Solution Components</h2>
                        </div>
                        <p className="text-zinc-300 leading-relaxed text-lg">
                            The solution serves four distinct user groups: Vehicle Owners (App), Service Managers (Dashboard), OEM QA Teams (Analytics), and the Vehicles themselves (Edge Units).
                        </p>

                        {/* Visual: Wireframes */}
                        <div className="my-12">
                            <WireframeGallery />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                            <div className="space-y-2">
                                <h4 className="text-white font-bold text-sm uppercase border-b border-white/10 pb-2">Voice-First Agent</h4>
                                <p className="text-xs text-zinc-400">Natural language conversations. Explains technical issues in simple terms and handles negotiation of service slots.</p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-white font-bold text-sm uppercase border-b border-white/10 pb-2">Mobile App</h4>
                                <p className="text-xs text-zinc-400">Delivers alerts, booking management, and navigation to service centers for vehicle owners.</p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-white font-bold text-sm uppercase border-b border-white/10 pb-2">OEM Dashboard</h4>
                                <p className="text-xs text-zinc-400">Fleet-wide health monitoring. Identification of recurring defects to trigger CAPA (Corrective Action).</p>
                            </div>
                        </div>
                    </section>

                </main>
            </div>
        </div>
    );
}
