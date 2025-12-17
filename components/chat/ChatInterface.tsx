'use client';

import 'regenerator-runtime/runtime';
import { useState, useRef, useEffect } from 'react';
import { AgentMessage, Anomaly, AnomalyDetectionResult } from '@/lib/agents/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, RefreshCw, AlertCircle, Mic, MicOff, Volume2, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

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
    const [isSpeaking, setIsSpeaking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Sync speech transcript with input
    useEffect(() => {
        if (transcript) {
            setInput(transcript);
        }
    }, [transcript]);

    const speakResponse = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop any current speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            // Optional: Select a specific voice if available
            // const voices = window.speechSynthesis.getVoices();
            // utterance.voice = voices.find(v => v.lang.includes('en')) || null;
            window.speechSynthesis.speak(utterance);
        }
    };

    const stopSpeaking = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    const handleMicToggle = () => {
        if (listening) {
            SpeechRecognition.stopListening();
        } else {
            resetTranscript();
            SpeechRecognition.startListening({ continuous: true });
        }
    };

    const handleSend = async () => {
        if ((!input.trim() && !transcript) || loading) return;

        const content = input || transcript;
        SpeechRecognition.stopListening(); // Stop listening on send

        const userMessage: AgentMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: content,
            timestamp: Date.now(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        resetTranscript();
        setLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: content,
                    conversationHistory: messages,
                    anomalies,
                    vehicleInfo,
                    analysisResult
                }),
            });

            const data = await response.json();
            console.log('[ChatInterface] API response:', data);
            const responseText = data.response || data.message || "No response generated.";

            const assistantMessage: AgentMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseText,
                agentName: 'chatbot',
                timestamp: Date.now(),
            };

            setMessages(prev => [...prev, assistantMessage]);
            speakResponse(responseText);

            // Check for scheduling intent - chatbot returns 'schedule_request' 
            console.log('[ChatInterface] Intent:', data.intent, 'ExtractedDate:', data.extractedDate);
            if ((data.intent === 'schedule_request' || data.intent === 'scheduling') && data.extractedDate && onScheduleRequest) {
                console.log('[ChatInterface] Triggering onScheduleRequest with date:', data.extractedDate);
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

    if (!browserSupportsSpeechRecognition) {
        console.warn("Browser does not support speech recognition.");
    }

    return (
        <div className="flex flex-col h-[600px] bg-[#09090b] border border-[#27272a] rounded-lg overflow-hidden relative">
            {/* Header */}
            <div className="p-4 border-b border-[#27272a] bg-[#18181b] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-2 rounded-full animate-pulse", listening ? "bg-red-500" : "bg-emerald-500")} />
                    <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wide">
                        {listening ? "Listening..." : isSpeaking ? "Speaking..." : "AI Assistant"}
                    </h3>
                </div>
                {isSpeaking && (
                    <button onClick={stopSpeaking} className="p-1 hover:bg-white/10 rounded-full transition-colors" title="Stop Speaking">
                        <Square className="w-4 h-4 text-zinc-400 fill-current" />
                    </button>
                )}
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
                                "rounded px-3 py-2 text-xs leading-relaxed border relative group",
                                message.role === 'user'
                                    ? "bg-[#18181b] border-[#27272a] text-zinc-200"
                                    : "bg-[#1c1c20] border-[#27272a] text-zinc-300"
                            )}>
                                <p className="whitespace-pre-wrap">{message.content}</p>
                                {message.role === 'assistant' && (
                                    <button
                                        onClick={() => speakResponse(message.content)}
                                        className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-zinc-500 hover:text-white"
                                    >
                                        <Volume2 className="w-3 h-3" />
                                    </button>
                                )}
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
            <div className={cn("p-3 border-t border-[#27272a] bg-[#18181b] transition-colors", listening && "bg-red-500/10 border-red-500/30")}>
                <div className="relative flex items-center gap-2">
                    <button
                        onClick={handleMicToggle}
                        className={cn(
                            "p-2 rounded-full transition-colors flex-shrink-0",
                            listening
                                ? "bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                                : "bg-[#27272a] text-zinc-400 hover:text-white hover:bg-[#3f3f46]"
                        )}
                        title={listening ? "Stop Listening" : "Start Voice Input"}
                    >
                        {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>

                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={listening ? "Listening..." : "Enter command or query..."}
                            className="w-full bg-[#09090b] text-zinc-200 text-xs rounded border border-[#27272a] pl-3 pr-10 py-3 focus:outline-none focus:border-primary/50 transition-colors placeholder:text-zinc-600 font-mono"
                            disabled={loading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading || (!input.trim() && !transcript)}
                            className="absolute right-2 top-2 p-1 text-zinc-500 hover:text-primary transition-colors disabled:opacity-50"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
            {/* Listening Overlay/Indicator */}
            <AnimatePresence>
                {listening && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center pointer-events-none"
                    >
                        <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
                            <Mic className="w-10 h-10 text-red-500" />
                        </div>
                        <p className="mt-4 text-zinc-200 font-bold tracking-widest text-sm">LISTENING</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
