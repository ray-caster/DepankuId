'use client';

import React from 'react';
import { XMarkIcon, ExclamationTriangleIcon, InformationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { AppError } from '@/lib/errors';

interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    error?: AppError;
    title?: string;
    message?: string;
    type?: 'error' | 'warning' | 'info' | 'success';
    showErrorCode?: boolean;
    actions?: React.ReactNode;
}

export default function ErrorModal({
    isOpen,
    onClose,
    error,
    title,
    message,
    type = 'error',
    showErrorCode = true,
    actions
}: ErrorModalProps) {
    if (!isOpen) return null;

    const displayTitle = title || error?.userMessage || 'Error';
    const displayMessage = message || error?.message || 'An unexpected error occurred';
    const errorCode = error?.code;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircleIcon className="h-6 w-6 text-green-600" />;
            case 'warning':
                return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />;
            case 'info':
                return <InformationCircleIcon className="h-6 w-6 text-blue-600" />;
            default:
                return <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />;
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50';
            case 'warning':
                return 'bg-yellow-50';
            case 'info':
                return 'bg-blue-50';
            default:
                return 'bg-red-50';
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case 'success':
                return 'border-green-200';
            case 'warning':
                return 'border-yellow-200';
            case 'info':
                return 'border-blue-200';
            default:
                return 'border-red-200';
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={onClose}
                />

                {/* Modal panel */}
                <div className="relative inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                    <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ${getBackgroundColor()}`}>
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10">
                                {getIcon()}
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {displayTitle}
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        {displayMessage}
                                    </p>
                                    {showErrorCode && errorCode && (
                                        <p className="mt-2 text-xs text-gray-400 font-mono">
                                            Error Code: {errorCode}
                                        </p>
                                    )}
                                    {error?.context && (
                                        <p className="mt-1 text-xs text-gray-400">
                                            Context: {error.context}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                type="button"
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                                onClick={onClose}
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className={`px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 ${getBorderColor()} border-t`}>
                        {actions || (
                            <button
                                type="button"
                                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={onClose}
                            >
                                Close
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Specialized modals for common use cases
export function ModerationErrorModal({
    isOpen,
    onClose,
    issues,
    moderationNotes
}: {
    isOpen: boolean;
    onClose: () => void;
    issues: string[];
    moderationNotes: string;
}) {
    return (
        <ErrorModal
            isOpen={isOpen}
            onClose={onClose}
            title="Content Needs Revision"
            message="Your opportunity submission needs some adjustments before it can be published."
            type="warning"
            showErrorCode={false}
            actions={
                <div className="w-full">
                    <div className="mb-4 text-left">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Issues to address:</h4>
                        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                            {issues.map((issue, index) => (
                                <li key={index}>{issue}</li>
                            ))}
                        </ul>
                        {moderationNotes && (
                            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                <p className="text-sm text-gray-700">{moderationNotes}</p>
                            </div>
                        )}
                    </div>
                    <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:text-sm"
                        onClick={onClose}
                    >
                        I'll Fix These Issues
                    </button>
                </div>
            }
        />
    );
}

export function SuccessModal({
    isOpen,
    onClose,
    title,
    message,
    action
}: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    action?: () => void;
}) {
    return (
        <ErrorModal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            message={message}
            type="success"
            showErrorCode={false}
            actions={
                <div className="w-full">
                    {action && (
                        <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:text-sm"
                            onClick={action}
                        >
                            Continue
                        </button>
                    )}
                    <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            }
        />
    );
}
