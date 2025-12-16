'use client';

import { Anomaly, AnomalyDetectionResult } from '@/lib/agents/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface AnomalyDisplayProps {
    result: AnomalyDetectionResult;
}

const severityConfig = {
    critical: { color: 'text-error', bg: 'bg-error/10', border: 'border-error/20', icon: '🚨' },
    high: { color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20', icon: '⚠️' },
    medium: { color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', icon: '⚡' },
    low: { color: 'text-foreground-muted', bg: 'bg-white/5', border: 'border-white/10', icon: 'ℹ️' },
};

export default function AnomalyDisplay({ result }: AnomalyDisplayProps) {
    const { anomalies, summary } = result;
    const [expandedId, setExpandedId] = useState<string | null>(null);

    if (anomalies.length === 0) {
        return (
            <div className="glass-panel rounded-xl p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4 icon-glow text-success">
                    <span className="text-2xl">✓</span>
                </div>
                <h3 className="text-lg font-medium text-foreground">All Systems Nominal</h3>
                <p className="text-sm text-foreground-muted mt-1 max-w-sm">
                    No anomalies were detected in the analyzed dataset.
                </p>
                <p className="text-xs text-foreground-muted mt-4 border-t border-border pt-4">
                    {summary}
                </p>
            </div>
        );
    }

    return (
        <div className="glass-panel rounded-xl overflow-hidden flex flex-col h-full">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-white/[0.02]">
                <div>
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Analysis Results</h3>
                    <p className="text-[10px] text-foreground-muted mt-0.5">{summary?.slice(0, 100)}...</p>
                </div>
                <div className="flex gap-2">
                    {['critical', 'high', 'medium', 'low'].map(severity => {
                        const count = anomalies.filter(a => a.severity === severity).length;
                        if (count === 0) return null;
                        const config = severityConfig[severity as keyof typeof severityConfig];
                        return (
                            <span key={severity} className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase border ${config.bg} ${config.color} ${config.border}`}>
                                {count} {severity}
                            </span>
                        )
                    })}
                </div>
            </div>

            <div className="overflow-auto custom-scrollbar p-6 space-y-3">
                {anomalies.map((anomaly, index) => {
                    const config = severityConfig[anomaly.severity];
                    const isExpanded = expandedId === anomaly.id;

                    return (
                        <motion.div
                            key={anomaly.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => setExpandedId(isExpanded ? null : anomaly.id)}
                            className={`
                                group relative border rounded-lg cursor-pointer transition-all duration-200
                                ${isExpanded ? 'bg-surface-highlight border-primary/30' : 'bg-transparent border-border hover:border-border-highlight hover:bg-white/[0.02]'}
                            `}
                        >
                            <div className="p-4 flex items-start gap-4">
                                <div className={`mt-0.5 text-lg ${isExpanded ? 'scale-110' : 'scale-100'} transition-transform duration-200`}>
                                    {config.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h4 className={`text-sm font-medium ${isExpanded ? 'text-primary' : 'text-foreground'}`}>
                                            {anomaly.type}
                                        </h4>
                                        <span className={`text-[10px] uppercase font-bold tracking-wider ${config.color}`}>
                                            {anomaly.severity}
                                        </span>
                                    </div>
                                    <p className="text-xs text-foreground-muted mt-1 line-clamp-1">{anomaly.description}</p>

                                    {/* Extended Details */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pt-4 mt-4 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                                    <div>
                                                        <span className="text-foreground-muted block mb-1 uppercase tracking-wider text-[10px]">Description</span>
                                                        <p className="text-foreground leading-relaxed">{anomaly.description}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-foreground-muted block mb-1 uppercase tracking-wider text-[10px]">Recommendation</span>
                                                        <p className="text-foreground leading-relaxed">{anomaly.recommendation}</p>
                                                    </div>
                                                    {anomaly.affectedComponent && (
                                                        <div className="col-span-2">
                                                            <span className="text-foreground-muted block mb-1 uppercase tracking-wider text-[10px]">Affected Component</span>
                                                            <code className="bg-black/30 px-2 py-1 rounded text-primary">{anomaly.affectedComponent}</code>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className={`text-foreground-muted transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                    ▼
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
