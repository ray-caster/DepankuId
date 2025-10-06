'use client';

import { InstantSearchNext } from 'react-instantsearch-nextjs';
import { Configure } from 'react-instantsearch-nextjs';
import { searchClient, ALGOLIA_INDEX_NAME } from '@/lib/algolia';
import SearchWithButtons from '@/components/SearchWithButtons';
import SearchSection from '@/components/SearchSection';
import Header from '@/components/Header';
import { AuthProvider } from '@/components/AuthProvider';
import { motion } from 'framer-motion';
import { CheckCircleIcon, SparklesIcon, MagnifyingGlassIcon, AcademicCapIcon, UsersIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Home() {
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);

    const benefits = [
        {
            icon: MagnifyingGlassIcon,
            title: 'Find Opportunities Instantly',
            description: 'Search through curated research programs, competitions, and communities in seconds.'
        },
        {
            icon: SparklesIcon,
            title: 'AI-Powered Discovery',
            description: 'Let our intelligent guide ask the right questions to uncover opportunities you never knew existed.'
        },
        {
            icon: AcademicCapIcon,
            title: 'Verified & Curated',
            description: 'Every opportunity is hand-picked and verified to ensure quality and relevance.'
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
            content: 'Depanku helped me find the perfect research opportunity that matched my interests in bioengineering.',
            avatar: '👩‍🔬'
        },
        {
            name: 'Ahmad Rizki',
            role: 'Google Code Jam Finalist',
            content: 'The AI discovery feature guided me to competitions I would have never found on my own.',
            avatar: '👨‍💻'
        },
        {
            name: 'Maya Putri',
            role: 'Youth Leadership Program Alumni',
            content: 'This platform made it so easy to discover leadership programs tailored to my goals.',
            avatar: '👩‍🎓'
        }
    ];

    const faqs = [
        {
            question: 'Is Depanku.id free to use?',
            answer: 'Yes. Depanku.id is free for all students. We make opportunities accessible to everyone.'
        },
        {
            question: 'How do you verify opportunities?',
            answer: 'We manually review each opportunity. We check the organizer, verify deadlines, and ensure information is accurate.'
        },
        {
            question: 'How does AI discovery work?',
            answer: 'Our AI asks questions to understand your interests and goals. It finds opportunities that match your profile through conversation.'
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

    return (
        <AuthProvider>
            <div className="min-h-screen bg-background">
                <Header />

                <main className="pt-32 sm:pt-40">
                    <InstantSearchNext
                        searchClient={searchClient}
                        indexName={ALGOLIA_INDEX_NAME}
                        future={{
                            preserveSharedStateOnUnmount: true
                        }}
                    >
                        <Configure hitsPerPage={5} />

                        {/* Hero Section */}
                        <section className="min-h-[calc(100vh-18rem)] flex items-center max-w-7xl mx-auto px-4 sm:px-8 py-12">
                            <div className="w-full text-center">
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground tracking-tight leading-tight mb-6"
                                >
                                    <div>Find your next{' '}
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
                                    className="text-xl sm:text-2xl md:text-3xl text-foreground-light max-w-4xl mx-auto leading-relaxed mb-8"
                                >
                                    Free platform for Indonesian students. Search 500+ verified research programs, competitions, and youth opportunities.
                                </motion.p>

                                {/* Trust Indicators */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="flex flex-wrap justify-center gap-8 sm:gap-12 mb-8"
                                >
                                    {stats.map((stat, index) => (
                                        <div key={index} className="text-center">
                                            <div className="text-4xl sm:text-5xl font-bold text-primary-600">{stat.number}</div>
                                            <div className="text-lg text-foreground-lighter mt-1">{stat.label}</div>
                                        </div>
                                    ))}
                                </motion.div>

                                {/* Search Bar */}
                                <SearchWithButtons />

                                {/* Popular Tags & AI Discovery */}
                                <SearchSection />
                            </div>
                        </section>

                        {/* Benefits Section */}
                        <section className="mt-24 sm:mt-32 bg-gradient-to-b from-background to-background-light py-16 sm:py-24 border-y border-neutral-200">
                            <div className="max-w-7xl mx-auto px-4 sm:px-8">
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-foreground mb-6"
                                >
                                    Why Choose Depanku.id?
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="text-lg sm:text-xl text-foreground-light text-center max-w-3xl mx-auto mb-16"
                                >
                                    We make finding life-changing opportunities simple, personalized, and completely free.
                                </motion.p>

                                <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
                                    {benefits.map((benefit, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                            className="group relative bg-background-light rounded-gentle p-8 border-2 border-neutral-400 hover:border-primary-400 transition-all duration-300"
                                            style={{
                                                boxShadow: '0 4px 12px -2px oklch(0% 0 0 / 0.08), 0 2px 8px -2px oklch(0% 0 0 / 0.05)'
                                            }}
                                        >
                                            <benefit.icon className="w-12 h-12 text-primary-600 mb-6 group-hover:scale-110 transition-transform duration-300" />
                                            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">{benefit.title}</h3>
                                            <p className="text-base sm:text-lg text-foreground-light leading-relaxed">{benefit.description}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Social Proof Section */}
                        <section className="mt-24 sm:mt-32 px-4 sm:px-8">
                            <div className="max-w-7xl mx-auto">
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-foreground mb-4"
                                >
                                    Trusted by Students Worldwide
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="text-lg sm:text-xl text-foreground-light text-center max-w-3xl mx-auto mb-16"
                                >
                                    Join thousands of students who found their perfect opportunity
                                </motion.p>

                                <div className="grid md:grid-cols-3 gap-8">
                                    {testimonials.map((testimonial, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                            className="relative bg-background-light rounded-gentle p-8 border-2 border-neutral-400"
                                            style={{
                                                boxShadow: '0 8px 16px -4px oklch(0% 0 0 / 0.1), inset 0 2px 0 0 oklch(100% 0 0 / 0.1)'
                                            }}
                                        >
                                            <div className="text-5xl mb-4">{testimonial.avatar}</div>
                                            <p className="text-base sm:text-lg text-foreground-light mb-6 leading-relaxed italic">
                                                &quot;{testimonial.content}&quot;
                                            </p>
                                            <div>
                                                <p className="font-bold text-foreground">{testimonial.name}</p>
                                                <p className="text-sm text-foreground-lighter">{testimonial.role}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* FAQ Section */}
                        <section className="mt-24 sm:mt-32 px-4 sm:px-8 bg-background-light py-16 sm:py-24 border-y border-neutral-200">
                            <div className="max-w-4xl mx-auto">
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-foreground mb-4"
                                >
                                    Frequently Asked Questions
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="text-lg sm:text-xl text-foreground-light text-center mb-12"
                                >
                                    Everything you need to know about Depanku.id
                                </motion.p>

                                <div className="space-y-4">
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
                                                className="w-full text-left px-6 py-5 flex justify-between items-center hover:bg-neutral-50 transition-colors duration-200"
                                            >
                                                <span className="text-lg font-semibold text-foreground pr-8">{faq.question}</span>
                                                <span className="text-2xl text-primary-600 flex-shrink-0">
                                                    {openFAQ === index ? '−' : '+'}
                                                </span>
                                            </button>
                                            {openFAQ === index && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="px-6 pb-5"
                                                >
                                                    <p className="text-base sm:text-lg text-foreground-light leading-relaxed border-t border-neutral-200 pt-4">
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
                        <section className="mt-24 sm:mt-32 px-4 sm:px-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="max-w-5xl mx-auto text-center bg-gradient-to-br from-primary-600 to-accent-600 rounded-comfort p-12 sm:p-16 border-2 border-neutral-500"
                                style={{
                                    boxShadow: '0 20px 40px -8px oklch(0% 0 0 / 0.2), 0 8px 16px -4px oklch(0% 0 0 / 0.1), inset 0 2px 0 0 oklch(100% 0 0 / 0.1)'
                                }}
                            >
                                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                                    Ready to Find Your Path?
                                </h2>
                                <p className="text-xl sm:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
                                    Join thousands of students discovering life-changing opportunities. It&apos;s free, fast, and tailored to you.
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="inline-flex items-center gap-3 bg-white text-primary-700 font-bold text-lg sm:text-xl px-10 py-5 rounded-comfort transition-all duration-300 hover:bg-neutral-50"
                                    style={{
                                        boxShadow: '0 8px 16px -4px oklch(0% 0 0 / 0.3), 0 4px 8px -2px oklch(0% 0 0 / 0.2)'
                                    }}
                                >
                                    <SparklesIcon className="w-6 h-6" />
                                    Start Exploring Now
                                </motion.button>
                            </motion.div>
                        </section>
                    </InstantSearchNext>
                </main>

                {/* Enhanced Footer */}
                <footer
                    className="mt-24 border-t-2 border-neutral-200 py-12 sm:py-16 bg-background-light"
                    style={{
                        boxShadow: 'inset 0 2px 0 0 oklch(100% 0 0 / 0.1)'
                    }}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-8">
                        <div className="grid md:grid-cols-4 gap-12 mb-12">
                            <div className="md:col-span-2">
                                <h3 className="text-2xl font-bold text-foreground mb-4">Depanku.id</h3>
                                <p className="text-base text-foreground-light leading-relaxed max-w-md">
                                    Find research programs, competitions, and youth opportunities across Indonesia.
                                    Free platform for students and young professionals.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground mb-4">Quick Links</h4>
                                <ul className="space-y-2">
                                    <li><a href="/search" className="text-foreground-light hover:text-primary-600 transition-colors">Browse Opportunities</a></li>
                                    <li><a href="/ai" className="text-foreground-light hover:text-primary-600 transition-colors">AI Discovery</a></li>
                                    <li><a href="#" className="text-foreground-light hover:text-primary-600 transition-colors">About Us</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground mb-4">Support</h4>
                                <ul className="space-y-2">
                                    <li><a href="#" className="text-foreground-light hover:text-primary-600 transition-colors">FAQ</a></li>
                                    <li><a href="#" className="text-foreground-light hover:text-primary-600 transition-colors">Contact</a></li>
                                    <li><a href="#" className="text-foreground-light hover:text-primary-600 transition-colors">Privacy Policy</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-neutral-200 pt-8 text-center">
                            <p className="text-sm text-foreground-lighter font-medium">
                                Built with care to help you find your path • Depanku.id © 2025
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </AuthProvider>
    );
}
