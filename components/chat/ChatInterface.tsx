'use client';

import { useState, useRef, useEffect } from 'react';
import { AgentMessage, Anomaly, AnomalyDetectionResult } from '@/lib/agents/types';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInterfaceProps {
    anomalies?: Anomaly[];
    vehicleInfo?: any;
    analysisResult?: AnomalyDetectionResult;
    onScheduleRequest?: (date: string) => void;
}

export default function ChatInterface({ anomalies, vehicleInfo, analysisResult, onScheduleRequest }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<AgentMessage[]>([
        {
            id: '1',
            role: 'assistant',
            content: `Hello. I've analyzed the data and found ${anomalies?.length || 0} issues. How can I help you?`,
            agentName: 'chatbot',
            timestamp: Date.now(),
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage: AgentMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: Date.now(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    conversationHistory: messages,
                    anomalies,
                    vehicleInfo,
                    analysisResult // Pass full context
                }),
            });

            const data = await response.json();

            const assistantMessage: AgentMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response || data.message || "I'm not sure how to respond to that.",
                agentName: 'chatbot',
                timestamp: Date.now(),
            };

            setMessages(prev => [...prev, assistantMessage]);

            if (data.intent === 'scheduling' && data.extractedDate && onScheduleRequest) {
                onScheduleRequest(data.extractedDate);
            }
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: AgentMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Connection interrupted. Please try again.',
                agentName: 'chatbot',
                timestamp: Date.now(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
            setTimeout(scrollToBottom, 100);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="glass-panel w-full h-[500px] flex flex-col overflow-hidden rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl bg-[#08090A]/90">
            {/* Header */}
            <div className="p-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Assistant</h3>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                <AnimatePresence initial={false}>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`
                                    max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed
                                    ${message.role === 'user'
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'bg-white/10 text-foreground border border-white/5'
                                    }
                                `}
                            >
                                <p className="whitespace-pre-wrap">{message.content}</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                    >
                        <div className="bg-white/5 rounded-lg px-3 py-2 border border-white/5">
                            <div className="flex space-x-1">
                                <div className="w-1.5 h-1.5 bg-foreground-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-1.5 h-1.5 bg-foreground-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-1.5 h-1.5 bg-foreground-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-white/5 bg-white/[0.02]">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="w-full bg-black/20 text-foreground text-xs rounded-md pl-3 pr-10 py-2.5 border border-white/10 focus:outline-none focus:border-primary/50 transition-colors placeholder:text-foreground-muted"
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="absolute right-1.5 top-1.5 p-1 text-foreground-muted hover:text-primary transition-colors disabled:opacity-50"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
