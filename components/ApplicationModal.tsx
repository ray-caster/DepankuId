'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import ApplicationFormRenderer, { ApplicationResponse } from './ApplicationFormRenderer';
import { ApplicationForm } from './ApplicationFormBuilder';
import { Opportunity } from '@/lib/api';
import { useAuth } from './AuthProvider';
import { api } from '@/lib/api';

interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    opportunity: Opportunity;
    applicationForm?: ApplicationForm;
}

export default function ApplicationModal({
    isOpen,
    onClose,
    opportunity,
    applicationForm
}: ApplicationModalProps) {
    const { user, getIdToken } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleSubmit = async (responses: ApplicationResponse[]) => {
        if (!user) return;

        setIsSubmitting(true);
        try {
            const idToken = await getIdToken();
            if (!idToken) return;

            // Track the application
            await api.trackApplication(opportunity.id || opportunity.objectID || '', idToken);

            // TODO: Save application responses to database
            // This would require a new API endpoint to save application responses
            console.log('Application responses:', responses);

            setSubmitSuccess(true);

            // Close modal after a delay
            setTimeout(() => {
                onClose();
                setSubmitSuccess(false);
            }, 2000);

        } catch (error) {
            console.error('Error submitting application:', error);
            alert('Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
        }
    };

    // If no custom form, show a simple application form
    const defaultForm: ApplicationForm = {
        id: `default_${opportunity.id}`,
        title: `Application for ${opportunity.title}`,
        description: `Please fill out this application form for ${opportunity.title} at ${opportunity.organization}.`,
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

    const formToUse = applicationForm || defaultForm;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">
                                    {submitSuccess ? 'Application Submitted!' : 'Apply for Opportunity'}
                                </h2>
                                <p className="text-sm text-neutral-600 mt-1">
                                    {opportunity.title} at {opportunity.organization}
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors disabled:opacity-50"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                            {submitSuccess ? (
                                <div className="p-8 text-center">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-foreground mb-2">
                                        Application Submitted Successfully!
                                    </h3>
                                    <p className="text-neutral-600">
                                        Thank you for your application. We&apos;ll review it and get back to you soon.
                                    </p>
                                </div>
                            ) : (
                                <ApplicationFormRenderer
                                    form={formToUse}
                                    onSubmit={handleSubmit}
                                    onCancel={handleClose}
                                    isSubmitting={isSubmitting}
                                />
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
