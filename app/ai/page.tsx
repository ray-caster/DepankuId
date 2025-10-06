'use client';

import { useState, useRef, useEffect } from 'react';
import { AuthProvider } from '@/components/AuthProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { api, AIMessage } from '@/lib/api';
import { SparklesIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

export default function AIAnalysisPage() {
    const [messages, setMessages] = useState<AIMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);

    const scrollToBottom = () => {
        if (shouldScrollToBottom) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, shouldScrollToBottom]);

    useEffect(() => {
        // Send initial greeting
        setMessages([
            {
                role: 'assistant',
                content: "Hi! I'm here to help you discover opportunities that truly resonate with you. What kind of problems or topics make you curious?"
            }
        ]);
        // Don't auto-scroll on initial load
        setShouldScrollToBottom(false);
    }, []);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: AIMessage = {
            role: 'user',
            content: input.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        // Enable auto-scroll when user sends a message
        setShouldScrollToBottom(true);

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
        <AuthProvider>
            <div className="min-h-screen bg-background">
                <Header />

                <main className="pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-8">
                    <div className="max-w-5xl mx-auto">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-8 sm:mb-12"
                        >
                            <div className="inline-flex items-center gap-3 mb-4">
                                <div className="p-3 bg-primary-100 rounded-soft border-2 border-neutral-400"
                                    style={{
                                        boxShadow: '0 2px 4px -1px oklch(0% 0 0 / 0.08)'
                                    }}
                                >
                                    <SparklesIcon className="h-7 w-7 sm:h-8 sm:w-8 text-primary-700" />
                                </div>
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
                                AI Guided Discovery
                            </h1>
                            <p className="text-lg sm:text-xl text-foreground-light max-w-2xl mx-auto px-4">
                                Let&apos;s have a conversation to find opportunities that match your interests and goals
                            </p>
                        </motion.div>

                        {/* Chat Container */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-background-light rounded-comfort overflow-hidden border-2 border-neutral-400"
                            style={{
                                boxShadow: `inset 0 1px 0 0 oklch(100% 0 0 / 0.1),
                           0 8px 16px -4px oklch(0% 0 0 / 0.10),
                           0 12px 24px -6px oklch(0% 0 0 / 0.06)`
                            }}
                        >
                            {/* Messages */}
                            <div className="h-[500px] sm:h-[600px] overflow-y-auto p-4 sm:p-8 space-y-4 sm:space-y-6">
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
                                                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 sm:px-6 py-3 sm:py-4 border-2 ${message.role === 'user'
                                                    ? 'bg-primary-600 text-white border-neutral-500'
                                                    : 'bg-background-lighter text-foreground border-neutral-400'
                                                    }`}
                                                style={message.role === 'user' ? {
                                                    boxShadow: `inset 0 1px 0 0 oklch(100% 0 0 / 0.15),
                                     0 2px 4px 0 oklch(0% 0 0 / 0.1)`
                                                } : {
                                                    boxShadow: `inset 0 1px 0 0 oklch(100% 0 0 / 0.1),
                                     0 1px 3px 0 oklch(0% 0 0 / 0.04)`
                                                }}
                                            >
                                                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-medium">
                                                    {message.content}
                                                </p>
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
                                        <div className="bg-background-lighter rounded-2xl px-6 py-4 border-2 border-neutral-400">
                                            <div className="flex gap-2">
                                                <div className="w-2.5 h-2.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <div className="w-2.5 h-2.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <div className="w-2.5 h-2.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div
                                className="border-t-2 border-neutral-400 p-4 sm:p-6 bg-background-lighter"
                                style={{
                                    boxShadow: 'inset 0 1px 0 0 oklch(100% 0 0 / 0.1)'
                                }}
                            >
                                <div className="flex gap-3 sm:gap-4">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Share your thoughts and interests..."
                                        disabled={isLoading}
                                        className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-white border-2 border-neutral-400 rounded-soft 
                              focus:outline-none focus:border-primary-500 focus:bg-background-lighter
                              hover:border-neutral-500
                              transition-all disabled:opacity-50 font-medium text-sm sm:text-base"
                                        style={{
                                            boxShadow: 'inset 0 1px 3px 0 oklch(0% 0 0 / 0.05)'
                                        }}
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!input.trim() || isLoading}
                                        className="px-6 sm:px-8 py-3 sm:py-4 bg-primary-600 text-white rounded-soft font-bold text-sm sm:text-base border-2 border-neutral-500
                              hover:bg-primary-700 hover:border-neutral-600 active:scale-95 
                              transition-all disabled:opacity-50 disabled:cursor-not-allowed
                              flex items-center gap-2"
                                        style={{
                                            boxShadow: `inset 0 1px 0 0 oklch(100% 0 0 / 0.2),
                                 0 2px 4px 0 oklch(0% 0 0 / 0.15)`
                                        }}
                                    >
                                        <span className="hidden sm:inline">Send</span>
                                        <PaperAirplaneIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </main>
                <Footer variant="minimal" />
            </div>
        </AuthProvider>
    );
}
