'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import Header from '@/components/Header';
import { api, ApplicationSubmission } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    CheckIcon,
    XMarkIcon,
    ArrowLeftIcon,
    UserIcon,
    CalendarIcon,
    ClockIcon,
    DocumentTextIcon,
    EyeIcon
} from '@heroicons/react/24/outline';

interface ApplicationManagementProps {
    opportunityId: string;
}

function ApplicationManagementContent({ opportunityId }: ApplicationManagementProps) {
    const { user, getIdToken } = useAuth();
    const router = useRouter();
    const [applications, setApplications] = useState<ApplicationSubmission[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loadApplications = useCallback(async () => {
        if (!user || !opportunityId) return;

        setLoading(true);
        setError(null);

        try {
            const idToken = await getIdToken();
            if (!idToken) return;

            const apps = await api.getOpportunityApplications(opportunityId, idToken);
            setApplications(apps);
        } catch (err) {
            console.error('Failed to load applications:', err);
            setError('Failed to load applications. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [user, opportunityId, getIdToken]);

    useEffect(() => {
        loadApplications();
    }, [loadApplications]);

    const handleStatusUpdate = async (applicationId: string, status: 'accepted' | 'rejected', notes?: string) => {
        if (!user) return;

        setUpdating(applicationId);
        try {
            const idToken = await getIdToken();
            if (!idToken) return;

            await api.updateApplicationStatus(applicationId, status, notes, idToken);

            // Update local state
            setApplications(prev => prev.map(app =>
                app.id === applicationId
                    ? { ...app, status, notes, reviewed_at: new Date().toISOString() }
                    : app
            ));
        } catch (err) {
            console.error('Failed to update application status:', err);
            setError('Failed to update application status. Please try again.');
        } finally {
            setUpdating(null);
        }
    };

    const nextApplication = () => {
        setCurrentIndex(prev => Math.min(prev + 1, applications.length - 1));
    };

    const prevApplication = () => {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
    };

    const currentApplication = applications[currentIndex];

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center justify-center min-h-[400px]">
                            <div className="text-center">
                                <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <h2 className="text-xl font-semibold text-foreground mb-2">Loading Applications</h2>
                                <p className="text-neutral-600">Please wait while we load the applications...</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center py-12">
                            <div className="text-red-500 text-6xl mb-4">⚠️</div>
                            <h2 className="text-2xl font-bold text-foreground mb-4">Error Loading Applications</h2>
                            <p className="text-neutral-600 mb-6">{error}</p>
                            <button
                                onClick={loadApplications}
                                className="btn-primary"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (applications.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-6">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4"
                            >
                                <ArrowLeftIcon className="w-4 h-4" />
                                Back to Dashboard
                            </button>
                        </div>
                        <div className="text-center py-12">
                            <DocumentTextIcon className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
                            <h2 className="text-2xl font-bold text-foreground mb-4">No Applications Yet</h2>
                            <p className="text-neutral-600">This opportunity hasn&apos;t received any applications yet.</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4"
                        >
                            <ArrowLeftIcon className="w-4 h-4" />
                            Back to Dashboard
                        </button>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground mb-2">Application Management</h1>
                                <p className="text-neutral-600">
                                    {applications.length} application{applications.length !== 1 ? 's' : ''} received
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-sm text-neutral-600">
                                    {currentIndex + 1} of {applications.length}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation and Application Display */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Application List Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="card p-4">
                                <h3 className="font-semibold text-foreground mb-4">Applications</h3>
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {applications.map((app, index) => (
                                        <button
                                            key={app.id}
                                            onClick={() => setCurrentIndex(index)}
                                            className={`w-full text-left p-3 rounded-lg transition-colors ${index === currentIndex
                                                ? 'bg-primary-100 border-2 border-primary-300'
                                                : 'hover:bg-neutral-100 border-2 border-transparent'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                                    <UserIcon className="w-4 h-4 text-primary-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-foreground truncate">
                                                        Application #{index + 1}
                                                    </div>
                                                    <div className="text-xs text-neutral-600">
                                                        {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : 'Unknown date'}
                                                    </div>
                                                    <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                                        app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {app.status}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Application View */}
                        <div className="lg:col-span-3">
                            <AnimatePresence mode="wait">
                                {currentApplication && (
                                    <motion.div
                                        key={currentApplication.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="card p-6"
                                    >
                                        {/* Application Header */}
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                                    <UserIcon className="w-6 h-6 text-primary-600" />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-semibold text-foreground">
                                                        Application #{currentIndex + 1}
                                                    </h2>
                                                    <div className="flex items-center gap-4 text-sm text-neutral-600">
                                                        <div className="flex items-center gap-1">
                                                            <CalendarIcon className="w-4 h-4" />
                                                            {currentApplication.submitted_at ? new Date(currentApplication.submitted_at).toLocaleDateString() : 'Unknown date'}
                                                        </div>
                                                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${currentApplication.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                                            currentApplication.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                                'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                            {currentApplication.status}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Application Content */}
                                        <div className="space-y-6">
                                            {/* Applicant Information */}
                                            <div>
                                                <h3 className="text-lg font-semibold text-foreground mb-4">Applicant Information</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="bg-neutral-50 p-4 rounded-lg">
                                                        <div className="text-sm font-medium text-neutral-700 mb-1">Name</div>
                                                        <div className="text-sm text-neutral-600">{currentApplication.applicantName || 'Not provided'}</div>
                                                    </div>
                                                    <div className="bg-neutral-50 p-4 rounded-lg">
                                                        <div className="text-sm font-medium text-neutral-700 mb-1">Email</div>
                                                        <div className="text-sm text-neutral-600">{currentApplication.applicantEmail || 'Not provided'}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Application Answers */}
                                            <div>
                                                <h3 className="text-lg font-semibold text-foreground mb-4">Application Details</h3>
                                                <div className="space-y-4">
                                                    {currentApplication.responses && Array.isArray(currentApplication.responses) && currentApplication.responses.length > 0 ? (
                                                        currentApplication.responses.map((response: any, index: number) => (
                                                            <div key={response.questionId || index} className="border-l-4 border-primary-200 pl-4">
                                                                <div className="text-sm font-medium text-neutral-700 mb-1">
                                                                    {response.questionTitle || `Question ${index + 1}`}
                                                                    {response.required && <span className="text-red-500 ml-1">*</span>}
                                                                </div>
                                                                <div className="text-sm text-neutral-600">
                                                                    {Array.isArray(response.answer) ? response.answer.join(', ') : String(response.answer || 'No answer provided')}
                                                                </div>
                                                                {response.questionType && (
                                                                    <div className="text-xs text-neutral-500 mt-1">
                                                                        Type: {response.questionType}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-neutral-600 italic">
                                                            No application details available
                                                        </div>
                                                    )}
                                                </div>
                                            </div>


                                            {/* Review Notes */}
                                            {currentApplication.notes && (
                                                <div>
                                                    <h3 className="text-lg font-semibold text-foreground mb-4">Review Notes</h3>
                                                    <div className="bg-neutral-50 p-4 rounded-lg">
                                                        <p className="text-sm text-neutral-700">{currentApplication.notes}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        {currentApplication.status === 'pending' && (
                                            <div className="flex gap-4 mt-8 pt-6 border-t border-neutral-200">
                                                <button
                                                    onClick={() => handleStatusUpdate(currentApplication.id!, 'accepted')}
                                                    disabled={updating === currentApplication.id}
                                                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                                                >
                                                    {updating === currentApplication.id ? (
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <CheckIcon className="w-4 h-4" />
                                                    )}
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const notes = prompt('Add rejection notes (optional):');
                                                        handleStatusUpdate(currentApplication.id!, 'rejected', notes || undefined);
                                                    }}
                                                    disabled={updating === currentApplication.id}
                                                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                                >
                                                    {updating === currentApplication.id ? (
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <XMarkIcon className="w-4 h-4" />
                                                    )}
                                                    Decline
                                                </button>
                                            </div>
                                        )}

                                        {currentApplication.status === 'accepted' && (
                                            <div className="flex gap-4 mt-8 pt-6 border-t border-neutral-200">
                                                <div className="flex-1 bg-green-50 border border-green-200 rounded-lg p-4">
                                                    <div className="flex items-center gap-2 text-green-800">
                                                        <CheckIcon className="w-5 h-5" />
                                                        <span className="font-medium">Application Accepted</span>
                                                    </div>
                                                    <p className="text-sm text-green-700 mt-1">
                                                        This application has been accepted. You can revoke the acceptance if needed.
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const notes = prompt('Add notes for revoking acceptance (optional):');
                                                        handleStatusUpdate(currentApplication.id!, 'rejected', notes || 'Acceptance revoked');
                                                    }}
                                                    disabled={updating === currentApplication.id}
                                                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                                >
                                                    {updating === currentApplication.id ? (
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <XMarkIcon className="w-4 h-4" />
                                                    )}
                                                    Revoke Acceptance
                                                </button>
                                            </div>
                                        )}

                                        {currentApplication.status === 'rejected' && (
                                            <div className="flex gap-4 mt-8 pt-6 border-t border-neutral-200">
                                                <div className="flex-1 bg-red-50 border border-red-200 rounded-lg p-4">
                                                    <div className="flex items-center gap-2 text-red-800">
                                                        <XMarkIcon className="w-5 h-5" />
                                                        <span className="font-medium">Application Rejected</span>
                                                    </div>
                                                    <p className="text-sm text-red-700 mt-1">
                                                        This application has been rejected. You can change your decision if needed.
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleStatusUpdate(currentApplication.id!, 'accepted')}
                                                    disabled={updating === currentApplication.id}
                                                    className="btn-primary flex items-center gap-2"
                                                >
                                                    {updating === currentApplication.id ? (
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <CheckIcon className="w-4 h-4" />
                                                    )}
                                                    Accept Instead
                                                </button>
                                            </div>
                                        )}

                                        {/* Navigation */}
                                        <div className="flex justify-between mt-6 pt-6 border-t border-neutral-200">
                                            <button
                                                onClick={prevApplication}
                                                disabled={currentIndex === 0}
                                                className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ChevronLeftIcon className="w-4 h-4" />
                                                Previous
                                            </button>
                                            <button
                                                onClick={nextApplication}
                                                disabled={currentIndex === applications.length - 1}
                                                className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Next
                                                <ChevronRightIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function ApplicationManagementPage() {
    const params = useParams();
    const opportunityId = params.id as string;

    return (
        <AuthProvider>
            <ApplicationManagementContent opportunityId={opportunityId} />
        </AuthProvider>
    );
}
