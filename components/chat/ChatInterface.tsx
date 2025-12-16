'use client';

import { useState, useRef, useEffect } from 'react';
import { AgentMessage, Anomaly } from '@/lib/agents/types';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInterfaceProps {
    anomalies?: Anomaly[];
    vehicleInfo?: any;
    onScheduleRequest?: (date: string) => void;
}

export default function ChatInterface({ anomalies, vehicleInfo, onScheduleRequest }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<AgentMessage[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Hello! I can help you understand the anomalies detected in your vehicle and schedule a maintenance appointment. How can I assist you?',
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
                }),
            });

            const data = await response.json();

            const assistantMessage: AgentMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response,
                agentName: 'chatbot',
                timestamp: Date.now(),
            };

            setMessages(prev => [...prev, assistantMessage]);

            // Handle schedule request
            if (data.intent === 'schedule_request' && data.extractedDate && onScheduleRequest) {
                onScheduleRequest(data.extractedDate);
            }
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: AgentMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                agentName: 'chatbot',
                timestamp: Date.now(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg flex flex-col h-[600px]">
            <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Maintenance Assistant</h3>
                <p className="text-sm text-gray-500">Ask me anything about your vehicle</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`
                  max-w-[80%] rounded-lg p-3
                  ${message.role === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-900'
                                    }
                `}
                            >
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                <p className="text-xs mt-1 opacity-70">
                                    {new Date(message.timestamp).toLocaleTimeString()}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg p-3">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
