'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useAuth } from './AuthProvider';
import { isAdmin } from '@/lib/adminCheck';
import {
    UserCircleIcon,
    MagnifyingGlassIcon,
    SparklesIcon,
    HomeIcon,
    CogIcon,
    InformationCircleIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    ChevronDownIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthModal from './AuthModal';

export default function Header() {
    const { user, signOut } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
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

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (showMobileMenu) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showMobileMenu]);

    const navItems = user ? [
        { href: '/', label: 'Home', icon: HomeIcon },
        { href: '/search', label: 'Browse', icon: MagnifyingGlassIcon },
        { href: '/features', label: 'Features', icon: CogIcon },
        { href: '/about', label: 'About Us', icon: InformationCircleIcon },
    ] : [
        { href: '/', label: 'Home', icon: HomeIcon },
        { href: '/search', label: 'Browse', icon: MagnifyingGlassIcon },
        { href: '/features', label: 'Features', icon: CogIcon },
        { href: '/about', label: 'About Us', icon: InformationCircleIcon },
        { href: '/admin', label: 'Admin', icon: Cog6ToothIcon },
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
        setShowMobileMenu(false);
        router.push('/');
    };

    const closeMobileMenu = () => {
        setShowMobileMenu(false);
    };

    return (
        <>
            <header
                className="fixed top-0 left-0 right-0 z-40 bg-background/98 backdrop-blur-xl border-b-2 border-neutral-400 safe-top"
                style={{
                    boxShadow: '0 4px 12px -2px oklch(0% 0 0 / 0.08), 0 2px 6px -1px oklch(0% 0 0 / 0.05)'
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        <div className="flex-shrink-0 z-10 relative">
                            <Link
                                href="/"
                                className="flex items-center gap-3 text-xl md:text-2xl font-bold text-primary-800 hover:text-primary-950 transition-all"
                            >
                                <Image
                                    src="/iconnobg.svg"
                                    alt="Depanku.id Logo"
                                    width={40}
                                    height={40}
                                    className="w-8 h-8 md:w-10 md:h-10"
                                />
                                <span>Depanku.id</span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
                            {navItems.map((item, index) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-2 px-3 xl:px-4 py-2.5 rounded-soft font-medium transition-all duration-200
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
                                        <Icon className="w-5 h-5" />
                                        <span className="text-sm">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Right Side - CTA + Auth */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* CTA Button - Hidden on small screens */}
                            <Link
                                href="/opportunities"
                                className="hidden xl:flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-soft
                                         bg-accent-600 text-white border-2 border-neutral-400
                                         hover:bg-accent-700 hover:border-neutral-500
                                         transition-all duration-300"
                                style={{
                                    boxShadow: '0 4px 8px -2px oklch(0% 0 0 / 0.15), inset 0 1px 0 0 oklch(100% 0 0 / 0.1)'
                                }}
                            >
                                <SparklesIcon className="w-5 h-5" />
                                <span className="whitespace-nowrap">Create Opportunity</span>
                            </Link>

                            {/* User Profile or Sign In */}
                            {user ? (
                                <div className="relative hidden lg:block" ref={profileMenuRef}>
                                    <button
                                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-soft bg-background-light border-2 border-neutral-400
                                                 hover:bg-background-lighter hover:border-neutral-500 transition-all duration-300 min-h-[44px]"
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
                                        <span className="text-sm font-semibold text-foreground max-w-[120px] truncate">
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
                                                className="absolute right-0 mt-2 w-56 bg-background-light rounded-soft border-2 border-neutral-300 shadow-card overflow-hidden z-[60]"
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
                                                                className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-primary-50 transition-colors min-h-[44px]"
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
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors min-h-[44px]"
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
                                    className="hidden lg:block px-6 py-2.5 text-sm font-bold rounded-soft
                                             bg-primary-600 text-white border-2 border-neutral-400
                                             hover:bg-primary-700 hover:border-neutral-500
                                             transition-all duration-300 min-h-[44px]"
                                    style={{
                                        boxShadow: '0 4px 8px -2px oklch(0% 0 0 / 0.15), inset 0 1px 0 0 oklch(100% 0 0 / 0.1)'
                                    }}
                                >
                                    Sign In
                                </button>
                            )}

                            {/* Hamburger Menu Button - Mobile Only */}
                            <button
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className="lg:hidden flex items-center justify-center w-12 h-12 rounded-soft bg-background-light border-2 border-neutral-400
                                         hover:bg-background-lighter hover:border-neutral-500 transition-all duration-200 active:bg-neutral-100 active:scale-95"
                                style={{
                                    boxShadow: '0 2px 4px -1px oklch(0% 0 0 / 0.08)'
                                }}
                                aria-label="Toggle menu"
                                aria-expanded={showMobileMenu}
                            >
                                {showMobileMenu ? (
                                    <XMarkIcon className="w-6 h-6 text-foreground" />
                                ) : (
                                    <Bars3Icon className="w-6 h-6 text-foreground" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

            </header>

            {/* Mobile Menu Overlay - Outside header to prevent clipping */}
            <AnimatePresence>
                {showMobileMenu && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"
                            onClick={closeMobileMenu}
                        />

                        {/* Mobile Menu Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                            className="fixed top-0 right-0 bottom-0 w-[90%] max-w-md bg-background border-l-2 border-neutral-400 z-[70] lg:hidden overflow-y-auto safe-top safe-bottom"
                            style={{
                                boxShadow: '-8px 0 32px -4px oklch(0% 0 0 / 0.25)'
                            }}
                        >
                            <div className="flex flex-col h-full">
                                {/* Mobile Menu Header */}
                                <div className="flex items-center justify-between p-5 border-b-2 border-neutral-400 bg-background-light">
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src="/iconnobg.svg"
                                            alt="Depanku.id Logo"
                                            width={32}
                                            height={32}
                                            className="w-8 h-8"
                                        />
                                        <span className="text-2xl font-bold text-primary-800">Menu</span>
                                    </div>
                                    <button
                                        onClick={closeMobileMenu}
                                        className="flex items-center justify-center w-11 h-11 rounded-soft bg-background border-2 border-neutral-400 hover:bg-neutral-100 active:bg-neutral-200 active:scale-95 transition-all"
                                        aria-label="Close menu"
                                    >
                                        <XMarkIcon className="w-6 h-6 text-foreground" />
                                    </button>
                                </div>

                                {/* User Info - If Logged In */}
                                {user && (
                                    <div className="p-5 border-b-2 border-neutral-400 bg-gradient-to-br from-primary-50 to-accent-50">
                                        <div className="flex items-center gap-4">
                                            {user.photoURL ? (
                                                <div className="relative w-14 h-14">
                                                    <Image
                                                        src={user.photoURL}
                                                        alt={user.displayName || 'User'}
                                                        width={56}
                                                        height={56}
                                                        className="rounded-full ring-2 ring-primary-400 shadow-md"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-14 h-14 rounded-full bg-primary-200 flex items-center justify-center">
                                                    <UserCircleIcon className="w-10 h-10 text-primary-600" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-base font-bold text-foreground truncate">{user.displayName}</p>
                                                <p className="text-sm text-neutral-700 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Links */}
                                <nav className="flex-1 p-5 space-y-2 overflow-y-auto">
                                    {navItems.map((item, index) => {
                                        const Icon = item.icon;
                                        const active = isActive(item.href);

                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={closeMobileMenu}
                                                className={`flex items-center gap-4 px-5 py-4 rounded-soft font-semibold transition-all duration-200 min-h-[56px] active:scale-98
                                                        ${active
                                                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white border-2 border-neutral-500 shadow-lg'
                                                        : 'bg-background-light text-foreground border-2 border-neutral-400 hover:border-primary-400 hover:bg-background-lighter active:bg-neutral-100'
                                                    }`}
                                                style={{
                                                    boxShadow: active
                                                        ? '0 6px 12px -2px oklch(0% 0 0 / 0.2), inset 0 2px 0 0 oklch(100% 0 0 / 0.15)'
                                                        : '0 2px 6px -1px oklch(0% 0 0 / 0.08)'
                                                }}
                                            >
                                                <Icon className="w-6 h-6 flex-shrink-0" />
                                                <span className="text-base">{item.label}</span>
                                            </Link>
                                        );
                                    })}

                                    {/* Divider */}
                                    <div className="py-3">
                                        <div className="border-t-2 border-neutral-300" />
                                    </div>

                                    {/* Create Opportunity CTA */}
                                    <Link
                                        href="/opportunities"
                                        onClick={closeMobileMenu}
                                        className="flex items-center gap-4 px-5 py-4 rounded-soft font-bold transition-all duration-200 min-h-[56px] active:scale-98
                                                     bg-gradient-to-r from-accent-600 to-accent-700 text-white border-2 border-neutral-500 hover:from-accent-700 hover:to-accent-800 shadow-lg"
                                        style={{
                                            boxShadow: '0 6px 12px -2px oklch(0% 0 0 / 0.25), inset 0 2px 0 0 oklch(100% 0 0 / 0.2)'
                                        }}
                                    >
                                        <SparklesIcon className="w-6 h-6 flex-shrink-0" />
                                        <span className="text-base">Create Opportunity</span>
                                    </Link>

                                    {/* User Menu Items - If Logged In */}
                                    {user && (
                                        <>
                                            <div className="py-3">
                                                <div className="border-t-2 border-neutral-300" />
                                            </div>
                                            {profileMenuItems.map((item, index) => {
                                                const Icon = item.icon;
                                                return (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={closeMobileMenu}
                                                        className="flex items-center gap-4 px-5 py-4 rounded-soft font-medium transition-all duration-200 min-h-[56px] active:scale-98
                                                                     bg-background-light text-foreground border-2 border-neutral-400 hover:border-primary-400 hover:bg-background-lighter active:bg-neutral-100"
                                                        style={{
                                                            boxShadow: '0 2px 6px -1px oklch(0% 0 0 / 0.08)'
                                                        }}
                                                    >
                                                        <Icon className="w-6 h-6 text-neutral-600 flex-shrink-0" />
                                                        <span className="text-base">{item.label}</span>
                                                    </Link>
                                                );
                                            })}
                                        </>
                                    )}
                                </nav>

                                {/* Bottom Actions */}
                                <div className="p-5 border-t-2 border-neutral-400 bg-background-light space-y-3">
                                    {user ? (
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full flex items-center justify-center gap-4 px-5 py-4 rounded-soft font-bold transition-all duration-200 min-h-[56px]
                                                         bg-gradient-to-r from-red-600 to-red-700 text-white border-2 border-neutral-500 hover:from-red-700 hover:to-red-800 active:scale-95 shadow-lg"
                                            style={{
                                                boxShadow: '0 6px 12px -2px oklch(0% 0 0 / 0.25), inset 0 2px 0 0 oklch(100% 0 0 / 0.2)'
                                            }}
                                        >
                                            <ArrowRightOnRectangleIcon className="w-6 h-6" />
                                            <span className="text-base">Sign Out</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setShowAuthModal(true);
                                                closeMobileMenu();
                                            }}
                                            className="w-full flex items-center justify-center gap-4 px-5 py-4 rounded-soft font-bold transition-all duration-200 min-h-[56px]
                                                         bg-gradient-to-r from-primary-600 to-primary-700 text-white border-2 border-neutral-500 hover:from-primary-700 hover:to-primary-800 active:scale-95 shadow-lg"
                                            style={{
                                                boxShadow: '0 6px 12px -2px oklch(0% 0 0 / 0.25), inset 0 2px 0 0 oklch(100% 0 0 / 0.2)'
                                            }}
                                        >
                                            <UserCircleIcon className="w-6 h-6" />
                                            <span className="text-base">Sign In</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSuccess={() => {
                    // Close modal and refresh auth state
                    setShowAuthModal(false);
                    router.refresh();
                }}
            />
        </>
    );
}
