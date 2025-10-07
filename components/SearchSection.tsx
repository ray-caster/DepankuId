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
                className="flex justify-center mt-3 sm:mt-4"
            >
                <motion.button
                    whileHover={{ y: -2, scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAIAnalysis}
                    className="flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 text-sm sm:text-base md:text-lg font-bold
                         bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-soft
                         border-2 border-neutral-500
                         hover:from-primary-700 hover:to-accent-700 hover:border-neutral-600
                         transition-all duration-300 min-h-[44px] sm:min-h-[48px]"
                    style={{
                        boxShadow: '0 8px 16px -4px oklch(0% 0 0 / 0.2), 0 4px 8px -2px oklch(0% 0 0 / 0.1), inset 0 2px 0 0 oklch(100% 0 0 / 0.15)'
                    }}
                >
                    <SparklesIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Can&apos;t Decide? Let us pick!</span>
                </motion.button>
            </motion.div>
        </div>
    );
}
