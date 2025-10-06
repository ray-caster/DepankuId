'use client';

import { useSearchBox } from 'react-instantsearch';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function SearchBar() {
    const { query, refine } = useSearchBox();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full max-w-4xl mx-auto"
        >
            <div className="relative group">
                {/* Icon with better spacing */}
                <div className="absolute inset-y-0 left-0 pl-7 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-7 w-7 text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
                </div>

                {/* Search input with depth */}
                <input
                    type="text"
                    value={query}
                    onChange={(e) => refine(e.target.value)}
                    placeholder="What are you curious about today?"
                    className="w-full pl-20 pr-10 py-7 text-lg font-medium
                     bg-background-light rounded-comfort
                     border-2 border-transparent
                     focus:outline-none focus:border-primary-400 focus:bg-background-lighter
                     transition-all duration-300 ease-out
                     placeholder:text-neutral-400 placeholder:font-normal"
                    style={{
                        boxShadow: `inset 0 2px 4px 0 oklch(0% 0 0 / 0.04),
                        0 4px 8px -2px oklch(0% 0 0 / 0.08),
                        0 8px 16px -4px oklch(0% 0 0 / 0.05)`
                    }}
                    autoFocus
                />
            </div>
        </motion.div>
    );
}

