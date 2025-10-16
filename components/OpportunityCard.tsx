'use client';

import { motion } from 'framer-motion';
import { Opportunity } from '@/lib/api';
import {
    CalendarIcon,
    MapPinIcon,
    BuildingOfficeIcon,
    ArrowTopRightOnSquareIcon,
    BookmarkIcon as BookmarkOutlineIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { useState, memo } from 'react';
import { useAuth } from './AuthProvider';
import { api } from '@/lib/api';
import { getCategoryBadgeClasses, getCategoryLabel, OpportunityType } from '@/lib/categoryColors';

interface OpportunityCardProps {
    opportunity: Opportunity;
    isBookmarked?: boolean;
    onBookmarkChange?: (bookmarked: boolean) => void;
}

function OpportunityCard({ opportunity, isBookmarked: initialBookmarked = false, onBookmarkChange }: OpportunityCardProps) {
    const { user, idToken } = useAuth();
    const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
    const [bookmarkLoading, setBookmarkLoading] = useState(false);

    const handleBookmark = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!user || !idToken) {
            alert('Please sign in to bookmark opportunities');
            return;
        }

        setBookmarkLoading(true);
        try {
            if (isBookmarked) {
                await api.removeBookmark(opportunity.id || opportunity.objectID || '', idToken);
                setIsBookmarked(false);
                onBookmarkChange?.(false);
            } else {
                await api.addBookmark(opportunity.id || opportunity.objectID || '', idToken);
                setIsBookmarked(true);
                onBookmarkChange?.(true);
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error);
            alert('Failed to update bookmark. Please try again.');
        } finally {
            setBookmarkLoading(false);
        }
    };

    const handleApply = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!user || !idToken) {
            alert('Please sign in to apply for opportunities');
            return;
        }

        try {
            // Track application
            await api.trackApplication(opportunity.id || opportunity.objectID || '', idToken);

            // Open the opportunity URL
            if (opportunity.url) {
                window.open(opportunity.url, '_blank', 'noopener,noreferrer');
            }
        } catch (error) {
            console.error('Error tracking application:', error);
            // Still open the URL even if tracking fails
            if (opportunity.url) {
                window.open(opportunity.url, '_blank', 'noopener,noreferrer');
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="group cursor-pointer relative bg-white/50 backdrop-blur-xl rounded-comfort p-6 border border-neutral-200/60
                     hover:border-primary-300/60 transition-all duration-300"
            style={{
                boxShadow: '0 4px 12px -2px oklch(0% 0 0 / 0.06), 0 2px 8px -2px oklch(0% 0 0 / 0.04)',
                backdropFilter: 'blur(16px) saturate(180%)',
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
            }}
        >
            <div className="flex flex-col h-full gap-5">
                {/* Header with better spacing */}
                <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary-800 transition-colors leading-snug flex-1">
                        {opportunity.title}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span
                            className={getCategoryBadgeClasses(opportunity.type as OpportunityType)}
                            style={{
                                boxShadow: 'inset 0 1px 0 0 oklch(100% 0 0 / 0.2), 0 1px 2px 0 oklch(0% 0 0 / 0.08)'
                            }}
                        >
                            {getCategoryLabel(opportunity.type as OpportunityType)}
                        </span>
                        {user && (
                            <button
                                onClick={handleBookmark}
                                disabled={bookmarkLoading}
                                className="p-2 rounded-soft hover:bg-primary-50 transition-colors disabled:opacity-50"
                                aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                            >
                                {isBookmarked ? (
                                    <BookmarkSolidIcon className="w-6 h-6 text-primary-600" />
                                ) : (
                                    <BookmarkOutlineIcon className="w-6 h-6 text-neutral-400 hover:text-primary-600" />
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Description with improved hierarchy */}
                <p className="text-foreground-light leading-relaxed line-clamp-3 flex-grow">
                    {opportunity.description}
                </p>

                {/* Meta information with better spacing */}
                <div className="space-y-3 text-sm text-foreground-lighter">
                    <div className="flex items-center gap-3">
                        <BuildingOfficeIcon className="h-4 w-4 text-neutral-400" />
                        <span className="font-medium">{opportunity.organization}</span>
                    </div>

                    {opportunity.location && (
                        <div className="flex items-center gap-3">
                            <MapPinIcon className="h-4 w-4 text-neutral-400" />
                            <span>{opportunity.location}</span>
                        </div>
                    )}

                    {opportunity.deadline && (
                        <div className="flex items-center gap-3">
                            <CalendarIcon className="h-4 w-4 text-neutral-400" />
                            <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>

                {/* Tags with depth */}
                {opportunity.tags && opportunity.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {opportunity.tags.slice(0, 4).map((tag) => (
                            <span
                                key={tag}
                                className="px-3 py-1.5 bg-background-lighter text-neutral-600 rounded-full text-xs font-medium"
                                style={{
                                    boxShadow: 'inset 0 1px 2px 0 oklch(0% 0 0 / 0.04)'
                                }}
                            >
                                #{tag}
                            </span>
                        ))}
                        {opportunity.tags.length > 4 && (
                            <span className="px-3 py-1.5 text-neutral-500 text-xs font-medium">
                                +{opportunity.tags.length - 4} more
                            </span>
                        )}
                    </div>
                )}

                {/* Link with better emphasis */}
                {opportunity.url && (
                    <div className="mt-auto pt-5 border-t border-neutral-200">
                        <button
                            onClick={handleApply}
                            className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-900 font-semibold transition-all group/link"
                        >
                            <span className="group-hover/link:translate-x-0.5 transition-transform">Apply Now</span>
                            <ArrowTopRightOnSquareIcon className="h-4 w-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// Export memoized version for performance
export default memo(OpportunityCard, (prevProps, nextProps) => {
    // Custom comparison function - only re-render if these change
    return (
        prevProps.opportunity.id === nextProps.opportunity.id &&
        prevProps.isBookmarked === nextProps.isBookmarked &&
        prevProps.opportunity.title === nextProps.opportunity.title &&
        prevProps.opportunity.deadline === nextProps.opportunity.deadline
    );
});
