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
    PencilIcon,
    ArrowPathIcon,
    EyeIcon,
    EyeSlashIcon,
    DocumentTextIcon,
    XCircleIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBookmarks } from '@/hooks/useBookmarks';
import ApplicationManagement from '@/components/ApplicationManagement';

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
    const { bookmarks, loading: bookmarksLoading, refreshBookmarks } = useBookmarks();
    const [myOpportunities, setMyOpportunities] = useState<Opportunity[]>([]);
    const [loadingMyOpps, setLoadingMyOpps] = useState(false);
    const [myApplications, setMyApplications] = useState<any[]>([]);
    const [loadingMyApps, setLoadingMyApps] = useState(false);
    const [deadlineEvents, setDeadlineEvents] = useState<DeadlineEvent[]>([]);
    const [activeView, setActiveView] = useState<'bookmarks' | 'gantt' | 'myOpportunities' | 'myApplications'>('bookmarks');
    const [publishingId, setPublishingId] = useState<string | null>(null);
    const [viewingApplicationsFor, setViewingApplicationsFor] = useState<string | null>(null);

    // Load active view from localStorage on mount
    useEffect(() => {
        const savedView = localStorage.getItem('dashboardActiveView') as 'bookmarks' | 'gantt' | 'myOpportunities' | 'myApplications';
        if (savedView && ['bookmarks', 'gantt', 'myOpportunities', 'myApplications'].includes(savedView)) {
            setActiveView(savedView);
        }
    }, []);

    // Save active view to localStorage when it changes
    const handleViewChange = (view: 'bookmarks' | 'gantt' | 'myOpportunities' | 'myApplications') => {
        setActiveView(view);
        localStorage.setItem('dashboardActiveView', view);
    };
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

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

    // Update deadline events when bookmarks change
    useEffect(() => {
        if (bookmarks.length > 0) {
            processDeadlines(bookmarks);
        }
    }, [bookmarks, processDeadlines]);

    const loadMyOpportunities = useCallback(async () => {
        setLoadingMyOpps(true);
        try {
            const idToken = await getIdToken();
            if (idToken && user) {
                // Get all opportunities created by this user (published, drafts, rejected)
                const myOpps = await api.getMyOpportunities(idToken);
                setMyOpportunities(myOpps);
                setLastRefresh(new Date());
            }
        } catch (error) {
            console.error('Failed to load my opportunities:', error);
        } finally {
            setLoadingMyOpps(false);
        }
    }, [getIdToken, user]);

    const loadMyApplications = useCallback(async () => {
        setLoadingMyApps(true);
        try {
            const idToken = await getIdToken();
            if (idToken && user) {
                const applications = await api.getMyApplications(idToken);
                setMyApplications(applications);
            }
        } catch (error) {
            console.error('Error loading my applications:', error);
        } finally {
            setLoadingMyApps(false);
        }
    }, [getIdToken, user]);

    const handleDeleteOpportunity = async (id: string) => {
        if (!user) return;

        setDeletingId(id);
        try {
            const idToken = await getIdToken();
            if (!idToken) {
                throw new Error('No authentication token available');
            }
            await api.deleteOpportunity(id, idToken as string);

            setMyOpportunities(prev => prev.filter(opp => opp.id !== id));
        } catch (error) {
            console.error('Error deleting opportunity:', error);
            alert('Failed to delete opportunity');
        } finally {
            setDeletingId(null);
        }
    };

    useEffect(() => {
        if (user && activeView === 'myOpportunities') {
            loadMyOpportunities();
        }
        if (user && activeView === 'myApplications') {
            loadMyApplications();
        }
    }, [user, activeView, loadMyOpportunities, loadMyApplications]);

    const handlePublishOpportunity = async (opportunityId: string) => {
        setPublishingId(opportunityId);
        try {
            const idToken = await getIdToken();
            if (idToken) {
                await api.publishOpportunity(opportunityId, idToken);
                // Refresh my opportunities to show updated status
                await loadMyOpportunities();
            }
        } catch (error) {
            console.error('Failed to publish opportunity:', error);
            alert('Failed to publish opportunity. Please try again.');
        } finally {
            setPublishingId(null);
        }
    };

    const handleUnpublishOpportunity = async (opportunityId: string) => {
        setPublishingId(opportunityId);
        try {
            const idToken = await getIdToken();
            if (idToken) {
                await api.unpublishOpportunity(opportunityId, idToken);
                // Refresh my opportunities to show updated status
                await loadMyOpportunities();
            }
        } catch (error) {
            console.error('Failed to unpublish opportunity:', error);
            alert('Failed to unpublish opportunity. Please try again.');
        } finally {
            setPublishingId(null);
        }
    };

    const refreshData = useCallback(async () => {
        if (activeView === 'bookmarks') {
            await refreshBookmarks();
        } else if (activeView === 'myOpportunities') {
            await loadMyOpportunities();
        }
    }, [activeView, refreshBookmarks, loadMyOpportunities]);

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

            <main className="pt-16 md:pt-20">
                {/* Hero Section */}
                <section className="px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 bg-gradient-to-b from-primary-50 to-accent-50 border-b-2 border-neutral-400">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold text-foreground mb-2">Dashboard</h1>
                                    <p className="text-base sm:text-lg text-foreground-light">Track your bookmarked opportunities and upcoming deadlines</p>
                                </div>
                                <button
                                    onClick={refreshData}
                                    className="flex items-center gap-2 px-4 py-2 bg-background-light hover:bg-background border-2 border-neutral-400 hover:border-primary-400 rounded-gentle transition-all text-sm font-medium"
                                    title="Refresh data"
                                >
                                    <ArrowPathIcon className="w-4 h-4" />
                                    Refresh
                                </button>
                            </div>
                            <div className="text-xs text-foreground-lighter mt-2">
                                Last updated: {lastRefresh.toLocaleTimeString()}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Main Content */}
                <section className="px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
                    <div className="max-w-7xl mx-auto">

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="group relative bg-background-light rounded-gentle p-6 sm:p-8 border-2 border-neutral-400 hover:border-primary-400 transition-all duration-300"
                                style={{
                                    boxShadow: '0 4px 12px -2px oklch(0% 0 0 / 0.08), 0 2px 8px -2px oklch(0% 0 0 / 0.05)'
                                }}
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
                                className="group relative bg-background-light rounded-gentle p-6 sm:p-8 border-2 border-neutral-400 hover:border-primary-400 transition-all duration-300"
                                style={{
                                    boxShadow: '0 4px 12px -2px oklch(0% 0 0 / 0.08), 0 2px 8px -2px oklch(0% 0 0 / 0.05)'
                                }}
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
                                className="group relative bg-background-light rounded-gentle p-6 sm:p-8 border-2 border-neutral-400 hover:border-primary-400 transition-all duration-300"
                                style={{
                                    boxShadow: '0 4px 12px -2px oklch(0% 0 0 / 0.08), 0 2px 8px -2px oklch(0% 0 0 / 0.05)'
                                }}
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
                        <div className="flex gap-2 mb-8 sm:mb-12 border-b-2 border-neutral-400 overflow-x-auto pt-2">
                            <button
                                onClick={() => handleViewChange('bookmarks')}
                                className={`flex items-center gap-2 px-4 py-3 font-medium transition-all whitespace-nowrap ${activeView === 'bookmarks'
                                    ? 'text-primary-600 border-b-2 border-primary-600 -mb-0.5'
                                    : 'text-neutral-600 hover:text-neutral-900'
                                    }`}
                            >
                                <BookmarkIcon className="w-5 h-5" />
                                Bookmarks
                            </button>
                            <button
                                onClick={() => handleViewChange('myOpportunities')}
                                className={`flex items-center gap-2 px-4 py-3 font-medium transition-all whitespace-nowrap relative ${activeView === 'myOpportunities'
                                    ? 'text-primary-600 border-b-2 border-primary-600 -mb-0.5'
                                    : 'text-neutral-600 hover:text-neutral-900'
                                    }`}
                            >
                                <SparklesIcon className="w-5 h-5" />
                                My Opportunities
                                {myOpportunities.filter(opp => opp.status === 'draft' || opp.status === 'rejected').length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white">
                                        {myOpportunities.filter(opp => opp.status === 'draft' || opp.status === 'rejected').length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => handleViewChange('myApplications')}
                                className={`flex items-center gap-2 px-4 py-3 font-medium transition-all whitespace-nowrap ${activeView === 'myApplications'
                                    ? 'text-primary-600 border-b-2 border-primary-600 -mb-0.5'
                                    : 'text-neutral-600 hover:text-neutral-900'
                                    }`}
                            >
                                <DocumentTextIcon className="w-5 h-5" />
                                My Applications
                            </button>
                            <button
                                onClick={() => handleViewChange('gantt')}
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
                                        {/* Opportunity Summary Card */}
                                        <div className="group relative bg-gradient-to-r from-primary-50 to-accent-50 rounded-gentle p-6 sm:p-8 border-2 border-primary-200 hover:border-primary-400 transition-all duration-300 mb-6 sm:mb-8"
                                            style={{
                                                boxShadow: '0 4px 12px -2px oklch(0% 0 0 / 0.08), 0 2px 8px -2px oklch(0% 0 0 / 0.05)'
                                            }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-primary-100 rounded-soft">
                                                        <SparklesIcon className="w-6 h-6 text-primary-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-foreground mb-1">
                                                            {myOpportunities.length} {myOpportunities.length === 1 ? 'Opportunity' : 'Opportunities'}
                                                        </h3>
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <div className="flex items-center gap-1">
                                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                                <span className="text-neutral-600">
                                                                    {myOpportunities.filter(opp => opp.status === 'published').length} Published
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                                                <span className="text-neutral-600">
                                                                    {myOpportunities.filter(opp => opp.status === 'draft').length} Drafts
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                                <span className="text-neutral-600">
                                                                    {myOpportunities.filter(opp => opp.status === 'rejected').length} Rejected
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Link href="/opportunities" className="btn-primary">
                                                    Create New
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {myOpportunities.map((opportunity, idx) => (
                                                <motion.div
                                                    key={opportunity.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className={`card hover:shadow-card-hover transition-shadow ${opportunity.status === 'draft'
                                                        ? 'border-l-4 border-orange-500'
                                                        : opportunity.status === 'published'
                                                            ? 'border-l-4 border-green-500'
                                                            : 'border-l-4 border-red-500'
                                                        }`}
                                                >
                                                    <div className="mb-3">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h3 className="text-xl font-bold text-foreground">
                                                                {opportunity.title}
                                                            </h3>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${opportunity.status === 'draft'
                                                                ? 'bg-orange-100 text-orange-700'
                                                                : opportunity.status === 'published'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-red-100 text-red-700'
                                                                }`}>
                                                                {opportunity.status === 'draft' ? 'Draft' :
                                                                    opportunity.status === 'published' ? 'Published' : 'Rejected'}
                                                            </span>
                                                        </div>
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

                                                    <div className="flex flex-wrap gap-2">
                                                        {opportunity.id && (
                                                            <Link
                                                                href={`/opportunities?edit=${opportunity.id}`}
                                                                className="btn-primary flex-1 flex items-center justify-center gap-2 min-w-0"
                                                            >
                                                                <PencilIcon className="w-4 h-4" />
                                                                Edit
                                                            </Link>
                                                        )}

                                                        {/* Publish/Unpublish Button */}
                                                        {opportunity.id && opportunity.status !== 'rejected' && (
                                                            <button
                                                                onClick={() => {
                                                                    if (opportunity.status === 'published') {
                                                                        handleUnpublishOpportunity(opportunity.id!);
                                                                    } else {
                                                                        handlePublishOpportunity(opportunity.id!);
                                                                    }
                                                                }}
                                                                disabled={publishingId === opportunity.id}
                                                                className={`flex items-center gap-2 px-3 py-2 rounded-comfort transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${opportunity.status === 'published'
                                                                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                                                                    : 'bg-green-600 text-white hover:bg-green-700'
                                                                    }`}
                                                            >
                                                                {publishingId === opportunity.id ? (
                                                                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                                                                ) : opportunity.status === 'published' ? (
                                                                    <EyeSlashIcon className="w-4 h-4" />
                                                                ) : (
                                                                    <EyeIcon className="w-4 h-4" />
                                                                )}
                                                                {opportunity.status === 'published' ? 'Unpublish' : 'Publish'}
                                                            </button>
                                                        )}

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

                                                        {/* View Applications Button */}
                                                        {opportunity.id && opportunity.status === 'published' && (
                                                            <button
                                                                onClick={() => setViewingApplicationsFor(opportunity.id!)}
                                                                className="btn-secondary flex items-center justify-center gap-2 px-3"
                                                                title="View Applications"
                                                            >
                                                                <DocumentTextIcon className="w-4 h-4" />
                                                                Applications
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => opportunity.id && handleDeleteOpportunity(opportunity.id)}
                                                            disabled={deletingId === opportunity.id}
                                                            className="px-3 py-2 bg-red-600 text-white rounded-comfort hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                                                        >
                                                            {deletingId === opportunity.id ? (
                                                                <ArrowPathIcon className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <TrashIcon className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ) : activeView === 'bookmarks' ? (
                                bookmarksLoading ? (
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
                                                    {opportunity.tags.slice(0, 5).map((tag: string) => (
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
                            ) : activeView === 'myApplications' ? (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-bold text-foreground">My Applications</h2>
                                        <button
                                            onClick={loadMyApplications}
                                            disabled={loadingMyApps}
                                            className="btn-secondary flex items-center gap-2"
                                        >
                                            <ArrowPathIcon className={`w-4 h-4 ${loadingMyApps ? 'animate-spin' : ''}`} />
                                            Refresh
                                        </button>
                                    </div>

                                    {loadingMyApps ? (
                                        <div className="card text-center py-12">
                                            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                            <p className="text-neutral-600">Loading applications...</p>
                                        </div>
                                    ) : myApplications.length > 0 ? (
                                        <div className="grid gap-4">
                                            {myApplications.map((application) => (
                                                <motion.div
                                                    key={application.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="card p-6"
                                                >
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-foreground mb-1">
                                                                {application.opportunity_title || 'Application'}
                                                            </h3>
                                                            <p className="text-sm text-neutral-600">
                                                                Applied on {(() => {
                                                                    try {
                                                                        // Handle different timestamp formats
                                                                        let timestamp;
                                                                        if (application.submitted_at?.seconds) {
                                                                            timestamp = application.submitted_at.seconds * 1000;
                                                                        } else if (application.submitted_at?._seconds) {
                                                                            timestamp = application.submitted_at._seconds * 1000;
                                                                        } else if (typeof application.submitted_at === 'string') {
                                                                            timestamp = new Date(application.submitted_at).getTime();
                                                                        } else if (typeof application.submitted_at === 'number') {
                                                                            timestamp = application.submitted_at;
                                                                        } else {
                                                                            return 'Recently';
                                                                        }
                                                                        return new Date(timestamp).toLocaleDateString();
                                                                    } catch (error) {
                                                                        console.warn('Error parsing application date:', error);
                                                                        return 'Recently';
                                                                    }
                                                                })()}
                                                            </p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                            application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                                application.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                                                                    'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                                        </span>
                                                    </div>

                                                    {application.responses && application.responses.length > 0 && (
                                                        <div className="space-y-3">
                                                            <h4 className="font-medium text-foreground">Your Responses:</h4>
                                                            {application.responses.map((response: any, index: number) => (
                                                                <div key={index} className="bg-neutral-50 rounded-lg p-3">
                                                                    <p className="text-sm font-medium text-neutral-700 mb-1">
                                                                        {response.questionTitle}
                                                                    </p>
                                                                    <p className="text-sm text-neutral-600">
                                                                        {typeof response.answer === 'string' ? response.answer :
                                                                            Array.isArray(response.answer) ? response.answer.join(', ') :
                                                                                'File uploaded'}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {application.notes && (
                                                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                                            <p className="text-sm font-medium text-blue-900 mb-1">Notes from reviewer:</p>
                                                            <p className="text-sm text-blue-800">{application.notes}</p>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-200">
                                                        <div className="text-xs text-neutral-500">
                                                            Application ID: {application.id}
                                                        </div>
                                                        <Link
                                                            href={`/application/${application.opportunity_id}`}
                                                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                                                        >
                                                            View Details →
                                                        </Link>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="card text-center py-12">
                                            <DocumentTextIcon className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
                                            <h3 className="text-xl font-semibold mb-2">No Applications Yet</h3>
                                            <p className="text-neutral-600 mb-6">Start applying to opportunities to see them here</p>
                                            <Link
                                                href="/search"
                                                className="btn-primary inline-flex items-center gap-2"
                                            >
                                                <MagnifyingGlassIcon className="w-4 h-4" />
                                                Browse Opportunities
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="group relative bg-background-light rounded-gentle p-6 sm:p-8 border-2 border-neutral-400 hover:border-primary-400 transition-all duration-300"
                                    style={{
                                        boxShadow: '0 4px 12px -2px oklch(0% 0 0 / 0.08), 0 2px 8px -2px oklch(0% 0 0 / 0.05)'
                                    }}
                                >
                                    <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold mb-6 sm:mb-8 flex items-center gap-2 text-foreground">
                                        <ChartBarIcon className="w-6 h-6 text-primary-600" />
                                        Deadline Timeline
                                    </h2>
                                    {renderGanttChart()}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </section>

                {/* Application Management Modal */}
                {viewingApplicationsFor && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                                <h2 className="text-xl font-semibold text-foreground">
                                    Applications for {myOpportunities.find(opp => opp.id === viewingApplicationsFor)?.title}
                                </h2>
                                <button
                                    onClick={() => setViewingApplicationsFor(null)}
                                    className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
                                >
                                    <XCircleIcon className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
                                <ApplicationManagement
                                    opportunityId={viewingApplicationsFor}
                                    opportunityTitle={myOpportunities.find(opp => opp.id === viewingApplicationsFor)?.title || ''}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
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

