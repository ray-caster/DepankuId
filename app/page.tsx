'use client';

import { InstantSearchNext } from 'react-instantsearch-nextjs';
import { Configure } from 'react-instantsearch';
import { searchClient, ALGOLIA_INDEX_NAME } from '@/lib/algolia';
import SearchWithButtons from '@/components/SearchWithButtons';
import SearchSection from '@/components/SearchSection';
import Header from '@/components/Header';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import { motion } from 'framer-motion';
import { CheckCircleIcon, SparklesIcon, MagnifyingGlassIcon, AcademicCapIcon, UsersIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function HomeContent() {
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);
    const { user, loading } = useAuth();
    const router = useRouter();

    // Redirect logged-in users to dashboard
    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    const benefits = [
        {
            icon: MagnifyingGlassIcon,
            title: 'Find Opportunities Instantly',
            description: 'Search curated research programs, competitions, and communities in seconds.'
        },
        {
            icon: SparklesIcon,
            title: 'Personalized for You',
            description: 'Browse opportunities tailored to your interests and goals.'
        },
        {
            icon: AcademicCapIcon,
            title: 'Verified & Curated',
            description: 'Every opportunity is hand-picked and verified for quality.'
        }
    ];

    const stats = [
        { number: '500+', label: 'Opportunities' },
        { number: '50+', label: 'Universities' },
        { number: '20+', label: 'Countries' },
        { number: '100%', label: 'Free' }
    ];

    const testimonials = [
        {
            name: 'Sarah Chen',
            role: 'MIT Research Science Institute Participant',
            content: 'Depanku found the perfect research opportunity for my bioengineering interests.',
            avatar: '👩‍🔬'
        },
        {
            name: 'Ahmad Rizki',
            role: 'Google Code Jam Finalist',
            content: 'The search feature helped me discover competitions I would have missed.',
            avatar: '👨‍💻'
        },
        {
            name: 'Maya Putri',
            role: 'Youth Leadership Program Alumni',
            content: 'This platform made discovering leadership programs easy.',
            avatar: '👩‍🎓'
        }
    ];

    const faqs = [
        {
            question: 'Is Depanku.id free to use?',
            answer: 'Yes. Depanku.id is free for all students.'
        },
        {
            question: 'How do you verify opportunities?',
            answer: 'We review each opportunity. We check the organizer, verify deadlines, and ensure information is accurate.'
        },
        {
            question: 'How can I find opportunities that match my interests?',
            answer: 'Use our search and filter features to browse opportunities by category, type, location, and tags. You can also explore curated collections based on popular interests.'
        },
        {
            question: 'How often do you add new opportunities?',
            answer: 'We update daily with new research programs, competitions, and youth initiatives from Indonesia and worldwide.'
        },
        {
            question: 'Can I suggest opportunities?',
            answer: 'Yes. Submit opportunities through our contact form. We review and add them if they meet our standards.'
        }
    ];

    // Show loading state while checking auth
    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-neutral-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render home page for logged-in users (they'll be redirected)
    if (user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-16 md:pt-20">
                <InstantSearchNext
                    searchClient={searchClient}
                    indexName={ALGOLIA_INDEX_NAME}
                    future={{
                        preserveSharedStateOnUnmount: true
                    }}
                >
                    <Configure hitsPerPage={5} />

                    {/* Hero Section */}
                    <section className="h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
                        <div className="w-full max-w-7xl mx-auto text-center flex flex-col justify-center h-full py-8">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="text-[clamp(2rem,7vw,4rem)] sm:text-[clamp(2.5rem,6vw,4.5rem)] lg:text-[clamp(3rem,5.5vw,5rem)] font-bold text-foreground tracking-tight leading-[1.15] mb-4 sm:mb-5"
                            >
                                <div className="mb-2">Find your next{' '}
                                    <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                                        Life changing
                                    </span>
                                </div>
                                <div>
                                    Opportunity in{' '}
                                    <span className="bg-gradient-to-r from-accent-600 to-primary-600 bg-clip-text text-transparent">
                                        30 seconds
                                    </span>
                                </div>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-base sm:text-lg lg:text-xl text-foreground-light max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4"
                            >
                                Free platform for Indonesian students. Search 500+ verified research programs, competitions, and youth opportunities.
                            </motion.p>


                            {/* Search Bar */}
                            <div className="mb-4 sm:mb-6">
                                <SearchWithButtons />
                            </div>

                            {/* Popular Tags & Browse Button */}
                            <SearchSection />
                        </div>
                    </section>

                    {/* Benefits Section */}
                    <section className="py-10 sm:py-14 lg:py-16 bg-gradient-to-b from-background to-background-light border-y-2 border-neutral-400">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-[clamp(1.5rem,4vw,2.5rem)] font-bold text-center text-foreground mb-3 sm:mb-4"
                            >
                                Why Choose Depanku.id?
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-sm sm:text-base lg:text-lg text-foreground-light text-center max-w-3xl mx-auto mb-8 sm:mb-12 px-4"
                            >
                                We make finding opportunities simple, personalized, and free.
                            </motion.p>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                                {benefits.map((benefit, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group relative bg-background-light rounded-gentle p-6 sm:p-8 border-2 border-neutral-400 hover:border-primary-400 transition-all duration-300"
                                        style={{
                                            boxShadow: '0 4px 12px -2px oklch(0% 0 0 / 0.08), 0 2px 8px -2px oklch(0% 0 0 / 0.05)'
                                        }}
                                    >
                                        <benefit.icon className="w-10 h-10 sm:w-12 sm:h-12 text-primary-600 mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300" />
                                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-3 sm:mb-4">{benefit.title}</h3>
                                        <p className="text-sm sm:text-base lg:text-lg text-foreground-light leading-relaxed">{benefit.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Social Proof Section */}
                    <section className="py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8 bg-background-lighter border-y-2 border-neutral-400">
                        <div className="max-w-7xl mx-auto">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-[clamp(1.5rem,4vw,2.5rem)] font-bold text-center text-foreground mb-3 sm:mb-4"
                            >
                                Trusted by Students Worldwide
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-sm sm:text-base lg:text-lg text-foreground-light text-center max-w-3xl mx-auto mb-8 sm:mb-12"
                            >
                                Join thousands of students who found their perfect opportunity
                            </motion.p>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                                {testimonials.map((testimonial, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="relative bg-background-light rounded-gentle p-6 sm:p-8 border-2 border-neutral-400"
                                        style={{
                                            boxShadow: '0 8px 16px -4px oklch(0% 0 0 / 0.1), inset 0 2px 0 0 oklch(100% 0 0 / 0.1)'
                                        }}
                                    >
                                        <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">{testimonial.avatar}</div>
                                        <p className="text-sm sm:text-base lg:text-lg text-foreground-light mb-4 sm:mb-6 leading-relaxed italic">
                                            &quot;{testimonial.content}&quot;
                                        </p>
                                        <div>
                                            <p className="font-bold text-sm sm:text-base text-foreground">{testimonial.name}</p>
                                            <p className="text-xs sm:text-sm text-foreground-lighter">{testimonial.role}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8 bg-background-light border-y-2 border-neutral-400">
                        <div className="max-w-3xl mx-auto">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-[clamp(1.5rem,4vw,2.5rem)] font-bold text-center text-foreground mb-3 sm:mb-4"
                            >
                                Frequently Asked Questions
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-sm sm:text-base lg:text-lg text-foreground-light text-center mb-8 sm:mb-10"
                            >
                                Everything you need to know about Depanku.id
                            </motion.p>

                            <div className="space-y-3 sm:space-y-4">
                                {faqs.map((faq, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-background rounded-gentle border-2 border-neutral-400 overflow-hidden transition-all duration-300 hover:border-primary-400"
                                        style={{
                                            boxShadow: '0 2px 8px -2px oklch(0% 0 0 / 0.08)'
                                        }}
                                    >
                                        <button
                                            onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                                            className="w-full text-left px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-start sm:items-center hover:bg-neutral-50 transition-colors duration-200 min-h-[60px] sm:min-h-[68px]"
                                        >
                                            <span className="text-base sm:text-lg font-semibold text-foreground pr-4 sm:pr-8 leading-tight">{faq.question}</span>
                                            <span className="text-xl sm:text-2xl text-primary-600 flex-shrink-0 font-bold leading-none mt-0.5 sm:mt-0">
                                                {openFAQ === index ? '−' : '+'}
                                            </span>
                                        </button>
                                        {openFAQ === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="px-4 sm:px-6 pb-4 sm:pb-5"
                                            >
                                                <p className="text-sm sm:text-base lg:text-lg text-foreground-light leading-relaxed border-t border-neutral-200 pt-3 sm:pt-4">
                                                    {faq.answer}
                                                </p>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Final CTA Section */}
                    <section className="py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8 bg-background">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="max-w-5xl mx-auto text-center bg-gradient-to-br from-primary-600 to-accent-600 rounded-comfort p-6 sm:p-10 lg:p-12 border-2 border-neutral-400"
                            style={{
                                boxShadow: '0 20px 40px -8px oklch(0% 0 0 / 0.2), 0 8px 16px -4px oklch(0% 0 0 / 0.1), inset 0 2px 0 0 oklch(100% 0 0 / 0.1)'
                            }}
                        >
                            <h2 className="text-[clamp(1.5rem,5vw,2.75rem)] font-bold text-white mb-3 sm:mb-4 leading-tight">
                                Ready to Find Your Path?
                            </h2>
                            <p className="text-sm sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
                                Join thousands of students discovering life-changing opportunities. It&apos;s free, fast, and tailored to you.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-white text-primary-700 font-bold text-base sm:text-lg lg:text-xl px-6 sm:px-10 py-3.5 sm:py-4 lg:py-5 rounded-comfort transition-all duration-300 hover:bg-neutral-50 min-h-[52px] sm:min-h-[60px]"
                                style={{
                                    boxShadow: '0 8px 16px -4px oklch(0% 0 0 / 0.3), 0 4px 8px -2px oklch(0% 0 0 / 0.2)'
                                }}
                            >
                                <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                <span>Start Exploring Now</span>
                            </motion.button>
                        </motion.div>
                    </section>
                </InstantSearchNext>
            </main>

            {/* Enhanced Footer */}
            <footer
                className="border-t-2 border-neutral-400 py-10 sm:py-12 lg:py-16 bg-background-light"
                style={{
                    boxShadow: 'inset 0 2px 0 0 oklch(100% 0 0 / 0.1)'
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-10 lg:mb-12">
                        <div className="sm:col-span-2">
                            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">Depanku.id</h3>
                            <p className="text-sm sm:text-base text-foreground-light leading-relaxed max-w-md">
                                Find research programs, competitions, and youth opportunities across Indonesia.
                                Free platform for students and young professionals.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm sm:text-base text-foreground mb-3 sm:mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                <li><a href="/search" className="text-sm sm:text-base text-foreground-light hover:text-primary-600 transition-colors inline-block py-1">Browse Opportunities</a></li>
                                <li><a href="/features" className="text-sm sm:text-base text-foreground-light hover:text-primary-600 transition-colors inline-block py-1">Features</a></li>
                                <li><a href="/about" className="text-sm sm:text-base text-foreground-light hover:text-primary-600 transition-colors inline-block py-1">About Us</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm sm:text-base text-foreground mb-3 sm:mb-4">Support</h4>
                            <ul className="space-y-2">
                                <li><a href="#faq" className="text-sm sm:text-base text-foreground-light hover:text-primary-600 transition-colors inline-block py-1">FAQ</a></li>
                                <li><a href="/contact" className="text-sm sm:text-base text-foreground-light hover:text-primary-600 transition-colors inline-block py-1">Contact</a></li>
                                <li><a href="/privacy" className="text-sm sm:text-base text-foreground-light hover:text-primary-600 transition-colors inline-block py-1">Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-neutral-200 pt-6 sm:pt-8 text-center">
                        <p className="text-xs sm:text-sm text-foreground-lighter font-medium">
                            Built with care to help you find your path • Depanku.id © 2025
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default function Home() {
    return (
        <AuthProvider>
            <HomeContent />
        </AuthProvider>
    );
}
