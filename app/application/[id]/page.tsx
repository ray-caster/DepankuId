'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import Header from '@/components/Header';
import ApplicationFormRenderer, { ApplicationResponse } from '@/components/ApplicationFormRenderer';
import { ApplicationForm } from '@/components/ApplicationFormBuilder';
import { Opportunity } from '@/lib/api';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

function ApplicationContent() {
    const { user, getIdToken } = useAuth();
    const params = useParams();
    const opportunityId = params.id as string;

    const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
    const [applicationForm, setApplicationForm] = useState<ApplicationForm | null>(null);
    const [existingApplication, setExistingApplication] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadOpportunityData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Load opportunity data
            const opp = await api.getOpportunity(opportunityId);
            if (!opp) {
                setError('Opportunity not found');
                return;
            }

            setOpportunity(opp);

            // Check if user has already applied
            if (user) {
                try {
                    const idToken = await getIdToken();
                    if (idToken) {
                        const applicationStatus = await api.getApplicationStatus(opportunityId, idToken);
                        if (applicationStatus.has_applied && applicationStatus.application) {
                            setExistingApplication(applicationStatus.application);
                        }
                    }
                } catch (error) {
                    console.error('Error checking application status:', error);
                }
            }

            // Use custom application form if available, otherwise create default
            if (opp.application_form) {
                setApplicationForm(opp.application_form);
            } else {
                // Create default application form
                const defaultForm: ApplicationForm = {
                    id: `default_${opportunityId}`,
                    title: `Application for ${opp.title}`,
                    description: `Please fill out this application form for ${opp.title} at ${opp.organization}.`,
                    pages: [{
                        id: 'page_1',
                        title: 'Application Information',
                        description: 'Please provide your details and motivation for this opportunity.',
                        questions: [
                            {
                                id: 'motivation',
                                type: 'textarea',
                                title: 'Why are you interested in this opportunity?',
                                description: 'Please explain your motivation and how this opportunity aligns with your goals.',
                                required: true,
                                placeholder: 'Tell us about your interest and goals...'
                            },
                            {
                                id: 'experience',
                                type: 'textarea',
                                title: 'Relevant Experience',
                                description: 'Describe any relevant experience or background you have.',
                                required: false,
                                placeholder: 'Share your relevant experience...'
                            },
                            {
                                id: 'availability',
                                type: 'text',
                                title: 'Availability',
                                description: 'When are you available to start?',
                                required: true,
                                placeholder: 'e.g., Immediately, January 2024, etc.'
                            },
                            {
                                id: 'contact',
                                type: 'text',
                                title: 'Best Contact Method',
                                description: 'How should we contact you?',
                                required: true,
                                placeholder: 'Email, phone, etc.'
                            }
                        ]
                    }],
                    settings: {
                        allowMultipleSubmissions: false,
                        collectEmail: true,
                        showProgressBar: true
                    }
                };
                setApplicationForm(defaultForm);
            }
        } catch (err) {
            console.error('Error loading opportunity:', err);
            setError('Failed to load opportunity details');
        } finally {
            setLoading(false);
        }
    }, [opportunityId]);

    useEffect(() => {
        if (opportunityId) {
            loadOpportunityData();
        }
    }, [opportunityId, loadOpportunityData]);

    const handleSubmit = async (responses: ApplicationResponse[]) => {
        if (!user) return;

        setIsSubmitting(true);
        try {
            const idToken = await getIdToken();
            if (!idToken) return;

            // Track the application
            await api.trackApplication(opportunityId, idToken);

            // TODO: Save application responses to database
            // This would require a new API endpoint to save application responses
            console.log('Application responses:', responses);

            setSubmitSuccess(true);

        } catch (error) {
            console.error('Error submitting application:', error);
            setError('Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center min-h-[400px]">
                            <div className="text-center">
                                <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <h2 className="text-xl font-semibold text-foreground mb-2">Loading Application</h2>
                                <p className="text-neutral-600">Please wait while we load the application form...</p>
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
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-2">Error</h2>
                            <p className="text-neutral-600 mb-6">{error}</p>
                            <Link href="/search" className="btn-primary">
                                Browse Opportunities
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (!opportunity || !applicationForm) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center py-12">
                            <h2 className="text-2xl font-bold text-foreground mb-2">Application Not Found</h2>
                            <p className="text-neutral-600 mb-6">The application form you&apos;re looking for doesn&apos;t exist.</p>
                            <Link href="/search" className="btn-primary">
                                Browse Opportunities
                            </Link>
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
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href="/search"
                            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors mb-4"
                        >
                            <ArrowLeftIcon className="w-4 h-4" />
                            Back to Opportunities
                        </Link>

                        <div className="bg-white rounded-lg border border-neutral-200 p-6">
                            <h1 className="text-3xl font-bold text-foreground mb-2">
                                {existingApplication ? 'Edit Application' : 'Application'} - {opportunity.title}
                            </h1>
                            <p className="text-lg text-neutral-600 mb-4">
                                {opportunity.organization}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(opportunity.type)}`}>
                                    {opportunity.type.replace('-', ' ')}
                                </span>
                                {opportunity.location && (
                                    <span className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs">
                                        📍 {opportunity.location}
                                    </span>
                                )}
                                {opportunity.deadline && opportunity.deadline !== 'indefinite' && !opportunity.has_indefinite_deadline && (
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                        📅 Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Application Form */}
                    {submitSuccess ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg border border-neutral-200 p-8 text-center"
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircleIcon className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-2">
                                Application Submitted Successfully!
                            </h2>
                            <p className="text-neutral-600 mb-6">
                                Thank you for your application. We&apos;ll review it and get back to you soon.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <Link href="/search" className="btn-primary">
                                    Browse More Opportunities
                                </Link>
                                <Link href="/dashboard" className="btn-secondary">
                                    View My Applications
                                </Link>
                            </div>
                        </motion.div>
                    ) : (
                        <ApplicationFormRenderer
                            form={applicationForm}
                            onSubmit={handleSubmit}
                            isSubmitting={isSubmitting}
                            existingResponses={existingApplication?.responses || []}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}

// Helper function for type colors (you might want to move this to a shared utility)
function getTypeColor(type: string) {
    switch (type) {
        case 'research': return 'bg-blue-100 text-blue-700';
        case 'youth-program': return 'bg-green-100 text-green-700';
        case 'community': return 'bg-purple-100 text-purple-700';
        case 'competition': return 'bg-orange-100 text-orange-700';
        default: return 'bg-gray-100 text-gray-700';
    }
}

export default function ApplicationPage() {
    return (
        <AuthProvider>
            <Suspense fallback={
                <div className="min-h-screen bg-background">
                    <Header />
                    <main className="pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center justify-center min-h-[400px]">
                                <div className="text-center">
                                    <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <h2 className="text-xl font-semibold text-foreground mb-2">Loading Application</h2>
                                    <p className="text-neutral-600">Please wait while we load the application form...</p>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            }>
                <ApplicationContent />
            </Suspense>
        </AuthProvider>
    );
}
