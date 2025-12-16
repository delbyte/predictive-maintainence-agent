'use client';

import { useState, useRef, useEffect } from 'react';
import { AgentMessage, Anomaly, AnomalyDetectionResult } from '@/lib/agents/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

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
            content: `System ready. I have access to the analysis of ${anomalies?.length || 0} items.`,
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
                    analysisResult
                }),
            });

            const data = await response.json();

            const assistantMessage: AgentMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response || data.message || "No response generated.",
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
                content: 'Error: Communication channel interrupted.',
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
        <div className="flex flex-col h-[600px] bg-[#09090b] border border-[#27272a] rounded-lg overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-[#27272a] bg-[#18181b] flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wide">AI Assistant</h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#09090b]">
                <AnimatePresence initial={false}>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "flex gap-3 max-w-[90%]",
                                message.role === 'user' ? "ml-auto flex-row-reverse" : ""
                            )}
                        >
                            <div className={cn(
                                "w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5",
                                message.role === 'user' ? "bg-[#27272a]" : "bg-primary"
                            )}>
                                {message.role === 'user' ? <User className="w-3 h-3 text-zinc-400" /> : <Bot className="w-3 h-3 text-white" />}
                            </div>

                            <div className={cn(
                                "rounded px-3 py-2 text-xs leading-relaxed border",
                                message.role === 'user'
                                    ? "bg-[#18181b] border-[#27272a] text-zinc-200"
                                    : "bg-[#1c1c20] border-[#27272a] text-zinc-300"
                            )}>
                                <p className="whitespace-pre-wrap">{message.content}</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3"
                    >
                        <div className="w-6 h-6 rounded bg-[#27272a] flex items-center justify-center shrink-0">
                            <RefreshCw className="w-3 h-3 text-zinc-500 animate-spin" />
                        </div>
                        <div className="text-xs text-zinc-500 py-1.5 animate-pulse">Processing...</div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-[#27272a] bg-[#18181b]">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter command or query..."
                        className="w-full bg-[#09090b] text-zinc-200 text-xs rounded border border-[#27272a] pl-3 pr-10 py-3 focus:outline-none focus:border-primary/50 transition-colors placeholder:text-zinc-600 font-mono"
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="absolute right-2 top-2 p-1 text-zinc-500 hover:text-primary transition-colors disabled:opacity-50"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
