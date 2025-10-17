'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    UserIcon,
    CalendarIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    EyeIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { ApplicationSubmission, ApplicationResponse } from '@/lib/api';
import { useAuth } from './AuthProvider';
import { api } from '@/lib/api';

interface ApplicationManagementProps {
    opportunityId: string;
    opportunityTitle: string;
}

export default function ApplicationManagement({ opportunityId, opportunityTitle }: ApplicationManagementProps) {
    const { getIdToken } = useAuth();
    const [applications, setApplications] = useState<ApplicationSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState<ApplicationSubmission | null>(null);
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'reviewed' | 'accepted' | 'rejected'>('all');
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

    const loadApplications = useCallback(async () => {
        try {
            const idToken = await getIdToken();
            if (!idToken) return;

            const apps = await api.getOpportunityApplications(opportunityId, idToken);
            setApplications(apps);
        } catch (error) {
            console.error('Error loading applications:', error);
        } finally {
            setLoading(false);
        }
    }, [opportunityId, getIdToken]);

    useEffect(() => {
        loadApplications();
    }, [loadApplications]);

    const handleStatusUpdate = async (applicationId: string, newStatus: 'pending' | 'reviewed' | 'accepted' | 'rejected', notes?: string) => {
        setUpdatingStatus(applicationId);
        try {
            const idToken = await getIdToken();
            if (!idToken) return;

            await api.updateApplicationStatus(applicationId, newStatus, notes, idToken);

            // Update local state
            setApplications(prev =>
                prev.map(app =>
                    app.id === applicationId
                        ? { ...app, status: newStatus, reviewedAt: new Date().toISOString(), notes }
                        : app
                )
            );

            // Close modal if open
            if (selectedApplication?.id === applicationId) {
                setSelectedApplication(null);
            }
        } catch (error) {
            console.error('Error updating application status:', error);
            alert('Failed to update application status. Please try again.');
        } finally {
            setUpdatingStatus(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'reviewed': return 'bg-blue-100 text-blue-800';
            case 'accepted': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <ClockIcon className="w-4 h-4" />;
            case 'reviewed': return <EyeIcon className="w-4 h-4" />;
            case 'accepted': return <CheckCircleIcon className="w-4 h-4" />;
            case 'rejected': return <XCircleIcon className="w-4 h-4" />;
            default: return <ClockIcon className="w-4 h-4" />;
        }
    };

    const filteredApplications = applications.filter(app =>
        statusFilter === 'all' || app.status === statusFilter
    );

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2 text-neutral-600">Loading applications...</p>
            </div>
        );
    }

    if (applications.length === 0) {
        return (
            <div className="text-center py-12">
                <UserIcon className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Applications Yet</h3>
                <p className="text-neutral-600">
                    Applications for &quot;{opportunityTitle}&quot; will appear here once people start applying.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Applications ({applications.length})</h3>
                    <p className="text-sm text-neutral-600">Manage incoming applications for this opportunity</p>
                </div>

                {/* Status Filter */}
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
                {filteredApplications.map((application) => (
                    <motion.div
                        key={application.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                        <UserIcon className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">{application.applicantName}</h4>
                                        <p className="text-sm text-neutral-600">{application.applicantEmail}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-neutral-600 mb-3">
                                    <div className="flex items-center gap-1">
                                        <CalendarIcon className="w-4 h-4" />
                                        Applied {new Date(application.submittedAt).toLocaleDateString()}
                                    </div>
                                    {application.reviewedAt && (
                                        <div className="flex items-center gap-1">
                                            <EyeIcon className="w-4 h-4" />
                                            Reviewed {new Date(application.reviewedAt).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                                        {getStatusIcon(application.status)}
                                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                    </span>

                                    {application.responses.length > 0 && (
                                        <span className="text-xs text-neutral-500">
                                            {application.responses.length} response{application.responses.length !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setSelectedApplication(application)}
                                    className="p-2 text-neutral-600 hover:text-primary-600 transition-colors"
                                    title="View Application"
                                >
                                    <EyeIcon className="w-4 h-4" />
                                </button>

                                {application.status === 'pending' && (
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleStatusUpdate(application.id, 'accepted')}
                                            disabled={updatingStatus === application.id}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors disabled:opacity-50"
                                            title="Accept"
                                        >
                                            <CheckCircleIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(application.id, 'rejected')}
                                            disabled={updatingStatus === application.id}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                                            title="Reject"
                                        >
                                            <XCircleIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Application Detail Modal */}
            {selectedApplication && (
                <ApplicationDetailModal
                    application={selectedApplication}
                    onClose={() => setSelectedApplication(null)}
                    onStatusUpdate={handleStatusUpdate}
                    isUpdating={updatingStatus === selectedApplication.id}
                />
            )}
        </div>
    );
}

interface ApplicationDetailModalProps {
    application: ApplicationSubmission;
    onClose: () => void;
    onStatusUpdate: (id: string, status: 'pending' | 'reviewed' | 'accepted' | 'rejected', notes?: string) => void;
    isUpdating: boolean;
}

function ApplicationDetailModal({ application, onClose, onStatusUpdate, isUpdating }: ApplicationDetailModalProps) {
    const [notes, setNotes] = useState(application.notes || '');
    const [showNotes, setShowNotes] = useState(false);

    const handleStatusUpdate = (status: 'pending' | 'reviewed' | 'accepted' | 'rejected') => {
        onStatusUpdate(application.id, status, notes);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                    <div>
                        <h3 className="text-xl font-semibold text-foreground">Application Details</h3>
                        <p className="text-sm text-neutral-600">{application.applicantName} - {application.applicantEmail}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                        <XCircleIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
                    <div className="space-y-6">
                        {/* Application Info */}
                        <div className="bg-neutral-50 rounded-lg p-4">
                            <h4 className="font-semibold text-foreground mb-2">Application Information</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-neutral-600">Status:</span>
                                    <span className="ml-2 font-medium">{application.status}</span>
                                </div>
                                <div>
                                    <span className="text-neutral-600">Submitted:</span>
                                    <span className="ml-2 font-medium">{new Date(application.submittedAt).toLocaleString()}</span>
                                </div>
                                {application.reviewedAt && (
                                    <div>
                                        <span className="text-neutral-600">Reviewed:</span>
                                        <span className="ml-2 font-medium">{new Date(application.reviewedAt).toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Responses */}
                        <div>
                            <h4 className="font-semibold text-foreground mb-4">Application Responses</h4>
                            <div className="space-y-4">
                                {application.responses.map((response, index) => (
                                    <div key={index} className="border border-neutral-200 rounded-lg p-4">
                                        <h5 className="font-medium text-foreground mb-2">{response.questionTitle}</h5>
                                        <div className="text-sm text-neutral-700">
                                            {Array.isArray(response.answer) ? (
                                                <ul className="list-disc list-inside">
                                                    {response.answer.map((item, i) => (
                                                        <li key={i}>
                                                            {typeof item === 'string' ? item : (item as File).name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>{typeof response.answer === 'string' ? response.answer : (response.answer as File).name}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-foreground">Notes</h4>
                                <button
                                    onClick={() => setShowNotes(!showNotes)}
                                    className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                                >
                                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                                    {showNotes ? 'Hide' : 'Add'} Notes
                                </button>
                            </div>

                            {showNotes && (
                                <div className="space-y-2">
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Add notes about this application..."
                                        rows={3}
                                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between p-6 border-t border-neutral-200">
                    <div className="text-sm text-neutral-600">
                        {application.status === 'pending' && 'This application is waiting for review'}
                    </div>

                    <div className="flex gap-2">
                        {application.status === 'pending' && (
                            <>
                                <button
                                    onClick={() => handleStatusUpdate('accepted')}
                                    disabled={isUpdating}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate('rejected')}
                                    disabled={isUpdating}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
                                >
                                    Reject
                                </button>
                            </>
                        )}
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-md hover:bg-neutral-300 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
