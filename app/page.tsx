'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { AuthProvider } from '@/components/AuthProvider';

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
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-neutral-600">Loading...</p>
            </div>
        </div>
    );
}

export default function RootPage() {
    return (
        <AuthProvider>
            <RootRedirect />
        </AuthProvider>
    );
}