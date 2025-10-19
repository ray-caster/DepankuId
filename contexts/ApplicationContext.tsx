'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { api } from '@/lib/api';

interface ApplicationSubmission {
    id: string;
    opportunityId: string;
    applicantId: string;
    applicantEmail: string;
    applicantName: string;
    responses: any[];
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
    submittedAt: string;
    reviewedAt?: string;
    notes?: string;
    title?: string;
    organization?: string;
    type?: string;
    location?: string;
    deadline?: string;
    url?: string;
}

interface ApplicationContextType {
    applications: ApplicationSubmission[];
    loading: boolean;
    error: string | null;
    refreshApplications: () => Promise<void>;
    addApplication: (application: ApplicationSubmission) => void;
    updateApplication: (id: string, updates: Partial<ApplicationSubmission>) => void;
    removeApplication: (id: string) => void;
    getApplicationById: (id: string) => ApplicationSubmission | undefined;
    getApplicationsByOpportunity: (opportunityId: string) => ApplicationSubmission[];
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export function useApplications() {
    const context = useContext(ApplicationContext);
    if (context === undefined) {
        throw new Error('useApplications must be used within an ApplicationProvider');
    }
    return context;
}

interface ApplicationProviderProps {
    children: ReactNode;
}

export function ApplicationProvider({ children }: ApplicationProviderProps) {
    const { user, getIdToken } = useAuth();
    const [applications, setApplications] = useState<ApplicationSubmission[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastFetch, setLastFetch] = useState<Date | null>(null);

    const refreshApplications = useCallback(async () => {
        if (!user) {
            setApplications([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const idToken = await getIdToken();
            if (!idToken) return;

            const userApplications = await api.getMyApplications(idToken);
            setApplications(userApplications);
            setLastFetch(new Date());
        } catch (err) {
            console.error('Error loading applications:', err);
            setError(err instanceof Error ? err.message : 'Failed to load applications');
        } finally {
            setLoading(false);
        }
    }, [user, getIdToken]);

    const addApplication = useCallback((application: ApplicationSubmission) => {
        setApplications(prev => {
            // Check if application already exists
            const exists = prev.some(app => app.id === application.id);
            if (exists) {
                return prev.map(app =>
                    app.id === application.id ? application : app
                );
            }
            return [application, ...prev];
        });
    }, []);

    const updateApplication = useCallback((id: string, updates: Partial<ApplicationSubmission>) => {
        setApplications(prev =>
            prev.map(app =>
                app.id === id ? { ...app, ...updates } : app
            )
        );
    }, []);

    const removeApplication = useCallback((id: string) => {
        setApplications(prev => prev.filter(app => app.id !== id));
    }, []);

    const getApplicationById = useCallback((id: string) => {
        return applications.find(app => app.id === id);
    }, [applications]);

    const getApplicationsByOpportunity = useCallback((opportunityId: string) => {
        return applications.filter(app => app.opportunityId === opportunityId);
    }, [applications]);

    // Auto-refresh applications when user changes
    useEffect(() => {
        if (user) {
            refreshApplications();
        } else {
            setApplications([]);
            setLastFetch(null);
        }
    }, [user, refreshApplications]);

    // Auto-refresh every 5 minutes if user is active
    useEffect(() => {
        if (!user || !lastFetch) return;

        const interval = setInterval(() => {
            const now = new Date();
            const timeSinceLastFetch = now.getTime() - lastFetch.getTime();
            const fiveMinutes = 5 * 60 * 1000;

            if (timeSinceLastFetch >= fiveMinutes) {
                refreshApplications();
            }
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [user, lastFetch, refreshApplications]);

    const value: ApplicationContextType = {
        applications,
        loading,
        error,
        refreshApplications,
        addApplication,
        updateApplication,
        removeApplication,
        getApplicationById,
        getApplicationsByOpportunity,
    };

    return (
        <ApplicationContext.Provider value={value}>
            {children}
        </ApplicationContext.Provider>
    );
}
