'use client';

import { useState, useEffect } from 'react';
import { useSearchBox, useHits } from 'react-instantsearch';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { Opportunity } from '@/lib/api';

export default function SearchWithButtons() {
    const { query, refine } = useSearchBox();
    const { hits } = useHits<Opportunity>();
    const router = useRouter();
    const [isFocused, setIsFocused] = useState(false);

    const topSuggestions = hits.slice(0, 8);
    const showSuggestions = isFocused && query.length > 0 && topSuggestions.length > 0;

    // Removed auto-navigation - user must press Enter or click suggestions

    const handleAIAnalysis = () => {
        router.push('/ai');
    };

    const handleSuggestionClick = (suggestionQuery: string) => {
        refine(suggestionQuery);
        router.push(`/search?q=${encodeURIComponent(suggestionQuery)}`);
        setIsFocused(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            setIsFocused(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-2 sm:px-0">
            <div className="relative">
                {/* Search Input */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-5 md:pl-7 flex items-center pointer-events-none z-10">
                        <MagnifyingGlassIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
                    </div>

                    <input
                        type="text"
                        value={query}
                        onChange={(e) => refine(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                        onKeyPress={handleKeyPress}
                        placeholder="What are you curious about?"
                        className="w-full pl-12 sm:pl-16 md:pl-20 pr-4 sm:pr-6 md:pr-10 py-4 sm:py-6 md:py-8 lg:py-10 text-base sm:text-lg md:text-xl lg:text-2xl font-medium
                       bg-background-light rounded-soft sm:rounded-gentle md:rounded-comfort
                       border-2 border-neutral-400
                       focus:outline-none focus:border-primary-500 focus:bg-background-lighter
                       hover:border-neutral-500
                       transition-all duration-300 ease-out
                       placeholder:text-neutral-400 placeholder:font-normal min-h-[56px] sm:min-h-[64px]"
                        style={{
                            boxShadow: `inset 0 2px 4px 0 oklch(0% 0 0 / 0.05),
                          0 6px 12px -2px oklch(0% 0 0 / 0.08),
                          0 10px 20px -4px oklch(0% 0 0 / 0.05)`
                        }}
                    />
                </div>

                {/* Suggestions Dropdown */}
                <AnimatePresence>
                    {showSuggestions && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute w-full mt-2 bg-white/50 backdrop-blur-xl rounded-soft sm:rounded-gentle md:rounded-comfort border border-neutral-200/60 overflow-hidden z-50 max-h-[60vh] overflow-y-auto"
                            style={{
                                boxShadow: `0 12px 32px -4px oklch(0% 0 0 / 0.12),
                           0 16px 48px -6px oklch(0% 0 0 / 0.08)`,
                                backdropFilter: 'blur(20px) saturate(180%)',
                                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                            }}
                        >
                            <div className="p-2 sm:p-3">
                                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2 px-2 sm:px-3">
                                    Top Suggestions
                                </p>
                                {topSuggestions.map((hit, index) => (
                                    <button
                                        key={hit.objectID || hit.id || index}
                                        onClick={() => handleSuggestionClick(hit.title)}
                                        className="w-full text-left px-3 sm:px-4 py-3 sm:py-3.5 rounded-soft hover:bg-primary-50 
                               transition-colors group/suggestion border-b border-neutral-200 last:border-b-0 min-h-[52px]"
                                    >
                                        <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                                            <MagnifyingGlassIcon className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 group-hover/suggestion:text-primary-600 mt-0.5 sm:mt-0 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-sm sm:text-base text-foreground group-hover/suggestion:text-primary-700 mb-0.5 sm:mb-1 line-clamp-1">
                                                    {hit.title}
                                                </div>
                                                <div className="text-xs sm:text-sm text-foreground-lighter line-clamp-1">
                                                    {hit.description}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Helper Text */}
                <p className="text-center text-xs sm:text-sm text-foreground-lighter mt-2 sm:mt-3 px-2">
                    Type to search or use AI for personalized recommendations
                </p>
            </div>
        </div>
    );
}

