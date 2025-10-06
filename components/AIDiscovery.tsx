'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, AIMessage } from '@/lib/api';
import { SparklesIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

export default function AIDiscovery() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<AIMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            // Send initial greeting
            setMessages([
                {
                    role: 'assistant',
                    content: "Hi! I'm here to help you discover opportunities that truly resonate with you. What kind of problems or topics make you curious?"
                }
            ]);
        }
    }, [isOpen, messages.length]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: AIMessage = {
            role: 'user',
            content: input.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await api.aiChat({
                message: userMessage.content,
                history: messages,
            });

            if (response.success && response.message) {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: 'assistant',
                        content: response.message!,
                    },
                ]);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Trigger Button with better depth */}
            <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-10 right-10 btn-primary flex items-center gap-3 z-40"
                style={{
                    boxShadow: `inset 0 1px 0 0 oklch(100% 0 0 / 0.3),
                      inset 0 -2px 0 0 oklch(0% 0 0 / 0.15),
                      0 8px 16px -4px oklch(0% 0 0 / 0.2),
                      0 16px 32px -8px oklch(0% 0 0 / 0.15)`
                }}
            >
                <SparklesIcon className="h-5 w-5" />
                <span className="font-bold">Guided Discovery</span>
            </motion.button>

            {/* Chat Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                        />

                        {/* Chat Window with depth */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed bottom-10 right-10 w-[480px] h-[680px] bg-background-light rounded-comfort z-50 flex flex-col overflow-hidden"
                            style={{
                                boxShadow: `inset 0 1px 0 0 oklch(100% 0 0 / 0.1),
                           0 20px 40px -10px oklch(0% 0 0 / 0.25),
                           0 10px 20px -5px oklch(0% 0 0 / 0.15)`
                            }}
                        >
                            {/* Header with depth */}
                            <div
                                className="bg-gradient-to-br from-primary-600 to-primary-800 text-white p-7"
                                style={{
                                    boxShadow: `inset 0 1px 0 0 oklch(100% 0 0 / 0.2),
                             inset 0 -1px 0 0 oklch(0% 0 0 / 0.2),
                             0 4px 8px 0 oklch(0% 0 0 / 0.1)`
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-white/20 rounded-soft">
                                            <SparklesIcon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Guided Discovery</h3>
                                            <p className="text-sm text-white/90 mt-0.5">Let&apos;s find what&apos;s right for you</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-soft transition-all"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <AnimatePresence>
                                    {messages.map((message, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[85%] rounded-2xl px-5 py-3.5 ${message.role === 'user'
                                                    ? 'bg-primary-600 text-white'
                                                    : 'bg-background-lighter text-foreground border border-neutral-200'
                                                    }`}
                                                style={message.role === 'user' ? {
                                                    boxShadow: `inset 0 1px 0 0 oklch(100% 0 0 / 0.15),
                                                               0 2px 4px 0 oklch(0% 0 0 / 0.1)`
                                                } : {
                                                    boxShadow: `inset 0 1px 0 0 oklch(100% 0 0 / 0.1),
                                                               0 1px 3px 0 oklch(0% 0 0 / 0.04)`
                                                }}
                                            >
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{message.content}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {isLoading && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex justify-start"
                                    >
                                        <div className="bg-neutral-100 rounded-2xl px-4 py-3">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input with depth */}
                            <div
                                className="border-t border-neutral-200 p-6 bg-background-lighter"
                                style={{
                                    boxShadow: 'inset 0 1px 0 0 oklch(100% 0 0 / 0.1)'
                                }}
                            >
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Share your thoughts..."
                                        disabled={isLoading}
                                        className="flex-1 px-5 py-3.5 bg-white border-2 border-neutral-200 rounded-soft 
                              focus:outline-none focus:border-primary-400 focus:bg-background-lighter
                              transition-all disabled:opacity-50 font-medium"
                                        style={{
                                            boxShadow: 'inset 0 1px 3px 0 oklch(0% 0 0 / 0.05)'
                                        }}
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!input.trim() || isLoading}
                                        className="px-5 py-3.5 bg-primary-600 text-white rounded-soft font-semibold
                              hover:bg-primary-700 active:scale-95 
                              transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{
                                            boxShadow: `inset 0 1px 0 0 oklch(100% 0 0 / 0.2),
                                 0 2px 4px 0 oklch(0% 0 0 / 0.15)`
                                        }}
                                    >
                                        <PaperAirplaneIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

