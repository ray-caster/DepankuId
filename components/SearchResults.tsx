'use client';

import { useHits, useInstantSearch } from 'react-instantsearch';
import OpportunityCard from './OpportunityCard';
import { Opportunity } from '@/lib/api';
import { motion } from 'framer-motion';

export default function SearchResults() {
    const { hits } = useHits<Opportunity>();
    const { status } = useInstantSearch();

    // Show loading state while search is in progress
    if (status === 'loading' || status === 'stalled') {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
            >
                <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary-100 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                        Searching opportunities...
                    </h3>
                    <p className="text-neutral-600">
                        Please wait while we find the best matches for you
                    </p>
                </div>
            </motion.div>
        );
    }

    if (hits.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
            >
                <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
                        <svg
                            className="w-12 h-12 text-neutral-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                        No results found
                    </h3>
                    <p className="text-neutral-600">
                        Try adjusting your search or explore our tags below
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
        >
            {hits.map((hit) => (
                <OpportunityCard
                    key={hit.objectID || hit.id}
                    opportunity={{
                        ...hit,
                        id: hit.objectID || hit.id,
                    }}
                />
            ))}
        </motion.div>
    );
}

