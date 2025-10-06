'use client';

import { AuthProvider } from '@/components/AuthProvider';
import Header from '@/components/Header';
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
            title: 'Instant Search',
            description: 'Lightning-fast search powered by Algolia. Get results as you type with intelligent ranking and typo tolerance.',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: SparklesIcon,
            title: 'AI-Powered Discovery',
            description: 'Our Socratic AI guide asks the right questions to uncover opportunities that match your unique interests and goals.',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: AcademicCapIcon,
            title: 'Curated Opportunities',
            description: 'Every opportunity is hand-picked and verified by our team. Research programs, competitions, and youth initiatives worldwide.',
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: ClockIcon,
            title: 'Real-Time Updates',
            description: 'Daily database updates ensure you never miss a deadline. Get the latest opportunities as soon as they\'re available.',
            color: 'from-orange-500 to-amber-500'
        },
        {
            icon: GlobeAltIcon,
            title: 'Global Coverage',
            description: 'Opportunities from 20+ countries across 50+ universities and institutions. Access international programs from anywhere.',
            color: 'from-indigo-500 to-blue-500'
        },
        {
            icon: ShieldCheckIcon,
            title: 'Verified & Safe',
            description: 'All opportunities verified for legitimacy. We check organizers, deadlines, and ensure all information is accurate.',
            color: 'from-red-500 to-rose-500'
        },
        {
            icon: BoltIcon,
            title: 'Lightning Fast',
            description: 'Built with Next.js and optimized for performance. Sub-second load times and smooth 60fps animations.',
            color: 'from-yellow-500 to-orange-500'
        },
        {
            icon: UserGroupIcon,
            title: '100% Free',
            description: 'No hidden fees, no premium tiers. Our mission is to make opportunities accessible to everyone, regardless of background.',
            color: 'from-teal-500 to-cyan-500'
        }
    ];

    return (
        <AuthProvider>
            <div className="min-h-screen bg-background">
                <Header />

                <main className="pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-12 sm:mb-16"
                        >
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4 sm:mb-6">
                                Powerful Features to Help You{' '}
                                <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                                    Succeed
                                </span>
                            </h1>
                            <p className="text-lg sm:text-xl text-foreground-light max-w-3xl mx-auto">
                                Everything you need to discover, explore, and apply to life-changing opportunities
                            </p>
                        </motion.div>

                        {/* Features Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group bg-background-light rounded-gentle p-6 sm:p-8 border-2 border-neutral-400 hover:border-primary-400 transition-all duration-300"
                                    style={{
                                        boxShadow: '0 4px 12px -2px oklch(0% 0 0 / 0.08), 0 2px 8px -2px oklch(0% 0 0 / 0.05)'
                                    }}
                                >
                                    <div className={`inline-flex p-3 rounded-soft bg-gradient-to-br ${feature.color} mb-4`}>
                                        <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 group-hover:text-primary-700 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm sm:text-base text-foreground-light leading-relaxed">
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
                            className="mt-16 sm:mt-24 text-center bg-gradient-to-br from-primary-600 to-accent-600 rounded-comfort p-8 sm:p-12 border-2 border-neutral-500"
                            style={{
                                boxShadow: '0 20px 40px -8px oklch(0% 0 0 / 0.2), 0 8px 16px -4px oklch(0% 0 0 / 0.1), inset 0 2px 0 0 oklch(100% 0 0 / 0.1)'
                            }}
                        >
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                                Ready to Get Started?
                            </h2>
                            <p className="text-lg sm:text-xl text-white/90 mb-8">
                                Join thousands of students discovering their perfect opportunity
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
                                <SparklesIcon className="w-6 h-6" />
                                Start Exploring Now
                            </motion.a>
                        </motion.div>
                    </div>
                </main>
            </div>
        </AuthProvider>
    );
}

