'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './AuthProvider';
import {
    UserCircleIcon,
    MagnifyingGlassIcon,
    SparklesIcon,
    HomeIcon,
    CogIcon,
    InformationCircleIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    ShieldCheckIcon,
    ArrowRightOnRectangleIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthModal from './AuthModal';

export default function Header() {
    const { user, signOut } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navItems = [
        { href: '/', label: 'Home', icon: HomeIcon },
        { href: '/search', label: 'Browse', icon: MagnifyingGlassIcon },
        { href: '/ai', label: 'AI Discovery', icon: SparklesIcon },
        { href: '/features', label: 'Features', icon: CogIcon },
        { href: '/about', label: 'About Us', icon: InformationCircleIcon },
    ];

    const profileMenuItems = [
        { href: '/dashboard', label: 'Dashboard', icon: ChartBarIcon },
        { href: '/profile', label: 'My Profile', icon: UserCircleIcon },
        { href: '/settings', label: 'Settings', icon: Cog6ToothIcon },
    ];

    const isActive = (path: string) => pathname === path;

    const handleSignOut = async () => {
        await signOut();
        setShowProfileMenu(false);
        router.push('/');
    };

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

                    {/* CTA + Auth section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 sm:gap-3"
                    >
                        {/* Make Your Own Opportunity Button */}
                        <Link
                            href="/opportunities"
                            className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-soft
                                     bg-primary-600 text-white border-2 border-neutral-400
                                     hover:bg-primary-700 hover:border-neutral-500
                                     transition-all duration-300"
                            style={{
                                boxShadow: '0 4px 8px -2px oklch(0% 0 0 / 0.15), inset 0 1px 0 0 oklch(100% 0 0 / 0.1)'
                            }}
                        >
                            ✨ Make Your Own Opportunity!
                        </Link>

                        {user ? (
                            <div className="relative" ref={profileMenuRef}>
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-soft bg-background-light border-2 border-neutral-400
                                             hover:bg-background-lighter hover:border-neutral-500 transition-all duration-300"
                                    style={{
                                        boxShadow: '0 2px 4px -1px oklch(0% 0 0 / 0.08)'
                                    }}
                                >
                                    {user.photoURL ? (
                                        <div className="relative w-8 h-8">
                                            <Image
                                                src={user.photoURL}
                                                alt={user.displayName || 'User'}
                                                width={32}
                                                height={32}
                                                className="rounded-full ring-2 ring-primary-300"
                                            />
                                        </div>
                                    ) : (
                                        <UserCircleIcon className="w-8 h-8 text-neutral-400" />
                                    )}
                                    <span className="text-sm font-semibold text-foreground hidden sm:block max-w-[100px] truncate">
                                        {user.displayName}
                                    </span>
                                    <ChevronDownIcon className={`w-4 h-4 text-neutral-600 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Profile Dropdown */}
                                <AnimatePresence>
                                    {showProfileMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute right-0 mt-2 w-56 bg-white rounded-soft border-2 border-neutral-300 shadow-card overflow-hidden z-50"
                                        >
                                            {/* User Info */}
                                            <div className="px-4 py-3 border-b-2 border-neutral-200 bg-neutral-50">
                                                <p className="text-sm font-semibold text-foreground truncate">{user.displayName}</p>
                                                <p className="text-xs text-neutral-600 truncate">{user.email}</p>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="py-1">
                                                {profileMenuItems.map((item) => {
                                                    const Icon = item.icon;
                                                    return (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            onClick={() => setShowProfileMenu(false)}
                                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-primary-50 transition-colors"
                                                        >
                                                            <Icon className="w-5 h-5 text-neutral-600" />
                                                            {item.label}
                                                        </Link>
                                                    );
                                                })}
                                            </div>

                                            {/* Sign Out */}
                                            <div className="border-t-2 border-neutral-200">
                                                <button
                                                    onClick={handleSignOut}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowAuthModal(true)}
                                className="px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-bold rounded-soft
                                         bg-primary-600 text-white border-2 border-neutral-400
                                         hover:bg-primary-700 hover:border-neutral-500
                                         transition-all duration-300"
                                style={{
                                    boxShadow: '0 4px 8px -2px oklch(0% 0 0 / 0.15), inset 0 1px 0 0 oklch(100% 0 0 / 0.1)'
                                }}
                            >
                                Sign In
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
                                className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-3 py-2 rounded-soft font-medium transition-all duration-300 min-w-[60px]
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
                                        <Icon className="w-4 h-4" />
                                        <span className="text-xs whitespace-nowrap font-medium">{item.label}</span>
                                    </>
                                ) : (
                                    <span className="text-xs whitespace-nowrap font-medium py-1">{item.label}</span>
                                )}
                            </Link>
                        );
                    })}
                    {/* Mobile CTA */}
                    <Link
                        href="/opportunities"
                        className="flex-shrink-0 flex flex-col items-center gap-1.5 px-3 py-2 rounded-soft font-medium transition-all duration-300 min-w-[60px]
                                 bg-primary-600 text-white border-2 border-primary-500"
                        style={{
                            boxShadow: '0 4px 12px -2px oklch(0% 0 0 / 0.15), inset 0 1px 0 0 oklch(100% 0 0 / 0.1)'
                        }}
                    >
                        <SparklesIcon className="w-4 h-4" />
                        <span className="text-xs whitespace-nowrap font-medium">Create</span>
                    </Link>
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
