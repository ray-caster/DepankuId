'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Opportunity } from '@/lib/api';
import {
    CalendarIcon,
    MapPinIcon,
    BuildingOfficeIcon,
    ArrowTopRightOnSquareIcon,
    BookmarkIcon as BookmarkOutlineIcon,
    EyeIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { memo, useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { api } from '@/lib/api';
import { getCategoryBadgeClasses, getCategoryLabel, OpportunityType } from '@/lib/categoryColors';
import { useBookmarks } from '@/hooks/useBookmarks';
import Link from 'next/link';
import Image from 'next/image';

interface OpportunityCardProps {
    opportunity: Opportunity;
    isBookmarked?: boolean;
    onBookmarkChange?: (bookmarked: boolean) => void;
}

function OpportunityCard({ opportunity, isBookmarked: initialBookmarked = false, onBookmarkChange }: OpportunityCardProps) {
    const { user, getIdToken } = useAuth();
    const { isBookmarked, toggleBookmark } = useBookmarks();
    const [hasApplied, setHasApplied] = useState(false);
    const [checkingApplicationStatus, setCheckingApplicationStatus] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Check if user has already applied to this opportunity
    useEffect(() => {
        const checkApplicationStatus = async () => {
            if (!user) {
                setHasApplied(false);
                return;
            }

            const opportunityId = opportunity.id || opportunity.objectID;
            if (!opportunityId) return;

            setCheckingApplicationStatus(true);
            try {
                const idToken = await getIdToken();
                if (idToken) {
                    const status = await api.getApplicationStatus(opportunityId, idToken);
                    setHasApplied(status.has_applied);
                }
            } catch (error) {
                console.error('Error checking application status:', error);
            } finally {
                setCheckingApplicationStatus(false);
            }
        };

        checkApplicationStatus();
    }, [user, opportunity.id, opportunity.objectID, getIdToken]);

    const handleBookmark = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await toggleBookmark(opportunity);
        onBookmarkChange?.(isBookmarked(opportunity.id || opportunity.objectID || ''));
    };

    const handleApply = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!user) {
            alert('Please sign in to apply for opportunities');
            return;
        }

        // Redirect to application page
        const opportunityId = opportunity.id || opportunity.objectID;
        if (opportunityId) {
            window.location.href = `/application/${opportunityId}`;
        }
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (opportunity.images && opportunity.images.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % opportunity.images!.length);
        }
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (opportunity.images && opportunity.images.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + opportunity.images!.length) % opportunity.images!.length);
        }
    };

    const openImageModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowImageModal(true);
    };

    const openDetailModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDetailModal(true);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="group cursor-pointer relative bg-white/50 backdrop-blur-xl rounded-comfort overflow-hidden border border-neutral-200/60
                         hover:border-primary-300/60 transition-all duration-300"
                style={{
                    boxShadow: '0 4px 12px -2px oklch(0% 0 0 / 0.06), 0 2px 8px -2px oklch(0% 0 0 / 0.04)',
                    backdropFilter: 'blur(16px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                }}
            >
                {/* Image Carousel */}
                {opportunity.images && opportunity.images.length > 0 && (
                    <div className="relative h-48 bg-gradient-to-br from-primary-50 to-primary-100 overflow-hidden rounded-t-comfort">
                        <div className="relative w-full h-full">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentImageIndex}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full h-full relative cursor-pointer"
                                    onClick={openImageModal}
                                >
                                    <Image
                                        src={opportunity.images[currentImageIndex]}
                                        alt={`${opportunity.title} - Image ${currentImageIndex + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Image Navigation */}
                            {opportunity.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all backdrop-blur-sm"
                                    >
                                        <ChevronLeftIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all backdrop-blur-sm"
                                    >
                                        <ChevronRightIcon className="w-4 h-4" />
                                    </button>
                                </>
                            )}

                            {/* Image Counter */}
                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/40 text-white text-xs rounded-full backdrop-blur-sm">
                                {currentImageIndex + 1} / {opportunity.images.length}
                            </div>

                            {/* View Images Button */}
                            <button
                                onClick={openImageModal}
                                className="absolute top-2 right-2 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all backdrop-blur-sm"
                            >
                                <EyeIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                <div className="p-6 flex flex-col h-full gap-5">
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
                                    className="p-2 rounded-soft hover:bg-primary-50 transition-colors"
                                    aria-label={isBookmarked(opportunity.id || opportunity.objectID || '') ? 'Remove bookmark' : 'Add bookmark'}
                                >
                                    {isBookmarked(opportunity.id || opportunity.objectID || '') ? (
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

                    {/* Action buttons */}
                    <div className="mt-auto pt-5 border-t border-neutral-200">
                        <div className="flex items-center justify-between gap-4">
                            <button
                                onClick={openDetailModal}
                                className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 font-medium transition-all group/link"
                            >
                                <EyeIcon className="h-4 w-4 group-hover/link:scale-110 transition-transform" />
                                <span className="group-hover/link:translate-x-0.5 transition-transform">View Details</span>
                            </button>

                            <button
                                onClick={handleApply}
                                disabled={checkingApplicationStatus}
                                className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-900 font-semibold transition-all group/link disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {checkingApplicationStatus ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                                        <span>Checking...</span>
                                    </>
                                ) : hasApplied ? (
                                    <>
                                        <span className="group-hover/link:translate-x-0.5 transition-transform">Edit Application</span>
                                        <ArrowTopRightOnSquareIcon className="h-4 w-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                    </>
                                ) : (
                                    <>
                                        <span className="group-hover/link:translate-x-0.5 transition-transform">Apply Now</span>
                                        <ArrowTopRightOnSquareIcon className="h-4 w-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Image Modal */}
            <AnimatePresence>
                {showImageModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowImageModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative w-full h-[80vh]">
                                <Image
                                    src={opportunity.images?.[currentImageIndex] || ''}
                                    alt={`${opportunity.title} - Image ${currentImageIndex + 1}`}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                                />

                                {/* Close button */}
                                <button
                                    onClick={() => setShowImageModal(false)}
                                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>

                                {/* Navigation */}
                                {opportunity.images && opportunity.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all"
                                        >
                                            <ChevronLeftIcon className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all"
                                        >
                                            <ChevronRightIcon className="w-6 h-6" />
                                        </button>
                                    </>
                                )}

                                {/* Image counter */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 text-white text-sm rounded-full backdrop-blur-sm">
                                    {currentImageIndex + 1} / {opportunity.images?.length}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Detail Modal */}
            <AnimatePresence>
                {showDetailModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowDetailModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="max-h-[90vh] overflow-y-auto">
                                {/* Header */}
                                <div className="sticky top-0 bg-white border-b border-neutral-200 p-6 flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-foreground">{opportunity.title}</h2>
                                    <button
                                        onClick={() => setShowDetailModal(false)}
                                        className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                                    >
                                        <XMarkIcon className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-6">
                                    {/* Images */}
                                    {opportunity.images && opportunity.images.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-foreground">Images</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {opportunity.images.map((image, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative w-full h-32 rounded-lg cursor-pointer hover:opacity-80 transition-opacity overflow-hidden"
                                                        onClick={() => {
                                                            setCurrentImageIndex(index);
                                                            setShowImageModal(true);
                                                            setShowDetailModal(false);
                                                        }}
                                                    >
                                                        <Image
                                                            src={image}
                                                            alt={`${opportunity.title} - Image ${index + 1}`}
                                                            fill
                                                            className="object-cover"
                                                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Basic Information */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-neutral-600">Organization</label>
                                                <p className="text-foreground">{opportunity.organization}</p>
                                            </div>
                                            {opportunity.location && (
                                                <div>
                                                    <label className="text-sm font-medium text-neutral-600">Location</label>
                                                    <p className="text-foreground">{opportunity.location}</p>
                                                </div>
                                            )}
                                            {opportunity.deadline && (
                                                <div>
                                                    <label className="text-sm font-medium text-neutral-600">Deadline</label>
                                                    <p className="text-foreground">{new Date(opportunity.deadline).toLocaleDateString()}</p>
                                                </div>
                                            )}
                                            <div>
                                                <label className="text-sm font-medium text-neutral-600">Type</label>
                                                <span className={getCategoryBadgeClasses(opportunity.type as OpportunityType)}>
                                                    {getCategoryLabel(opportunity.type as OpportunityType)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-foreground">Description</h3>
                                        <p className="text-foreground leading-relaxed">{opportunity.description}</p>
                                    </div>

                                    {/* Additional Information */}
                                    {opportunity.benefits && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-foreground">Benefits</h3>
                                            <p className="text-foreground leading-relaxed">{opportunity.benefits}</p>
                                        </div>
                                    )}

                                    {opportunity.eligibility && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-foreground">Eligibility</h3>
                                            <p className="text-foreground leading-relaxed">{opportunity.eligibility}</p>
                                        </div>
                                    )}

                                    {opportunity.cost && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-foreground">Cost</h3>
                                            <p className="text-foreground leading-relaxed">{opportunity.cost}</p>
                                        </div>
                                    )}

                                    {opportunity.duration && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-foreground">Duration</h3>
                                            <p className="text-foreground leading-relaxed">{opportunity.duration}</p>
                                        </div>
                                    )}

                                    {opportunity.application_process && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-foreground">Application Process</h3>
                                            <p className="text-foreground leading-relaxed">{opportunity.application_process}</p>
                                        </div>
                                    )}

                                    {/* Custom Fields */}
                                    {opportunity.additional_info && Object.keys(opportunity.additional_info).length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-foreground">Additional Information</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {Object.entries(opportunity.additional_info).map(([key, value]) => (
                                                    <div key={key}>
                                                        <label className="text-sm font-medium text-neutral-600 capitalize">
                                                            {key.replace(/_/g, ' ')}
                                                        </label>
                                                        <p className="text-foreground">
                                                            {Array.isArray(value) ? value.join(', ') : String(value)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Tags */}
                                    {opportunity.tags && opportunity.tags.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-foreground">Tags</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {opportunity.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-sm"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Contact Information */}
                                    {opportunity.contact_email && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-foreground">Contact</h3>
                                            <p className="text-foreground">
                                                <a href={`mailto:${opportunity.contact_email}`} className="text-primary-600 hover:text-primary-700">
                                                    {opportunity.contact_email}
                                                </a>
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="sticky bottom-0 bg-white border-t border-neutral-200 p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {user && (
                                            <button
                                                onClick={handleBookmark}
                                                className="flex items-center gap-2 px-4 py-2 text-neutral-600 hover:text-primary-600 transition-colors"
                                            >
                                                {isBookmarked(opportunity.id || opportunity.objectID || '') ? (
                                                    <BookmarkSolidIcon className="w-5 h-5" />
                                                ) : (
                                                    <BookmarkOutlineIcon className="w-5 h-5" />
                                                )}
                                                {isBookmarked(opportunity.id || opportunity.objectID || '') ? 'Bookmarked' : 'Bookmark'}
                                            </button>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleApply}
                                        disabled={checkingApplicationStatus}
                                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {checkingApplicationStatus ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Checking...</span>
                                            </>
                                        ) : hasApplied ? (
                                            'Edit Application'
                                        ) : (
                                            'Apply Now'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

// Export memoized version for performance
export default memo(OpportunityCard, (prevProps, nextProps) => {
    // Custom comparison function - only re-render if these change
    return (
        prevProps.opportunity.id === nextProps.opportunity.id &&
        prevProps.opportunity.title === nextProps.opportunity.title &&
        prevProps.opportunity.deadline === nextProps.opportunity.deadline
    );
});
