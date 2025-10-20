'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { 
    ChevronLeftIcon, 
    ChevronRightIcon, 
    CheckIcon, 
    XMarkIcon,
    EyeIcon,
    CalendarIcon,
    UserIcon,
    EnvelopeIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';

interface Application {
    id: string;
    opportunity_id: string;
    applicantId: string;
    applicantEmail: string;
    applicantName: string;
    responses: Array<{
        question: string;
        answer: string;
    }>;
    status: string;
    submittedAt: string;
    reviewedAt?: string;
    notes?: string;
}

interface Opportunity {
    id: string;
    title: string;
    organization: string;
    type: string;
    location?: string;
    deadline?: string;
}

export default function ApplicationsPage() {
    const { user, getIdToken } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const opportunityId = searchParams.get('opportunity');
    const [applications, setApplications] = useState<Application[]>([]);
    const [opportunities, setOpportunities] = useState<Record<string, Opportunity>>({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadApplications = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const idToken = await getIdToken();
            
            if (!idToken) {
                setError('Authentication required');
                return;
            }

            // If specific opportunity ID is provided, only load that opportunity's applications
            if (opportunityId) {
                try {
                    // Get the specific opportunity details
                    const opportunitiesResponse = await api.getOpportunities();
                    const targetOpportunity = opportunitiesResponse.find((opp: any) => opp.id === opportunityId);
                    
                    if (targetOpportunity) {
                        const opportunitiesMap = {
                            [opportunityId]: {
                                id: targetOpportunity.id,
                                title: targetOpportunity.title,
                                organization: targetOpportunity.organization,
                                type: targetOpportunity.type,
                                location: targetOpportunity.location,
                                deadline: targetOpportunity.deadline
                            }
                        };
                        setOpportunities(opportunitiesMap);

                        // Get applications for this specific opportunity
                        const applications = await api.getOpportunityApplications(opportunityId, idToken);
                        if (applications && applications.length > 0) {
                            const mappedApplications = applications.map(app => ({
                                ...app,
                                opportunity_id: app.opportunityId,
                                responses: app.responses.map((response: any) => ({
                                    question: response.questionTitle,
                                    answer: Array.isArray(response.answer) ? response.answer.join(', ') : response.answer
                                }))
                            }));
                            setApplications(mappedApplications);
                        } else {
                            setApplications([]);
                        }
                    } else {
                        setError('Opportunity not found');
                    }
                } catch (err) {
                    console.error('Error loading applications for specific opportunity:', err);
                    setError('Failed to load applications for this opportunity');
                }
            } else {
                // Load all applications (fallback)
                const opportunitiesResponse = await api.getOpportunities();
                const opportunitiesMap: Record<string, Opportunity> = {};
                
                if (opportunitiesResponse && opportunitiesResponse.length > 0) {
                    opportunitiesResponse.forEach((opp: any) => {
                        opportunitiesMap[opp.id] = {
                            id: opp.id,
                            title: opp.title,
                            organization: opp.organization,
                            type: opp.type,
                            location: opp.location,
                            deadline: opp.deadline
                        };
                    });
                }
                setOpportunities(opportunitiesMap);

                // Get applications for each opportunity
                const allApplications: Application[] = [];
                
                for (const oppId of Object.keys(opportunitiesMap)) {
                    try {
                        const applications = await api.getOpportunityApplications(oppId, idToken);
                        if (applications && applications.length > 0) {
                            const mappedApplications = applications.map(app => ({
                                ...app,
                                opportunity_id: app.opportunityId,
                                responses: app.responses.map((response: any) => ({
                                    question: response.questionTitle,
                                    answer: Array.isArray(response.answer) ? response.answer.join(', ') : response.answer
                                }))
                            }));
                            allApplications.push(...mappedApplications);
                        }
                    } catch (err) {
                        console.warn(`Failed to load applications for opportunity ${oppId}:`, err);
                    }
                }

                setApplications(allApplications);
            }
        } catch (err) {
            console.error('Error loading applications:', err);
            setError('Failed to load applications');
        } finally {
            setLoading(false);
        }
    }, [getIdToken, opportunityId]);

    useEffect(() => {
        if (user) {
            loadApplications();
        }
    }, [user, loadApplications]);

    const updateApplicationStatus = async (applicationId: string, status: 'accepted' | 'rejected', notes?: string) => {
        try {
            setUpdating(true);
            const idToken = await getIdToken();
            
            // Find the opportunity ID for this application
            const application = applications.find(app => app.id === applicationId);
            if (!application) return;

            await api.updateApplicationStatus(applicationId, status, notes, idToken!);
            
            // Update local state
            setApplications(prev => prev.map(app => 
                app.id === applicationId 
                    ? { ...app, status, reviewedAt: new Date().toISOString() }
                    : app
            ));

            // Move to next application
            if (currentIndex < applications.length - 1) {
                setCurrentIndex(prev => prev + 1);
            }
        } catch (err) {
            console.error('Error updating application status:', err);
            setError('Failed to update application status');
        } finally {
            setUpdating(false);
        }
    };

    const goToPrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const goToNext = () => {
        if (currentIndex < applications.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'research':
                return 'bg-blue-100 text-blue-800';
            case 'youth-program':
                return 'bg-purple-100 text-purple-800';
            case 'community':
                return 'bg-green-100 text-green-800';
            case 'competition':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50">
                <Header />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-neutral-600">
                            {opportunityId ? 'Loading applications for this opportunity...' : 'Loading applications...'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-neutral-50">
                <Header />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button 
                            onClick={loadApplications}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (applications.length === 0) {
        return (
            <div className="min-h-screen bg-neutral-50">
                <Header />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <EyeIcon className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                            {opportunityId ? 'No Applications for This Opportunity' : 'No Applications Yet'}
                        </h2>
                        <p className="text-neutral-600">
                            {opportunityId 
                                ? 'Applications will appear here when users apply to this opportunity.'
                                : 'Applications will appear here when users apply to your opportunities.'
                            }
                        </p>
                        <button 
                            onClick={() => router.push('/dashboard')}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentApplication = applications[currentIndex];
    const opportunity = opportunities[currentApplication.opportunity_id];

    return (
        <div className="min-h-screen bg-neutral-50">
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="flex items-center gap-2 px-3 py-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                        >
                            <ArrowLeftIcon className="w-4 h-4" />
                            Back to Dashboard
                        </button>
                    </div>
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                        {opportunityId && opportunities[opportunityId] 
                            ? `Applications for ${opportunities[opportunityId].title}`
                            : 'Application Reviews'
                        }
                    </h1>
                    <p className="text-neutral-600">
                        {applications.length > 0 
                            ? `Reviewing application ${currentIndex + 1} of ${applications.length}`
                            : 'No applications found'
                        }
                    </p>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={goToPrevious}
                        disabled={currentIndex === 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            currentIndex === 0
                                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                                : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-300'
                        }`}
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                        Previous
                    </button>

                    <div className="flex items-center gap-2">
                        {applications.map((_, index) => (
                            <div
                                key={index}
                                className={`w-3 h-3 rounded-full ${
                                    index === currentIndex
                                        ? 'bg-blue-600'
                                        : index < currentIndex
                                        ? 'bg-green-500'
                                        : 'bg-neutral-300'
                                }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={goToNext}
                        disabled={currentIndex === applications.length - 1}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            currentIndex === applications.length - 1
                                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                                : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-300'
                        }`}
                    >
                        Next
                        <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>

                {/* Application Review Card */}
                <motion.div
                    key={currentApplication.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden"
                >
                    {/* Application Header */}
                    <div className="p-6 border-b border-neutral-200">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                                    {opportunity?.title || 'Unknown Opportunity'}
                                </h2>
                                <div className="flex items-center gap-4 text-sm text-neutral-600 mb-3">
                                    <div className="flex items-center gap-1">
                                        <CalendarIcon className="w-4 h-4" />
                                        Applied {new Date(currentApplication.submittedAt).toLocaleDateString()}
                                    </div>
                                    {currentApplication.reviewedAt && (
                                        <div className="flex items-center gap-1">
                                            <EyeIcon className="w-4 h-4" />
                                            Reviewed {new Date(currentApplication.reviewedAt).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(currentApplication.status)}`}>
                                {currentApplication.status.charAt(0).toUpperCase() + currentApplication.status.slice(1)}
                            </span>
                        </div>

                        {/* Opportunity Details */}
                        <div className="flex flex-wrap gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(opportunity?.type || '')}`}>
                                {opportunity?.type?.replace('-', ' ') || 'Unknown Type'}
                            </span>
                            {opportunity?.location && (
                                <span className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs">
                                    📍 {opportunity.location}
                                </span>
                            )}
                            {opportunity?.deadline && opportunity.deadline !== 'indefinite' && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                    📅 Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Applicant Info */}
                    <div className="p-6 border-b border-neutral-200">
                        <h3 className="font-semibold text-neutral-900 mb-3">Applicant Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <UserIcon className="w-5 h-5 text-neutral-500" />
                                <div>
                                    <p className="text-sm text-neutral-600">Name</p>
                                    <p className="font-medium text-neutral-900">{currentApplication.applicantName}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <EnvelopeIcon className="w-5 h-5 text-neutral-500" />
                                <div>
                                    <p className="text-sm text-neutral-600">Email</p>
                                    <p className="font-medium text-neutral-900">{currentApplication.applicantEmail}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Application Responses */}
                    <div className="p-6">
                        <h3 className="font-semibold text-neutral-900 mb-4">Application Responses</h3>
                        <div className="space-y-6">
                            {currentApplication.responses.map((response, index) => (
                                <div key={index} className="border-l-4 border-blue-200 pl-4">
                                    <h4 className="font-medium text-neutral-900 mb-2">{response.question}</h4>
                                    <p className="text-neutral-700 leading-relaxed">{response.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {currentApplication.status === 'pending' && (
                        <div className="p-6 bg-neutral-50 border-t border-neutral-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => updateApplicationStatus(currentApplication.id, 'rejected')}
                                        disabled={updating}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <XMarkIcon className="w-4 h-4" />
                                        Decline
                                    </button>
                                    <button
                                        onClick={() => updateApplicationStatus(currentApplication.id, 'accepted')}
                                        disabled={updating}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <CheckIcon className="w-4 h-4" />
                                        Accept
                                    </button>
                                </div>
                                <div className="text-sm text-neutral-500">
                                    {updating ? 'Updating...' : 'Review this application'}
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
