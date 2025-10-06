'use client';

import { Suspense } from 'react';
import { InstantSearchNext } from 'react-instantsearch-nextjs';
import { Configure, useSearchBox } from 'react-instantsearch';
import { searchClient, ALGOLIA_INDEX_NAME } from '@/lib/algolia';
import SearchResults from '@/components/SearchResults';
import { AuthProvider } from '@/components/AuthProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

function SearchPageContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    return (
        <InstantSearchNext
            searchClient={searchClient}
            indexName={ALGOLIA_INDEX_NAME}
            future={{
                preserveSharedStateOnUnmount: true
            }}
        >
            <Configure hitsPerPage={12} query={initialQuery} />

            <main className="pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-8 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Search header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 sm:mb-12"
                    >
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
                            Discover Opportunities
                            {initialQuery && (
                                <span className="block text-xl sm:text-2xl text-foreground-light mt-2 sm:mt-3">
                                    Results for &quot;{initialQuery}&quot;
                                </span>
                            )}
                        </h1>

                        {/* Search bar */}
                        <SearchBoxComponent />
                    </motion.div>

                    {/* Results */}
                    <SearchResults />
                </div>
            </main>
        </InstantSearchNext>
    );
}

function SearchBoxComponent() {
    const { query, refine } = useSearchBox();
    const router = useRouter();

    const handleSearch = (value: string) => {
        refine(value);
        if (value) {
            router.push(`/search?q=${encodeURIComponent(value)}`, { scroll: false });
        }
    };

    return (
        <div className="relative group max-w-4xl">
            <div className="absolute inset-y-0 left-0 pl-6 sm:pl-7 flex items-center pointer-events-none z-10">
                <MagnifyingGlassIcon className="h-6 w-6 sm:h-7 sm:w-7 text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
            </div>

            <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Refine your search..."
                className="w-full pl-16 sm:pl-20 pr-8 sm:pr-10 py-5 sm:py-6 text-base sm:text-lg font-medium
                   bg-background-light rounded-comfort
                   border-2 border-neutral-400
                   focus:outline-none focus:border-primary-500 focus:bg-background-lighter
                   hover:border-neutral-500
                   transition-all duration-300 ease-out
                   placeholder:text-neutral-400 placeholder:font-normal"
                style={{
                    boxShadow: `inset 0 2px 4px 0 oklch(0% 0 0 / 0.05),
                      0 6px 12px -2px oklch(0% 0 0 / 0.08),
                      0 10px 20px -4px oklch(0% 0 0 / 0.05)`
                }}
            />
        </div>
    );
}

export default function SearchPage() {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-background">
                <Header />
                <Suspense fallback={
                    <div className="pt-32 sm:pt-40 text-center">
                        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
                        <p className="mt-4 text-foreground-light">Loading opportunities...</p>
                    </div>
                }>
                    <SearchPageContent />
                </Suspense>
                <Footer variant="minimal" />
            </div>
        </AuthProvider>
    );
}
