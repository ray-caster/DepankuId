'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('Error caught by ErrorBoundary:', error);
        console.error('Error info:', errorInfo);
        
        // Log to error tracking service in production
        if (process.env.NODE_ENV === 'production') {
            // TODO: Send to error tracking service (e.g., Sentry)
            // sentry.captureException(error, { extra: errorInfo });
        }
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null
        });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Use custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="min-h-screen bg-background flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white rounded-comfort border-2 border-red-400 p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
                        </div>
                        
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                            Oops! Something went wrong
                        </h2>
                        
                        <p className="text-foreground-light mb-6">
                            We encountered an unexpected error. Don&apos;t worry, we&apos;ve been notified and are working on it.
                        </p>
                        
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mb-6 p-4 bg-red-50 rounded-soft text-left overflow-auto">
                                <p className="text-sm font-mono text-red-800">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}
                        
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-soft border-2 border-neutral-400 hover:bg-primary-700 transition-colors"
                            >
                                Try Again
                            </button>
                            
                            <button
                                onClick={() => window.location.href = '/'}
                                className="px-6 py-3 bg-white text-foreground font-semibold rounded-soft border-2 border-neutral-400 hover:bg-neutral-50 transition-colors"
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

