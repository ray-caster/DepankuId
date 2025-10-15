'use client';

import { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import Header from '@/components/Header';
import { api, Opportunity } from '@/lib/api';
import { motion } from 'framer-motion';
import {
    BookmarkIcon,
    CalendarIcon,
    ChartBarIcon,
    TrashIcon,
    LinkIcon,
    MapPinIcon,
    BuildingOfficeIcon,
    TagIcon,
    ClockIcon,
    SparklesIcon,
    ExclamationTriangleIcon,
    PencilIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DeadlineEvent {
    id: string;
    title: string;
    deadline: Date;
    type: string;
    organization: string;
    url?: string;
}

function DashboardContent() {
    const { user, getIdToken } = useAuth();
    const router = useRouter();
    const [bookmarks, setBookmarks] = useState<Opportunity[]>([]);
    const [myOpportunities, setMyOpportunities] = useState<Opportunity[]>([]);
    const [myDrafts, setMyDrafts] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMyOpps, setLoadingMyOpps] = useState(false);
    const [loadingDrafts, setLoadingDrafts] = useState(false);
    const [deadlineEvents, setDeadlineEvents] = useState<DeadlineEvent[]>([]);
    const [activeView, setActiveView] = useState<'bookmarks' | 'gantt' | 'myOpportunities' | 'drafts'>('bookmarks');

    const processDeadlines = useCallback((opportunities: Opportunity[]) => {
        const events: DeadlineEvent[] = opportunities
            .filter(opp => opp.deadline && opp.deadline !== 'indefinite' && !opp.has_indefinite_deadline)
            .map(opp => ({
                id: opp.id || '',
                title: opp.title,
                deadline: new Date(opp.deadline!),
                type: opp.type,
                organization: opp.organization,
                url: opp.url
            }))
            .sort((a, b) => a.deadline.getTime() - b.deadline.getTime());

        setDeadlineEvents(events);
    }, []);

    const loadBookmarks = useCallback(async () => {
        try {
            const idToken = await getIdToken();
            if (idToken) {
                const data = await api.getBookmarks(idToken);
                setBookmarks(data);
                processDeadlines(data);
            }
        } catch (error) {
            console.error('Failed to load bookmarks:', error);
        } finally {
            setLoading(false);
        }
    }, [getIdToken, processDeadlines]);

    useEffect(() => {
        if (user) {
            loadBookmarks();
        }
    }, [user, loadBookmarks]);

    const loadMyOpportunities = useCallback(async () => {
        setLoadingMyOpps(true);
        try {
            const idToken = await getIdToken();
            if (idToken && user) {
                // Get opportunities created by this user
                const myOpps = await api.getMyOpportunities(idToken);
                // Filter to only show published opportunities
                const published = myOpps.filter(opp => opp.status === 'published');
                setMyOpportunities(published);
            }
        } catch (error) {
            console.error('Failed to load my opportunities:', error);
        } finally {
            setLoadingMyOpps(false);
        }
    }, [getIdToken, user]);

    const loadMyDrafts = useCallback(async () => {
        setLoadingDrafts(true);
        try {
            const idToken = await getIdToken();
            if (idToken && user) {
                const drafts = await api.getMyDrafts(idToken);
                setMyDrafts(drafts);
            }
        } catch (error) {
            console.error('Failed to load drafts:', error);
        } finally {
            setLoadingDrafts(false);
        }
    }, [getIdToken, user]);

    useEffect(() => {
        if (user && activeView === 'myOpportunities') {
            loadMyOpportunities();
        }
    }, [user, activeView, loadMyOpportunities]);

    useEffect(() => {
        if (user && activeView === 'drafts') {
            loadMyDrafts();
        }
    }, [user, activeView, loadMyDrafts]);

    const handleRemoveBookmark = async (opportunityId: string) => {
        try {
            const idToken = await getIdToken();
            if (idToken) {
                await api.removeBookmark(opportunityId, idToken);
                setBookmarks(bookmarks.filter(b => b.id !== opportunityId));
                processDeadlines(bookmarks.filter(b => b.id !== opportunityId));
            }
        } catch (error) {
            console.error('Failed to remove bookmark:', error);
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'research': return 'bg-blue-100 text-blue-700';
            case 'competition': return 'bg-amber-100 text-amber-700';
            case 'youth-program': return 'bg-green-100 text-green-700';
            case 'community': return 'bg-purple-100 text-purple-700';
            default: return 'bg-neutral-100 text-neutral-700';
        }
    };

    const getDaysUntil = (deadline: Date) => {
        const now = new Date();
        const diff = deadline.getTime() - now.getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days;
    };

    const getDeadlineStatus = (days: number) => {
        if (days < 0) return { text: 'Expired', color: 'text-red-600 bg-red-50' };
        if (days === 0) return { text: 'Today!', color: 'text-orange-600 bg-orange-50' };
        if (days <= 7) return { text: `${days}d left`, color: 'text-orange-600 bg-orange-50' };
        if (days <= 30) return { text: `${days}d left`, color: 'text-yellow-600 bg-yellow-50' };
        return { text: `${days}d left`, color: 'text-green-600 bg-green-50' };
    };

    const renderGanttChart = () => {
        if (deadlineEvents.length === 0) {
            return (
                <div className="text-center py-12">
                    <CalendarIcon className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
                    <p className="text-neutral-600">No upcoming deadlines in your bookmarks</p>
                </div>
            );
        }

        const now = new Date();
        const maxDate = new Date(Math.max(...deadlineEvents.map(e => e.deadline.getTime())));
        const minDate = new Date(Math.min(now.getTime(), ...deadlineEvents.map(e => e.deadline.getTime())));
        const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        return (
            <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-neutral-200">
                    <div className="flex-1">
                        <div className="text-sm text-neutral-500">Timeline</div>
                        <div className="flex justify-between mt-2">
                            <span className="text-xs text-neutral-600">{minDate.toLocaleDateString()}</span>
                            <span className="text-xs text-neutral-600">{maxDate.toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {deadlineEvents.map((event, idx) => {
                    const daysFromStart = Math.ceil((event.deadline.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
                    const position = (daysFromStart / totalDays) * 100;
                    const daysUntil = getDaysUntil(event.deadline);
                    const status = getDeadlineStatus(daysUntil);

                    return (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="relative"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-64 flex-shrink-0">
                                    <div className="text-sm font-semibold text-foreground truncate">
                                        {event.title}
                                    </div>
                                    <div className="text-xs text-neutral-500">{event.organization}</div>
                                </div>

                                <div className="flex-1 relative h-12">
                                    <div className="absolute top-0 left-0 right-0 h-2 bg-neutral-100 rounded-full mt-4"></div>
                                    <div
                                        className="absolute top-0 h-12 flex items-center"
                                        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                                    >
                                        <div className="relative group">
                                            <div className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${status.color}`}>
                                                {event.deadline.toLocaleDateString()}
                                            </div>
                                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-neutral-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                                {status.text}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        );
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="pt-32 text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-3xl font-bold mb-4">Your Dashboard</h1>
                        <p className="text-neutral-600 mb-6">Please sign in to view your bookmarks and deadlines</p>
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
                <div className="max-w-6xl laptop:max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
                        <p className="text-neutral-600">Track your bookmarked opportunities and upcoming deadlines</p>
                    </motion.div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="card"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary-100 rounded-soft">
                                    <BookmarkSolidIcon className="w-6 h-6 text-primary-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-foreground">{bookmarks.length}</div>
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
                                    <div className="text-2xl font-bold text-foreground">{deadlineEvents.length}</div>
                                    <div className="text-sm text-neutral-600">Upcoming Deadlines</div>
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
                                    <ClockIcon className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-foreground">
                                        {deadlineEvents.filter(e => getDaysUntil(e.deadline) <= 7 && getDaysUntil(e.deadline) >= 0).length}
                                    </div>
                                    <div className="text-sm text-neutral-600">Due This Week</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="card cursor-pointer hover:shadow-card-hover transition-shadow"
                            onClick={() => router.push('/opportunities')}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-r from-primary-100 to-accent-100 rounded-soft">
                                    <SparklesIcon className="w-6 h-6 text-primary-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-foreground">Share Opportunity</div>
                                    <div className="text-xs text-neutral-600">Help others discover more</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* View Tabs */}
                    <div className="flex gap-2 mb-6 border-b-2 border-neutral-200 overflow-x-auto">
                        <button
                            onClick={() => setActiveView('bookmarks')}
                            className={`flex items-center gap-2 px-4 py-3 font-medium transition-all whitespace-nowrap ${activeView === 'bookmarks'
                                ? 'text-primary-600 border-b-2 border-primary-600 -mb-0.5'
                                : 'text-neutral-600 hover:text-neutral-900'
                                }`}
                        >
                            <BookmarkIcon className="w-5 h-5" />
                            Bookmarks
                        </button>
                        <button
                            onClick={() => setActiveView('myOpportunities')}
                            className={`flex items-center gap-2 px-4 py-3 font-medium transition-all whitespace-nowrap ${activeView === 'myOpportunities'
                                ? 'text-primary-600 border-b-2 border-primary-600 -mb-0.5'
                                : 'text-neutral-600 hover:text-neutral-900'
                                }`}
                        >
                            <SparklesIcon className="w-5 h-5" />
                            My Opportunities
                        </button>
                        <button
                            onClick={() => setActiveView('drafts')}
                            className={`flex items-center gap-2 px-4 py-3 font-medium transition-all whitespace-nowrap relative ${activeView === 'drafts'
                                ? 'text-primary-600 border-b-2 border-primary-600 -mb-0.5'
                                : 'text-neutral-600 hover:text-neutral-900'
                                }`}
                        >
                            <ClockIcon className="w-5 h-5" />
                            Drafts
                            {myDrafts.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {myDrafts.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveView('gantt')}
                            className={`flex items-center gap-2 px-4 py-3 font-medium transition-all whitespace-nowrap ${activeView === 'gantt'
                                ? 'text-primary-600 border-b-2 border-primary-600 -mb-0.5'
                                : 'text-neutral-600 hover:text-neutral-900'
                                }`}
                        >
                            <ChartBarIcon className="w-5 h-5" />
                            Timeline
                        </button>
                    </div>

                    {/* Content */}
                    <motion.div
                        key={activeView}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {activeView === 'myOpportunities' ? (
                            loadingMyOpps ? (
                                <div className="text-center py-12">
                                    <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : myOpportunities.length === 0 ? (
                                <div className="card text-center py-12">
                                    <SparklesIcon className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">No opportunities created yet</h3>
                                    <p className="text-neutral-600 mb-6">Share amazing opportunities with the community!</p>
                                    <Link href="/opportunities" className="btn-primary inline-block">
                                        Create Opportunity
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-neutral-600">You have shared {myOpportunities.length} {myOpportunities.length === 1 ? 'opportunity' : 'opportunities'}</p>
                                        <Link href="/opportunities" className="btn-secondary">
                                            Create New
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {myOpportunities.map((opportunity, idx) => (
                                            <motion.div
                                                key={opportunity.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="card hover:shadow-card-hover transition-shadow"
                                            >
                                                <div className="mb-3">
                                                    <h3 className="text-xl font-bold text-foreground mb-2">
                                                        {opportunity.title}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(opportunity.type)}`}>
                                                            {opportunity.type.replace('-', ' ')}
                                                        </span>
                                                        {opportunity.deadline && opportunity.deadline !== 'indefinite' && !opportunity.has_indefinite_deadline && (
                                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDeadlineStatus(getDaysUntil(new Date(opportunity.deadline))).color}`}>
                                                                {getDeadlineStatus(getDaysUntil(new Date(opportunity.deadline))).text}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <p className="text-neutral-700 mb-4 line-clamp-3">
                                                    {opportunity.description}
                                                </p>

                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                                                        <BuildingOfficeIcon className="w-4 h-4" />
                                                        {opportunity.organization}
                                                    </div>
                                                    {opportunity.location && (
                                                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                                                            <MapPinIcon className="w-4 h-4" />
                                                            {opportunity.location}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {opportunity.tags.slice(0, 5).map(tag => (
                                                        <span key={tag} className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs flex items-center gap-1">
                                                            <TagIcon className="w-3 h-3" />
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                    {opportunity.tags.length > 5 && (
                                                        <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs">
                                                            +{opportunity.tags.length - 5} more
                                                        </span>
                                                    )}
                                                </div>

                                                {opportunity.url && (
                                                    <a
                                                        href={opportunity.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn-primary w-full flex items-center justify-center gap-2"
                                                    >
                                                        <LinkIcon className="w-4 h-4" />
                                                        Visit Website
                                                    </a>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )
                        ) : activeView === 'bookmarks' ? (
                            loading ? (
                                <div className="text-center py-12">
                                    <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : bookmarks.length === 0 ? (
                                <div className="card text-center py-12">
                                    <BookmarkIcon className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">No bookmarks yet</h3>
                                    <p className="text-neutral-600 mb-6">Start bookmarking opportunities you&apos;re interested in!</p>
                                    <Link href="/search" className="btn-primary inline-block">
                                        Browse Opportunities
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {bookmarks.map((opportunity, idx) => (
                                        <motion.div
                                            key={opportunity.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="card hover:shadow-card-hover transition-shadow"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-foreground mb-2">
                                                        {opportunity.title}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(opportunity.type)}`}>
                                                            {opportunity.type.replace('-', ' ')}
                                                        </span>
                                                        {opportunity.deadline && opportunity.deadline !== 'indefinite' && !opportunity.has_indefinite_deadline && (
                                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDeadlineStatus(getDaysUntil(new Date(opportunity.deadline))).color}`}>
                                                                {getDeadlineStatus(getDaysUntil(new Date(opportunity.deadline))).text}
                                                            </span>
                                                        )}
                                                        {(opportunity.has_indefinite_deadline || opportunity.deadline === 'indefinite') && (
                                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                                                No deadline
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveBookmark(opportunity.id!)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-soft transition-colors"
                                                    title="Remove bookmark"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <p className="text-neutral-700 mb-4 line-clamp-3">
                                                {opportunity.description}
                                            </p>

                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center gap-2 text-sm text-neutral-600">
                                                    <BuildingOfficeIcon className="w-4 h-4" />
                                                    {opportunity.organization}
                                                </div>
                                                {opportunity.location && (
                                                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                                                        <MapPinIcon className="w-4 h-4" />
                                                        {opportunity.location}
                                                    </div>
                                                )}
                                                {opportunity.deadline && opportunity.deadline !== 'indefinite' && !opportunity.has_indefinite_deadline && (
                                                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                                                        <CalendarIcon className="w-4 h-4" />
                                                        Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {opportunity.tags.slice(0, 5).map(tag => (
                                                    <span key={tag} className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs flex items-center gap-1">
                                                        <TagIcon className="w-3 h-3" />
                                                        {tag}
                                                    </span>
                                                ))}
                                                {opportunity.tags.length > 5 && (
                                                    <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs">
                                                        +{opportunity.tags.length - 5} more
                                                    </span>
                                                )}
                                            </div>

                                            {opportunity.url && (
                                                <a
                                                    href={opportunity.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn-primary w-full flex items-center justify-center gap-2"
                                                >
                                                    <LinkIcon className="w-4 h-4" />
                                                    Visit Website
                                                </a>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            )
                        ) : activeView === 'drafts' ? (
                            loadingDrafts ? (
                                <div className="text-center py-12">
                                    <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : myDrafts.length === 0 ? (
                                <div className="card text-center py-12">
                                    <ClockIcon className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">No drafts yet</h3>
                                    <p className="text-neutral-600 mb-6">Your rejected or saved opportunities will appear here.</p>
                                    <Link href="/opportunities" className="btn-primary inline-block">
                                        Create Opportunity
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-neutral-600">You have {myDrafts.length} {myDrafts.length === 1 ? 'draft' : 'drafts'}</p>
                                        <Link href="/opportunities" className="btn-secondary">
                                            Create New
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {myDrafts.map((opportunity, idx) => (
                                            <motion.div
                                                key={opportunity.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="card hover:shadow-card-hover transition-shadow"
                                            >
                                                <div className="mb-3">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="text-xl font-bold text-foreground">
                                                            {opportunity.title}
                                                        </h3>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${opportunity.status === 'rejected'
                                                                ? 'bg-red-100 text-red-700'
                                                                : 'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                            {opportunity.status === 'rejected' ? 'Rejected' : 'Draft'}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(opportunity.type)}`}>
                                                            {opportunity.type.replace('-', ' ')}
                                                        </span>
                                                    </div>
                                                </div>

                                                <p className="text-neutral-700 mb-4 line-clamp-3">
                                                    {opportunity.description}
                                                </p>

                                                {opportunity.moderation_notes && (
                                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                        <div className="flex items-start gap-2">
                                                            <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                                            <div>
                                                                <p className="text-sm font-medium text-red-800 mb-1">Moderation Feedback:</p>
                                                                <p className="text-sm text-red-700">{opportunity.moderation_notes}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                                                        <BuildingOfficeIcon className="w-4 h-4" />
                                                        {opportunity.organization}
                                                    </div>
                                                    {opportunity.location && (
                                                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                                                            <MapPinIcon className="w-4 h-4" />
                                                            {opportunity.location}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {opportunity.tags.slice(0, 5).map(tag => (
                                                        <span key={tag} className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs flex items-center gap-1">
                                                            <TagIcon className="w-3 h-3" />
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                    {opportunity.tags.length > 5 && (
                                                        <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs">
                                                            +{opportunity.tags.length - 5} more
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/opportunities?edit=${opportunity.id}`}
                                                        className="btn-primary flex-1 flex items-center justify-center gap-2"
                                                    >
                                                        <PencilIcon className="w-4 h-4" />
                                                        Edit & Resubmit
                                                    </Link>
                                                    {opportunity.url && (
                                                        <a
                                                            href={opportunity.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn-secondary flex items-center justify-center gap-2 px-3"
                                                        >
                                                            <LinkIcon className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className="card">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <ChartBarIcon className="w-6 h-6 text-primary-600" />
                                    Deadline Timeline
                                </h2>
                                {renderGanttChart()}
                            </div>
                        )}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <AuthProvider>
            <DashboardContent />
        </AuthProvider>
    );
}

