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
    PencilIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import { calculateProfileCompletion, getCompletionMessage, getCompletionColor } from '@/lib/profileCompletion';

function ProfileContent() {
    const { user, loading, getIdToken } = useAuth();
    const router = useRouter();
    const [profileData, setProfileData] = useState({
        bio: '',
        website: '',
        location: '',
        joinedDate: '',
        bookmarksCount: 0,
    });
    const [applications, setApplications] = useState([]);
    const [activity, setActivity] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [profileCompletion, setProfileCompletion] = useState(null);
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

    const loadProfileData = async () => {
        if (!user) return;

        try {
            const idToken = await getIdToken();
            if (!idToken) return;

            // Load profile data
            const profile = await api.getProfile(idToken);
            const bookmarks = await api.getBookmarks(idToken);
            const userApplications = await api.getApplications(idToken);
            const userActivity = await api.getActivity(idToken);

            setProfileData({
                bio: profile.profile?.bio || '',
                website: profile.profile?.website || '',
                location: profile.profile?.location || '',
                joinedDate: profile.created_at ? new Date(profile.created_at.seconds * 1000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently',
                bookmarksCount: bookmarks.length,
            });

            setApplications(userApplications);
            setActivity(userActivity);

            // Calculate profile completion
            const completion = calculateProfileCompletion(user, profile);
            setProfileCompletion(completion);
            setLastRefresh(new Date());
        } catch (error) {
            console.error('Failed to load profile data:', error);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        if (user) {
            loadProfileData();
        }
    }, [user]);

    const refreshData = async () => {
        await loadProfileData();
    };

    if (loading || loadingData) {
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

            <main className="pt-20 sm:pt-24 laptop:pt-28 pb-12 sm:pb-16 laptop:pb-20 px-4 sm:px-6 laptop:px-8">
                <div className="max-w-4xl laptop:max-w-5xl mx-auto">
                    {/* Header with refresh */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-foreground mb-2">My Profile</h1>
                                <p className="text-neutral-600">Manage your profile and track your activity</p>
                            </div>
                            <button
                                onClick={refreshData}
                                className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-soft transition-colors text-sm font-medium"
                                title="Refresh data"
                            >
                                <ArrowPathIcon className="w-4 h-4" />
                                Refresh
                            </button>
                        </div>
                        <div className="text-xs text-neutral-500 mt-2">
                            Last updated: {lastRefresh.toLocaleTimeString()}
                        </div>
                    </motion.div>
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

                    {/* Profile Completion */}
                    {profileCompletion && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card mb-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-foreground">Profile Completion</h2>
                                <span className={`text-sm font-medium ${getCompletionColor(profileCompletion.percentage)}`}>
                                    {profileCompletion.percentage}%
                                </span>
                            </div>
                            <div className="w-full bg-neutral-200 rounded-full h-2 mb-3">
                                <div
                                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${profileCompletion.percentage}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-neutral-600 mb-3">
                                {getCompletionMessage(profileCompletion)}
                            </p>
                            {profileCompletion.missingFields.length > 0 && (
                                <div className="text-xs text-neutral-500">
                                    Missing: {profileCompletion.missingFields.join(', ')}
                                </div>
                            )}
                        </motion.div>
                    )}

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
                                    <div className="text-2xl font-bold text-foreground">{applications.length}</div>
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

                        {activity.length === 0 ? (
                            <div className="text-center py-12">
                                <BookmarkIcon className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No activity yet</h3>
                                <p className="text-neutral-600 mb-6">Start exploring opportunities and your activity will appear here</p>
                                <Link href="/search" className="btn-primary inline-block">
                                    Browse Opportunities
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {activity.slice(0, 10).map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-soft">
                                        <div className="p-2 bg-primary-100 rounded-full">
                                            {item.type === 'application' ? (
                                                <CheckCircleIcon className="w-5 h-5 text-primary-600" />
                                            ) : (
                                                <ClockIcon className="w-5 h-5 text-primary-600" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-foreground">
                                                {item.type === 'application' ? 'Applied to opportunity' : 'Activity'}
                                            </p>
                                            <p className="text-xs text-neutral-500">
                                                {item.timestamp ? new Date(item.timestamp.seconds * 1000).toLocaleString() : 'Recently'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Applications Section */}
                    {applications.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="card"
                        >
                            <h2 className="text-2xl font-bold text-foreground mb-6">My Applications</h2>
                            <div className="space-y-4">
                                {applications.map((application, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 rounded-soft">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-foreground">{application.title}</h3>
                                            <p className="text-sm text-neutral-600">{application.organization}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                                Applied
                                            </span>
                                            {application.url && (
                                                <a
                                                    href={application.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn-secondary text-sm"
                                                >
                                                    View
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
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

