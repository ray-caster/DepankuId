'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { AuthProvider } from '@/components/AuthProvider';
import ErrorBoundary from '@/components/ErrorBoundary';

function RootRedirect() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (user) {
                // User is logged in, redirect to dashboard
                router.push('/dashboard');
            } else {
                // User is not logged in, redirect to home
                router.push('/home');
            }
        }
    }, [user, loading, router]);

    // Show loading while determining redirect
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="text-center max-w-sm mx-auto">
                <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-neutral-600 text-sm sm:text-base">Loading...</p>
                <p className="text-neutral-500 text-xs mt-2">Please wait while we redirect you</p>
            </div>
        </div>
    );
}

export default function RootPage() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <RootRedirect />
            </AuthProvider>
        </ErrorBoundary>
    );
}