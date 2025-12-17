'use client';

import { AgentEvent, AgentType } from '@/lib/agents/types';
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AnimatedBeam } from '@/components/ui/animated-beam';
import {
    BrainCircuit,
    FileSpreadsheet,
    AlertTriangle,
    Bell,
    Calendar,
    MessageSquare,
    Activity,
    Terminal
} from 'lucide-react';

interface AgentVisualizationProps {
    events: AgentEvent[];
}

const agentConfig = {
    master: { name: 'ORCHESTRATOR', color: '#6366f1', icon: BrainCircuit },
    csv_analysis: { name: 'DATA_INGEST', color: '#3b82f6', icon: FileSpreadsheet },
    anomaly_detection: { name: 'INFERENCE', color: '#f59e0b', icon: AlertTriangle },
    notification: { name: 'DISPATCH', color: '#10b981', icon: Bell },
    scheduling: { name: 'SCHEDULER', color: '#ec4899', icon: Calendar },
    chatbot: { name: 'INTERFACE', color: '#a855f7', icon: MessageSquare }, // Changed color to match typical hex
};

export default function AgentVisualization({ events }: AgentVisualizationProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const masterRef = useRef<HTMLDivElement>(null);
    const csvRef = useRef<HTMLDivElement>(null);
    const anomalyRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);
    const schedulingRef = useRef<HTMLDivElement>(null);
    const chatbotRef = useRef<HTMLDivElement>(null);
    const logEndRef = useRef<HTMLDivElement>(null);

    // Refs map for dynamic iteration
    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
        'csv_analysis': csvRef,
        'anomaly_detection': anomalyRef,
        'notification': notificationRef,
        'scheduling': schedulingRef,
        'chatbot': chatbotRef
    };

    const [activeAgent, setActiveAgent] = useState<string>('master');
    const [agentStates, setAgentStates] = useState<Record<string, string>>({});

    useEffect(() => {
        if (events.length === 0) return;

        const lastEvent = events[events.length - 1];

        // Update states
        setAgentStates(prev => {
            const next = { ...prev };
            if (lastEvent.type === 'agent_started' || lastEvent.type === 'agent_thinking') {
                next[lastEvent.agentType] = 'active';
                if (lastEvent.agentType !== 'master') next['master'] = 'active';
            } else if (lastEvent.type === 'agent_completed') {
                next[lastEvent.agentType] = 'idle'; // completed implies back to idle/ready
            } else if (lastEvent.type === 'agent_failed') {
                next[lastEvent.agentType] = 'error';
            }
            return next;
        });

        // Determine active BEAM
        if (lastEvent.agentType !== 'master' && (lastEvent.type === 'agent_started' || lastEvent.type === 'agent_thinking')) {
            setActiveAgent(lastEvent.agentType);
        } else if (lastEvent.agentType === 'master') {
            setActiveAgent('master');
        }

        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    }, [events]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 bg-surface border border-border h-[500px]">
            {/* Schematic Visualizer */}
            <div className="lg:col-span-2 relative bg-background border-r border-border overflow-hidden flex items-center justify-center p-8" ref={containerRef}>
                {/* Tech Background Grid */}
                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#a1a1aa 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                />

                <div className="relative w-full h-full max-w-[600px] flex flex-col justify-between z-10">
                    {/* Top Row: Master */}
                    <div className="flex justify-center">
                        <AgentNode
                            ref={masterRef}
                            id="master"
                            state={agentStates['master']}
                        />
                    </div>

                    {/* Middle Row: Two Sides */}
                    <div className="flex justify-between items-center px-12">
                        <div className="flex flex-col gap-12">
                            <AgentNode ref={csvRef} id="csv_analysis" state={agentStates['csv_analysis']} />
                            <AgentNode ref={schedulingRef} id="scheduling" state={agentStates['scheduling']} />
                        </div>
                        <div className="flex flex-col gap-12">
                            <AgentNode ref={anomalyRef} id="anomaly_detection" state={agentStates['anomaly_detection']} />
                            <AgentNode ref={notificationRef} id="notification" state={agentStates['notification']} />
                        </div>
                    </div>

                    {/* Bottom Row: Chat/Interface */}
                    <div className="flex justify-center">
                        <AgentNode ref={chatbotRef} id="chatbot" state={agentStates['chatbot']} />
                    </div>
                </div>

                {/* Beams */}
                {Object.entries(refs).map(([id, ref]) => {
                    const isBeamActive = activeAgent === id;
                    const config = agentConfig[id as AgentType];

                    return (
                        <AnimatedBeam
                            key={id}
                            containerRef={containerRef}
                            fromRef={masterRef}
                            toRef={ref}
                            curve={0} // Straight lines for schematic feel
                            curvature={0}
                            duration={2}
                            pathWidth={2}
                            pathColor="var(--border)"
                            pathOpacity={0.4}
                            gradientStartColor={config.color}
                            gradientStopColor={config.color}
                            isActive={isBeamActive}
                        />
                    );
                })}
            </div>

            {/* Log */}
            <div className="bg-surface flex flex-col font-mono text-xs border-l border-border h-full">
                <div className="px-4 py-2 border-b border-border bg-surface-hover flex items-center justify-between">
                    <span className="font-bold text-foreground-dim uppercase tracking-wider">Event Stream</span>
                    <Terminal className="w-3.5 h-3.5 text-foreground-muted" />
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-background">
                    {events.map((e, i) => (
                        <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                            <span className="text-foreground-dim w-14 shrink-0 text-[10px] pt-0.5 opacity-70">
                                {new Date(e.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className={cn(
                                        "text-[10px] font-bold uppercase",
                                        agentConfig[e.agentType].color === '#6366f1' ? "text-primary" : "text-foreground" // Simplified for text colors or use style prop
                                    )} style={{ color: agentConfig[e.agentType].color }}>
                                        {agentConfig[e.agentType].name}
                                    </span>
                                </div>
                                <p className={cn(
                                    "text-foreground-muted leading-tight",
                                    e.type === 'agent_failed' && "text-error"
                                )}>
                                    {e.message}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={logEndRef} />
                </div>
            </div>
        </div>
    );
}

// Agent Node Component
import { forwardRef } from 'react';

const AgentNode = forwardRef<HTMLDivElement, { id: string, state?: string }>(({ id, state }, ref) => {
    const config = agentConfig[id as keyof typeof agentConfig];
    const Icon = config.icon;
    const isActive = state === 'active';
    const isError = state === 'error';

    return (
        <div ref={ref} className="relative z-20 flex flex-col items-center gap-2">
            <div className={cn(
                "w-12 h-12 flex items-center justify-center bg-background border transition-all duration-300",
                isActive ? "scale-110 shadow-[0_0_15px_-3px_rgba(0,0,0,0.3)]" : "scale-100",
                isActive ? "border-current" : "border-border text-foreground-dim",
                isError ? "border-error text-error" : ""
            )}
                style={{
                    borderColor: isActive ? config.color : undefined,
                    color: isActive ? config.color : undefined
                }}>
                <Icon className="w-5 h-5" />
            </div>
            <div className={cn(
                "px-2 py-0.5 bg-surface border text-[10px] font-bold uppercase tracking-widest transition-colors duration-300",
                isActive ? "text-foreground border-current" : "text-foreground-dim border-border"
            )}
                style={{ borderColor: isActive ? config.color : undefined }}>
                {config.name}
            </div>
        </div>
    )
});

AgentNode.displayName = "AgentNode";
