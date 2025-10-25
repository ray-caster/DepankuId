import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { api } from '@/lib/api';
import { Opportunity } from '@/lib/api';

interface UseBookmarksReturn {
    bookmarks: Opportunity[];
    loading: boolean;
    error: string | null;
    isBookmarked: (opportunityId: string) => boolean;
    toggleBookmark: (opportunity: Opportunity) => Promise<void>;
    refreshBookmarks: () => Promise<void>;
}

export function useBookmarks(): UseBookmarksReturn {
    const { user, getIdToken } = useAuth();
    const [bookmarks, setBookmarks] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadBookmarks = useCallback(async () => {
        if (!user) {
            setBookmarks([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const idToken = await getIdToken();
            if (!idToken) return;

            const bookmarkData = await api.getBookmarks(idToken);
            setBookmarks(bookmarkData);
        } catch (err) {
            console.error('Error loading bookmarks:', err);
            setError(err instanceof Error ? err.message : 'Failed to load bookmarks');
        } finally {
            setLoading(false);
        }
    }, [user, getIdToken]);

    const isBookmarked = useCallback((opportunityId: string): boolean => {
        return bookmarks.some(bookmark =>
            bookmark.id === opportunityId || bookmark.objectID === opportunityId
        );
    }, [bookmarks]);

    const toggleBookmark = useCallback(async (opportunity: Opportunity) => {
        if (!user) {
            alert('Please sign in to bookmark opportunities');
            return;
        }

        const opportunityId = opportunity.id || opportunity.objectID || '';
        if (!opportunityId) return;

        const currentlyBookmarked = isBookmarked(opportunityId);

        // Optimistic update
        if (currentlyBookmarked) {
            setBookmarks(prev => prev.filter(bookmark =>
                bookmark.id !== opportunityId && bookmark.objectID !== opportunityId
            ));
        } else {
            setBookmarks(prev => [...prev, opportunity]);
        }

        try {
            const idToken = await getIdToken();
            if (!idToken) {
                // Revert optimistic update
                setBookmarks(prev => currentlyBookmarked ? [...prev, opportunity] : prev);
                return;
            }

            if (currentlyBookmarked) {
                await api.removeBookmark(opportunityId, idToken);
            } else {
                await api.addBookmark(opportunityId, idToken);
            }
        } catch (err) {
            console.error('Error toggling bookmark:', err);

            // Revert optimistic update on error
            if (currentlyBookmarked) {
                setBookmarks(prev => [...prev, opportunity]);
            } else {
                setBookmarks(prev => prev.filter(bookmark =>
                    bookmark.id !== opportunityId && bookmark.objectID !== opportunityId
                ));
            }

            alert('Failed to update bookmark. Please try again.');
        }
    }, [user, getIdToken, isBookmarked]);

    const refreshBookmarks = useCallback(async () => {
        await loadBookmarks();
    }, [loadBookmarks]);

    // Load bookmarks when user changes
    useEffect(() => {
        loadBookmarks();
    }, [loadBookmarks]);

    return {
        bookmarks,
        loading,
        error,
        isBookmarked,
        toggleBookmark,
        refreshBookmarks
    };
}
