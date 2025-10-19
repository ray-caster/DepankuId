'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { api, Opportunity } from '@/lib/api';

interface OpportunityContextType {
    myOpportunities: Opportunity[];
    loading: boolean;
    error: string | null;
    refreshOpportunities: () => Promise<void>;
    addOpportunity: (opportunity: Opportunity) => void;
    updateOpportunity: (id: string, updates: Partial<Opportunity>) => void;
    removeOpportunity: (id: string) => void;
    getOpportunityById: (id: string) => Opportunity | undefined;
}

const OpportunityContext = createContext<OpportunityContextType | undefined>(undefined);

export function useMyOpportunities() {
    const context = useContext(OpportunityContext);
    if (context === undefined) {
        throw new Error('useMyOpportunities must be used within an OpportunityProvider');
    }
    return context;
}

interface OpportunityProviderProps {
    children: ReactNode;
}

export function OpportunityProvider({ children }: OpportunityProviderProps) {
    const { user, getIdToken } = useAuth();
    const [myOpportunities, setMyOpportunities] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastFetch, setLastFetch] = useState<Date | null>(null);

    const refreshOpportunities = useCallback(async () => {
        if (!user) {
            setMyOpportunities([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const idToken = await getIdToken();
            if (!idToken) return;

            const opportunities = await api.getMyOpportunities(idToken);
            setMyOpportunities(opportunities);
            setLastFetch(new Date());
        } catch (err) {
            console.error('Error loading opportunities:', err);
            setError(err instanceof Error ? err.message : 'Failed to load opportunities');
        } finally {
            setLoading(false);
        }
    }, [user, getIdToken]);

    const addOpportunity = useCallback((opportunity: Opportunity) => {
        setMyOpportunities(prev => {
            // Check if opportunity already exists
            const exists = prev.some(opp => opp.id === opportunity.id);
            if (exists) {
                return prev.map(opp =>
                    opp.id === opportunity.id ? opportunity : opp
                );
            }
            return [opportunity, ...prev];
        });
    }, []);

    const updateOpportunity = useCallback((id: string, updates: Partial<Opportunity>) => {
        setMyOpportunities(prev =>
            prev.map(opp =>
                opp.id === id ? { ...opp, ...updates } : opp
            )
        );
    }, []);

    const removeOpportunity = useCallback((id: string) => {
        setMyOpportunities(prev => prev.filter(opp => opp.id !== id));
    }, []);

    const getOpportunityById = useCallback((id: string) => {
        return myOpportunities.find(opp => opp.id === id);
    }, [myOpportunities]);

    // Auto-refresh opportunities when user changes
    useEffect(() => {
        if (user) {
            refreshOpportunities();
        } else {
            setMyOpportunities([]);
            setLastFetch(null);
        }
    }, [user, refreshOpportunities]);

    // Auto-refresh every 5 minutes if user is active
    useEffect(() => {
        if (!user || !lastFetch) return;

        const interval = setInterval(() => {
            const now = new Date();
            const timeSinceLastFetch = now.getTime() - lastFetch.getTime();
            const fiveMinutes = 5 * 60 * 1000;

            if (timeSinceLastFetch >= fiveMinutes) {
                refreshOpportunities();
            }
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [user, lastFetch, refreshOpportunities]);

    const value: OpportunityContextType = {
        myOpportunities,
        loading,
        error,
        refreshOpportunities,
        addOpportunity,
        updateOpportunity,
        removeOpportunity,
        getOpportunityById,
    };

    return (
        <OpportunityContext.Provider value={value}>
            {children}
        </OpportunityContext.Provider>
    );
}
