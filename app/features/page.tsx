'use client';

import { AuthProvider } from '@/components/AuthProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import {
    MagnifyingGlassIcon,
    SparklesIcon,
    AcademicCapIcon,
    ClockIcon,
    GlobeAltIcon,
    ShieldCheckIcon,
    BoltIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';

export default function FeaturesPage() {
    const features = [
        {
            icon: MagnifyingGlassIcon,
            title: 'Find Opportunities in Seconds',
            description: 'Type your interests and see relevant research programs, competitions, and opportunities instantly.',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: SparklesIcon,
            title: 'Smart Search & Discovery',
            description: 'Our intelligent search helps you discover opportunities that match your interests and goals.',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: AcademicCapIcon,
            title: 'Only Quality Opportunities',
            description: 'Every opportunity is checked and verified. No spam, no fake programs. Real opportunities.',
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: ClockIcon,
            title: 'Never Miss Deadlines',
            description: 'Get the latest opportunities as soon as they\'re available. We update daily.',
            color: 'from-orange-500 to-amber-500'
        },
        {
            icon: GlobeAltIcon,
            title: 'Opportunities Worldwide',
            description: 'Find programs from top universities and organizations worldwide.',
            color: 'from-indigo-500 to-blue-500'
        },
        {
            icon: ShieldCheckIcon,
            title: 'Safe & Trusted',
            description: 'All opportunities are verified for safety. We check organizers and deadlines.',
            color: 'from-red-500 to-rose-500'
        },
        {
            icon: BoltIcon,
            title: 'Super Fast & Easy',
            description: 'Everything loads instantly and works smoothly. No waiting, no complicated steps.',
            color: 'from-yellow-500 to-orange-500'
        },
        {
            icon: UserGroupIcon,
            title: 'Completely Free',
            description: 'No hidden costs, no premium features locked away. Everything is free.',
            color: 'from-teal-500 to-cyan-500'
        }
    ];

    return (
        <AuthProvider>
            <div className="min-h-screen bg-background">
                <Header />

                <main className="pt-24 sm:pt-28 laptop:pt-32 pb-12 sm:pb-16 laptop:pb-20 px-4 sm:px-6 laptop:px-8">
                    <div className="max-w-6xl laptop:max-w-7xl mx-auto">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-8 sm:mb-12 laptop:mb-16"
                        >
                            <h1 className="text-3xl sm:text-4xl laptop:text-5xl desktop:text-6xl font-bold text-foreground mb-3 sm:mb-4 laptop:mb-6">
                                Everything You Need to{' '}
                                <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                                    Find Your Path
                                </span>
                            </h1>
                            <p className="text-base sm:text-lg laptop:text-xl text-foreground-light max-w-2xl laptop:max-w-3xl mx-auto">
                                Discover opportunities that match your interests and goals, all in one place
                            </p>
                        </motion.div>

                        {/* Features Grid */}
                        <div className="grid sm:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 gap-4 sm:gap-6 laptop:gap-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group bg-background-light rounded-gentle p-4 sm:p-6 laptop:p-8 border-2 border-neutral-400 hover:border-primary-400 transition-all duration-300"
                                    style={{
                                        boxShadow: '0 4px 12px -2px oklch(0% 0 0 / 0.08), 0 2px 8px -2px oklch(0% 0 0 / 0.05)'
                                    }}
                                >
                                    <div className={`inline-flex p-2 sm:p-3 rounded-soft bg-gradient-to-br ${feature.color} mb-3 sm:mb-4`}>
                                        <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 laptop:w-7 laptop:h-7 text-white" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl laptop:text-2xl font-bold text-foreground mb-2 sm:mb-3 group-hover:text-primary-700 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm laptop:text-base text-foreground-light leading-relaxed">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="mt-12 sm:mt-16 laptop:mt-24 text-center bg-gradient-to-br from-primary-600 to-accent-600 rounded-comfort p-6 sm:p-8 laptop:p-12 border-2 border-neutral-500"
                            style={{
                                boxShadow: '0 20px 40px -8px oklch(0% 0 0 / 0.2), 0 8px 16px -4px oklch(0% 0 0 / 0.1), inset 0 2px 0 0 oklch(100% 0 0 / 0.1)'
                            }}
                        >
                            <h2 className="text-2xl sm:text-3xl laptop:text-4xl font-bold text-white mb-3 sm:mb-4">
                                Ready to Find Your Opportunity?
                            </h2>
                            <p className="text-base sm:text-lg laptop:text-xl text-white/90 mb-6 sm:mb-8">
                                Start discovering opportunities that change your life
                            </p>
                            <motion.a
                                href="/"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center gap-2 sm:gap-3 bg-white text-primary-700 font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-comfort border-2 border-neutral-400 hover:bg-neutral-50 transition-all"
                                style={{
                                    boxShadow: '0 8px 16px -4px oklch(0% 0 0 / 0.3), 0 4px 8px -2px oklch(0% 0 0 / 0.2)'
                                }}
                            >
                                <SparklesIcon className="w-6 h-6" />
                                Start Exploring Now
                            </motion.a>
                        </motion.div>
                    </div>
                </main>

                <Footer />
            </div>
        </AuthProvider>
    );
}

