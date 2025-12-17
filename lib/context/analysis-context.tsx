'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AgentEvent, AnomalyDetectionResult } from '@/lib/agents/types';

interface AnalysisContextType {
    analyzing: boolean;
    setAnalyzing: (val: boolean) => void;
    events: AgentEvent[];
    setEvents: (events: AgentEvent[] | ((prev: AgentEvent[]) => AgentEvent[])) => void; // Allow functional updates
    analysisResult: AnomalyDetectionResult | null;
    setAnalysisResult: (result: AnomalyDetectionResult | null) => void;
    clearAnalysis: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: ReactNode }) {
    const [analyzing, setAnalyzing] = useState(false);
    const [events, setEvents] = useState<AgentEvent[]>([]);
    const [analysisResult, setAnalysisResult] = useState<AnomalyDetectionResult | null>(null);

    const clearAnalysis = () => {
        setAnalyzing(false);
        setEvents([]);
        setAnalysisResult(null);
    };

    return (
        <AnalysisContext.Provider value={{
            analyzing,
            setAnalyzing,
            events,
            setEvents,
            analysisResult,
            setAnalysisResult,
            clearAnalysis
        }}>
            {children}
        </AnalysisContext.Provider>
    );
}

export function useAnalysis() {
    const context = useContext(AnalysisContext);
    if (context === undefined) {
        throw new Error('useAnalysis must be used within an AnalysisProvider');
    }
    return context;
}
