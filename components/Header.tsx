'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from './AuthProvider';
import { UserCircleIcon, MagnifyingGlassIcon, SparklesIcon, HomeIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import AuthModal from './AuthModal';

export default function Header() {
    const { user, signOut } = useAuth();
    const pathname = usePathname();
    const [showAuthModal, setShowAuthModal] = useState(false);

    const navItems = [
        { href: '/', label: 'Home', icon: HomeIcon },
        { href: '/search', label: 'Browse', icon: MagnifyingGlassIcon },
        { href: '/ai', label: 'AI Discovery', icon: SparklesIcon },
        { href: '/features', label: 'Features', icon: null },
        { href: '/about', label: 'About Us', icon: null },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b-2 border-neutral-400"
            style={{
                boxShadow: '0 4px 12px -2px oklch(0% 0 0 / 0.08), 0 2px 6px -1px oklch(0% 0 0 / 0.05)'
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-4">
                <div className="flex items-center justify-between gap-3 sm:gap-4">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-shrink-0"
                    >
                        <Link
                            href="/"
                            className="text-lg sm:text-xl md:text-2xl font-bold text-primary-800 hover:text-primary-950 transition-all"
                        >
                            Depanku.id
                        </Link>
                    </motion.div>

                    {/* Navigation - Desktop */}
                    <nav className="hidden lg:flex items-center gap-2">
                        {navItems.map((item, index) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);

                            return (
                                <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-soft font-medium transition-all duration-300
                                            ${active
                                                ? 'bg-primary-600 text-white border-2 border-neutral-500'
                                                : 'bg-background-light text-foreground-light border-2 border-neutral-400 hover:border-neutral-500 hover:bg-background-lighter'
                                            }`}
                                        style={{
                                            boxShadow: active
                                                ? '0 4px 8px -2px oklch(0% 0 0 / 0.15), inset 0 1px 0 0 oklch(100% 0 0 / 0.1)'
                                                : '0 2px 4px -1px oklch(0% 0 0 / 0.08)'
                                        }}
                                    >
                                        {Icon && <Icon className="w-5 h-5" />}
                                        <span className="text-sm">{item.label}</span>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </nav>

                    {/* Auth section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 sm:gap-3"
                    >
                        {user ? (
                            <>
                                <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-soft bg-background-light border-2 border-neutral-400"
                                    style={{
                                        boxShadow: '0 2px 4px -1px oklch(0% 0 0 / 0.08)'
                                    }}
                                >
                                    {user.photoURL ? (
                                        <div className="relative w-6 h-6 sm:w-8 sm:h-8">
                                            <Image
                                                src={user.photoURL}
                                                alt={user.displayName || 'User'}
                                                width={32}
                                                height={32}
                                                className="rounded-full ring-2 ring-primary-300"
                                            />
                                        </div>
                                    ) : (
                                        <UserCircleIcon className="w-6 h-6 sm:w-8 sm:h-8 text-neutral-400" />
                                    )}
                                    <span className="text-xs sm:text-sm font-semibold text-foreground hidden sm:block max-w-[100px] truncate">
                                        {user.displayName}
                                    </span>
                                </div>
                                <button
                                    onClick={signOut}
                                    className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-soft
                                             bg-white text-foreground border-2 border-neutral-400
                                             hover:bg-neutral-50 hover:border-neutral-500
                                             transition-all duration-300"
                                    style={{
                                        boxShadow: '0 2px 4px -1px oklch(0% 0 0 / 0.08), inset 0 1px 0 0 oklch(100% 0 0 / 0.05)'
                                    }}
                                >
                                    <span className="hidden sm:inline">Sign Out</span>
                                    <span className="sm:hidden">Out</span>
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setShowAuthModal(true)}
                                className="px-3 sm:px-6 py-1.5 sm:py-2.5 text-xs sm:text-sm font-bold rounded-soft
                                         bg-primary-600 text-white border-2 border-neutral-500
                                         hover:bg-primary-700 hover:border-neutral-600
                                         transition-all duration-300"
                                style={{
                                    boxShadow: '0 4px 8px -2px oklch(0% 0 0 / 0.15), inset 0 1px 0 0 oklch(100% 0 0 / 0.1)'
                                }}
                            >
                                <span className="hidden sm:inline">Sign In</span>
                                <span className="sm:hidden">Sign In</span>
                            </button>
                        )}
                    </motion.div>
                </div>

                {/* Mobile Navigation */}
                <nav className="lg:hidden flex items-center gap-2 mt-4 pb-2 overflow-x-auto px-2 -mx-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-soft font-medium transition-all duration-300 min-w-[70px]
                                    ${active
                                        ? 'bg-primary-600 text-white border-2 border-primary-500 shadow-lg'
                                        : 'bg-background-light text-foreground-light border-2 border-neutral-300 hover:border-neutral-400 hover:bg-background-lighter'
                                    }`}
                                style={{
                                    boxShadow: active
                                        ? '0 4px 12px -2px oklch(0% 0 0 / 0.15), inset 0 1px 0 0 oklch(100% 0 0 / 0.1)'
                                        : '0 2px 6px -1px oklch(0% 0 0 / 0.08)'
                                }}
                            >
                                {Icon ? (
                                    <>
                                        <Icon className="w-5 h-5" />
                                        <span className="text-xs whitespace-nowrap font-medium">{item.label}</span>
                                    </>
                                ) : (
                                    <span className="text-xs whitespace-nowrap font-medium py-1">{item.label}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSuccess={() => {
                    // Refresh user state
                    window.location.reload();
                }}
            />
        </header>
    );
}
