'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { SparklesIcon } from '@heroicons/react/24/outline';
import CuriosityTags from './CuriosityTags';

export default function SearchSection() {
    const router = useRouter();

    const handleAIAnalysis = () => {
        router.push('/ai');
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-2 sm:px-0">
            {/* Curiosity Tags */}
            <CuriosityTags />

            {/* AI Discovery Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex justify-center mt-6 sm:mt-8"
            >
                <motion.button
                    whileHover={{ y: -3, scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAIAnalysis}
                    className="flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl font-bold
                         bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-soft
                         border-2 border-neutral-500
                         hover:from-primary-700 hover:to-accent-700 hover:border-neutral-600
                         transition-all duration-300 min-h-[52px] sm:min-h-[60px]"
                    style={{
                        boxShadow: '0 8px 16px -4px oklch(0% 0 0 / 0.2), 0 4px 8px -2px oklch(0% 0 0 / 0.1), inset 0 2px 0 0 oklch(100% 0 0 / 0.15)'
                    }}
                >
                    <SparklesIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span>AI Discovery</span>
                </motion.button>
            </motion.div>
        </div>
    );
}
