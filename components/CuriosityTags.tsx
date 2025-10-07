'use client';

import { motion } from 'framer-motion';
import { useSearchBox } from 'react-instantsearch';

const tags = [
    { label: '#research', query: 'research academic study' },
    { label: '#stem', query: 'STEM science technology' },
    { label: '#coding', query: 'programming coding software' },
    { label: '#design', query: 'design creative arts' },
    { label: '#leadership', query: 'leadership management' },
];

export default function CuriosityTags() {
    const { refine } = useSearchBox();

    const handleTagClick = (query: string) => {
        refine(query);
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, scale: 0.8 },
        show: {
            opacity: 1,
            scale: 1,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 24,
            },
        },
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 justify-center max-w-4xl mx-auto mt-4 sm:mt-6 pb-2 sm:overflow-x-auto"
        >
            {tags.map((tag) => (
                <motion.button
                    key={tag.label}
                    variants={item}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTagClick(tag.query)}
                    className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-full whitespace-nowrap flex-shrink-0
                             bg-white/40 backdrop-blur-xl border border-neutral-200/60
                             text-foreground hover:bg-primary-50/60 hover:border-primary-300/60
                             hover:text-primary-700 transition-all duration-300 min-h-[44px]"
                    style={{
                        backdropFilter: 'blur(16px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                    }}
                >
                    {tag.label}
                </motion.button>
            ))}
        </motion.div>
    );
}

