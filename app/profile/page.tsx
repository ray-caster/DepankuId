'use client';

import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import {
    UserCircleIcon,
    MapPinIcon,
    LinkIcon,
    CalendarIcon,
    BookmarkIcon,
    PencilIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

function ProfileContent() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [profileData, setProfileData] = useState({
        bio: 'Passionate student exploring opportunities in STEM and research.',
        website: '',
        location: 'Jakarta, Indonesia',
        joinedDate: 'January 2025',
        bookmarksCount: 0,
    });

    useEffect(() => {
        // TODO: Fetch user profile data from backend
        if (user) {
            // Load profile data
        }
    }, [user]);

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

    if (!user) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="pt-32 text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-3xl font-bold mb-4">Profile</h1>
                        <p className="text-neutral-600 mb-6">Please sign in to view your profile</p>
                        <div className="text-4xl mb-4">🔒</div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-24 pb-16 px-4 sm:px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Profile Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card mb-6"
                    >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            {/* Profile Picture */}
                            <div className="relative">
                                {user.photoURL ? (
                                    <Image
                                        src={user.photoURL}
                                        alt={user.displayName || 'User'}
                                        width={120}
                                        height={120}
                                        className="rounded-full ring-4 ring-primary-300"
                                    />
                                ) : (
                                    <UserCircleIcon className="w-30 h-30 text-neutral-400" />
                                )}
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h1 className="text-3xl font-bold text-foreground mb-1">
                                            {user.displayName}
                                        </h1>
                                        <p className="text-neutral-600 mb-3">{user.email}</p>
                                    </div>
                                    <Link
                                        href="/settings"
                                        className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-soft transition-colors text-sm font-semibold"
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                        Edit Profile
                                    </Link>
                                </div>

                                {profileData.bio && (
                                    <p className="text-foreground-light mb-4">{profileData.bio}</p>
                                )}

                                <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                                    {profileData.location && (
                                        <div className="flex items-center gap-1">
                                            <MapPinIcon className="w-4 h-4" />
                                            {profileData.location}
                                        </div>
                                    )}
                                    {profileData.website && (
                                        <a
                                            href={profileData.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-primary-600 hover:text-primary-700"
                                        >
                                            <LinkIcon className="w-4 h-4" />
                                            Website
                                        </a>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <CalendarIcon className="w-4 h-4" />
                                        Joined {profileData.joinedDate}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="card"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary-100 rounded-soft">
                                    <BookmarkIcon className="w-6 h-6 text-primary-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-foreground">{profileData.bookmarksCount}</div>
                                    <div className="text-sm text-neutral-600">Bookmarks</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="card"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-amber-100 rounded-soft">
                                    <CalendarIcon className="w-6 h-6 text-amber-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-foreground">0</div>
                                    <div className="text-sm text-neutral-600">Active Applications</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="card"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-green-100 rounded-soft">
                                    <UserCircleIcon className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-foreground">Active</div>
                                    <div className="text-sm text-neutral-600">Account Status</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Activity Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="card"
                    >
                        <h2 className="text-2xl font-bold text-foreground mb-6">Recent Activity</h2>

                        <div className="text-center py-12">
                            <BookmarkIcon className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">No activity yet</h3>
                            <p className="text-neutral-600 mb-6">Start exploring opportunities and your activity will appear here</p>
                            <Link href="/search" className="btn-primary inline-block">
                                Browse Opportunities
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}

export default function ProfilePage() {
    return (
        <AuthProvider>
            <ProfileContent />
        </AuthProvider>
    );
}

