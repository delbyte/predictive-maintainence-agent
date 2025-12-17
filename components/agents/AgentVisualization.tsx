'use client';

import { AgentEvent, AgentType } from '@/lib/agents/types';
import { useRef, useState, useEffect, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { AnimatedBeam } from '@/components/ui/animated-beam';
import {
    BrainCircuit,
    FileSpreadsheet,
    AlertTriangle,
    Bell,
    Calendar,
    MessageSquare,
    Terminal,
    ChevronDown
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
    chatbot: { name: 'INTERFACE', color: '#a855f7', icon: MessageSquare },
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
    const [communicationDirection, setCommunicationDirection] = useState<'to_agent' | 'from_agent'>('to_agent');

    useEffect(() => {
        if (events.length === 0) return;

        const lastEvent = events[events.length - 1];

        // Determine active BEAM and Direction
        if (lastEvent.type === 'agent_started') {
            if (lastEvent.agentType !== 'master') {
                setActiveAgent(lastEvent.agentType);
                setCommunicationDirection('to_agent');
            } else {
                setActiveAgent('master');
            }
        } else if (lastEvent.type === 'agent_thinking') {
            if (lastEvent.agentType !== 'master') {
                setActiveAgent(lastEvent.agentType);
                setCommunicationDirection('to_agent');
            }
        } else if (lastEvent.type === 'agent_completed') {
            if (lastEvent.agentType !== 'master') {
                setActiveAgent(lastEvent.agentType);
                setCommunicationDirection('from_agent');
            } else {
                setActiveAgent('master');
            }
        }

        // Use a small timeout to ensure DOM update before scroll
        setTimeout(() => {
            logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);

    }, [events]);

    return (
        <div className="flex flex-col bg-surface border border-border h-full min-h-[600px] shadow-sm overflow-hidden">
            {/* Top: Schematic Visualizer */}
            <div className="relative h-[360px] bg-background border-b border-border overflow-hidden flex items-center justify-center p-6 shrink-0" ref={containerRef}>
                {/* Tech Background Grid */}
                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#a1a1aa 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                />

                <div className="relative w-full h-full max-w-[400px] flex flex-col justify-between z-10 py-4">
                    {/* Top Row: Master */}
                    <div className="flex justify-center">
                        <AgentNode
                            ref={masterRef}
                            id="master"
                            isActive={activeAgent === 'master' || activeAgent !== 'master'}
                        />
                    </div>

                    {/* Middle Row: Two Sides */}
                    <div className="flex justify-between items-center px-4 h-full py-4">
                        <div className="flex flex-col justify-center gap-12">
                            <AgentNode ref={csvRef} id="csv_analysis" isActive={activeAgent === 'csv_analysis'} />
                            <AgentNode ref={schedulingRef} id="scheduling" isActive={activeAgent === 'scheduling'} />
                        </div>
                        <div className="flex flex-col justify-center gap-12">
                            <AgentNode ref={anomalyRef} id="anomaly_detection" isActive={activeAgent === 'anomaly_detection'} />
                            <AgentNode ref={notificationRef} id="notification" isActive={activeAgent === 'notification'} />
                        </div>
                    </div>

                    {/* Bottom Row: Chat/Interface */}
                    <div className="flex justify-center">
                        <AgentNode ref={chatbotRef} id="chatbot" isActive={activeAgent === 'chatbot'} />
                    </div>
                </div>

                {/* Beams */}
                {Object.entries(refs).map(([id, ref]) => {
                    const isBeamActive = activeAgent === id;
                    const config = agentConfig[id as AgentType];
                    const isReverse = communicationDirection === 'from_agent';

                    return (
                        <AnimatedBeam
                            key={id}
                            containerRef={containerRef}
                            fromRef={masterRef}
                            toRef={ref}
                            curvature={0}
                            reverse={isReverse}
                            duration={2}
                            pathWidth={2}
                            pathColor="rgba(255, 255, 255, 0.1)"
                            pathOpacity={0.1}
                            gradientStartColor={isBeamActive ? config.color : 'transparent'}
                            gradientStopColor={isBeamActive ? config.color : 'transparent'}
                            delay={0}
                        />
                    );
                })}
            </div>

            {/* Bottom: Scrollable Log */}
            <div className="flex-1 flex flex-col min-h-0 bg-surface/30">
                <div className="px-4 py-2 border-b border-border bg-surface flex items-center justify-between shrink-0">
                    <span className="font-bold text-foreground-dim uppercase tracking-wider text-[10px] flex items-center gap-2">
                        <Terminal className="w-3 h-3" /> System Event Stream
                    </span>
                    <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500/20"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/20"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500/20"></span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-0 scroll-smooth custom-scrollbar relative">
                    <div className="absolute inset-0 p-4 space-y-3">
                        {events.length === 0 && (
                            <div className="text-center text-foreground-muted text-[10px] italic pt-10 opacity-50">
                                Awaiting process initialization...
                            </div>
                        )}
                        {events.map((e, i) => (
                            <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300 group">
                                <span className="text-foreground-dim/50 w-14 shrink-0 text-[10px] pt-0.5 font-mono select-none group-hover:text-foreground-dim transition-colors">
                                    {new Date(e.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                                <div className="flex-1 border-l border-border pl-3 relative">
                                    {/* Timeline Connector */}
                                    <div className="absolute -left-[1px] top-0 bottom-0 w-[1px] bg-border opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                    <div className={cn(
                                        "absolute -left-[3px] top-[6px] w-[5px] h-[5px] rounded-full border border-background",
                                        e.type === 'agent_failed' ? "bg-error" :
                                            e.type === 'agent_completed' ? "bg-success" : "bg-foreground-dim"
                                    )}></div>

                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className={cn(
                                            "text-[10px] font-bold uppercase tracking-wider",
                                            "text-foreground"
                                        )} style={{ color: agentConfig[e.agentType].color }}>
                                            {agentConfig[e.agentType].name}
                                        </span>
                                    </div>
                                    <p className={cn(
                                        "text-[11px] text-foreground-muted leading-relaxed font-mono",
                                        e.type === 'agent_failed' && "text-error"
                                    )}>
                                        {e.message}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div ref={logEndRef} className="h-4" />
                    </div>
                </div>
            </div>
        </div>
    );
}

const AgentNode = forwardRef<HTMLDivElement, { id: string, isActive?: boolean }>(({ id, isActive }, ref) => {
    const config = agentConfig[id as keyof typeof agentConfig];
    const Icon = config.icon;

    return (
        <div ref={ref} className="z-10 bg-background flex flex-col items-center justify-center gap-2 transition-transform duration-300">
            <div className={cn(
                "relative flex h-10 w-10 items-center justify-center bg-background border transition-all duration-300 rounded-sm",
                isActive ? "border-[1px] shadow-[0_0_15px_-5px_rgba(255,255,255,0.3)] scale-110" : "border-border text-foreground-muted opacity-80"
            )}
                style={{
                    borderColor: isActive ? config.color : undefined,
                    boxShadow: isActive ? `0 0 15px -5px ${config.color}` : undefined
                }}>
                <Icon className={cn("h-4 w-4 transition-colors", isActive ? "text-white" : "text-foreground-dim")} />

                {/* Corner markers for tech feel */}
                <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-current opacity-50"></div>
                <div className="absolute top-0 right-0 w-1 h-1 border-t border-r border-current opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-1 h-1 border-b border-l border-current opacity-50"></div>
                <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-current opacity-50"></div>
            </div>
            <span className={cn(
                "text-[9px] font-bold uppercase tracking-widest transition-colors",
                isActive ? "text-foreground" : "text-foreground-dim"
            )}>
                {config.name}
            </span>
        </div>
    )
});

AgentNode.displayName = "AgentNode";
