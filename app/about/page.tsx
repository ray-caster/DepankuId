'use client';

import { AuthProvider } from '@/components/AuthProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { HeartIcon, LightBulbIcon, RocketLaunchIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

export default function AboutPage() {
    const values = [
        {
            icon: HeartIcon,
            title: 'Accessibility for All',
            description: 'We believe every student deserves access to life-changing opportunities, regardless of their background or resources.'
        },
        {
            icon: LightBulbIcon,
            title: 'Discovery Through Curiosity',
            description: 'We guide students to explore their passions through thoughtful questions, not just keyword matching.'
        },
        {
            icon: RocketLaunchIcon,
            title: 'Empowerment Through Technology',
            description: 'We leverage cutting-edge AI and search technology to make opportunity discovery simple and personalized.'
        },
        {
            icon: GlobeAltIcon,
            title: 'Global Community',
            description: 'We connect Indonesian students with opportunities worldwide, breaking down geographical barriers.'
        }
    ];

    return (
        <AuthProvider>
            <div className="min-h-screen bg-background">
                <Header />

                <main className="pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-8">
                    <div className="max-w-5xl mx-auto">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-12 sm:mb-16"
                        >
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4 sm:mb-6">
                                About{' '}
                                <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                                    Depanku.id
                                </span>
                            </h1>
                            <p className="text-lg sm:text-xl text-foreground-light max-w-3xl mx-auto">
                                Making meaningful opportunities accessible to every Indonesian student
                            </p>
                        </motion.div>

                        {/* Mission Statement */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-comfort p-8 sm:p-12 mb-12 sm:mb-16 border-2 border-primary-200"
                            style={{
                                boxShadow: '0 8px 16px -4px oklch(0% 0 0 / 0.1), inset 0 2px 0 0 oklch(100% 0 0 / 0.1)'
                            }}
                        >
                            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Our Mission</h2>
                            <p className="text-base sm:text-lg text-foreground-light leading-relaxed">
                                Depanku.id was born from a simple observation: talented Indonesian students often miss out on incredible opportunities—not because they lack ability, but because they don&apos;t know these opportunities exist. We&apos;re here to change that.
                            </p>
                            <p className="text-base sm:text-lg text-foreground-light leading-relaxed mt-4">
                                Our platform combines intelligent search technology with AI-powered guidance to help students discover research programs, competitions, and youth initiatives that align with their unique interests and goals. We believe that the right opportunity, discovered at the right time, can change everything.
                            </p>
                        </motion.div>

                        {/* Our Values */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mb-12 sm:mb-16"
                        >
                            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-8 text-center">Our Values</h2>
                            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                                {values.map((value, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 + index * 0.1 }}
                                        className="bg-background-light rounded-gentle p-6 sm:p-8 border-2 border-neutral-400"
                                        style={{
                                            boxShadow: '0 4px 12px -2px oklch(0% 0 0 / 0.08), 0 2px 8px -2px oklch(0% 0 0 / 0.05)'
                                        }}
                                    >
                                        <value.icon className="w-10 h-10 sm:w-12 sm:h-12 text-primary-600 mb-4" />
                                        <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">{value.title}</h3>
                                        <p className="text-sm sm:text-base text-foreground-light leading-relaxed">{value.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* The Story */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                            className="bg-background-light rounded-comfort p-8 sm:p-12 border-2 border-neutral-400 mb-12 sm:mb-16"
                            style={{
                                boxShadow: '0 8px 16px -4px oklch(0% 0 0 / 0.1), inset 0 2px 0 0 oklch(100% 0 0 / 0.1)'
                            }}
                        >
                            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">Why We Built This</h2>
                            <div className="space-y-4 text-base sm:text-lg text-foreground-light leading-relaxed">
                                <p>
                                    Too many brilliant students in Indonesia are limited by information asymmetry. While opportunities exist, they&apos;re scattered across countless websites, hidden in obscure announcements, or locked behind language barriers.
                                </p>
                                <p>
                                    We built Depanku.id to be the bridge—a single platform where students can:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Search through curated, verified opportunities instantly</li>
                                    <li>Get personalized recommendations through AI-powered conversations</li>
                                    <li>Access opportunities they never knew existed</li>
                                    <li>Find programs that match their unique interests and goals</li>
                                </ul>
                                <p className="pt-4">
                                    Best of all? It&apos;s completely free. Because opportunity should never have a paywall.
                                </p>
                            </div>
                        </motion.div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1 }}
                            className="text-center bg-gradient-to-br from-primary-600 to-accent-600 rounded-comfort p-8 sm:p-12 border-2 border-neutral-500"
                            style={{
                                boxShadow: '0 20px 40px -8px oklch(0% 0 0 / 0.2), 0 8px 16px -4px oklch(0% 0 0 / 0.1), inset 0 2px 0 0 oklch(100% 0 0 / 0.1)'
                            }}
                        >
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                                Join Our Community
                            </h2>
                            <p className="text-lg sm:text-xl text-white/90 mb-8">
                                Start discovering opportunities that can change your life
                            </p>
                            <motion.a
                                href="/"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center gap-3 bg-white text-primary-700 font-bold text-lg px-8 py-4 rounded-comfort border-2 border-neutral-400 hover:bg-neutral-50 transition-all"
                                style={{
                                    boxShadow: '0 8px 16px -4px oklch(0% 0 0 / 0.3), 0 4px 8px -2px oklch(0% 0 0 / 0.2)'
                                }}
                            >
                                Get Started
                            </motion.a>
                        </motion.div>
                    </div>
                </main>

                <Footer />
            </div>
        </AuthProvider>
    );
}

