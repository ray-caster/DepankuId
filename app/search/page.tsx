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

            <main className="pt-24 sm:pt-28 laptop:pt-32 pb-12 sm:pb-16 laptop:pb-20 px-4 sm:px-6 laptop:px-8 min-h-screen">
                <div className="max-w-6xl laptop:max-w-7xl mx-auto">
                    {/* Search header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 sm:mb-12"
                    >
                        <h1 className="text-sm sm:text-base laptop:text-lg font-bold text-foreground mb-1 sm:mb-2 laptop:mb-2">
                            Discover Opportunities
                            {initialQuery && (
                                <span className="block text-xs sm:text-sm laptop:text-base text-foreground-light mt-0.5 sm:mt-0.5 laptop:mt-1">
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
        <div className="relative group max-w-xl laptop:max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 laptop:pl-4 flex items-center pointer-events-none z-10">
                <MagnifyingGlassIcon className="h-3 w-3 sm:h-3 sm:w-3 laptop:h-4 laptop:w-4 text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
            </div>

            <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Refine your search..."
                className="w-full pl-7 sm:pl-8 laptop:pl-10 pr-3 sm:pr-4 laptop:pr-6 py-1.5 sm:py-2 laptop:py-2.5 text-xs sm:text-sm laptop:text-sm font-medium
                   bg-background-light rounded-comfort
                   border-2 border-neutral-400
                   focus:outline-none focus:border-primary-500 focus:bg-background-lighter
                   hover:border-neutral-500
                   transition-all duration-300 ease-out
                   placeholder:text-neutral-400 placeholder:font-normal"
                style={{
                    boxShadow: `inset 0 1px 2px 0 oklch(0% 0 0 / 0.05),
                      0 3px 6px -2px oklch(0% 0 0 / 0.08),
                      0 5px 10px -4px oklch(0% 0 0 / 0.05)`
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
