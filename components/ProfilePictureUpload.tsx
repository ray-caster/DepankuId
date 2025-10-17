'use client';

import { useState, useRef } from 'react';
import { useAuth } from './AuthProvider';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { CameraIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { CheckIcon as CheckSolidIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

interface ProfilePictureUploadProps {
    currentPhotoURL?: string;
    onPhotoUpdate?: (newPhotoURL: string) => void;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function ProfilePictureUpload({
    currentPhotoURL,
    onPhotoUpdate,
    size = 'md',
    className = ''
}: ProfilePictureUploadProps) {
    const { user } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sizeClasses = {
        sm: 'w-16 h-16',
        md: 'w-24 h-24',
        lg: 'w-32 h-32'
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            setError('Please select a valid image file');
            return;
        }

        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            setError('Image size must be less than 2MB');
            return;
        }

        setError(null);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!user || !fileInputRef.current?.files?.[0]) return;

        setUploading(true);
        setError(null);

        try {
            const file = fileInputRef.current.files[0];
            const idToken = await user.getIdToken();

            // Upload file through backend API
            const result = await api.uploadProfilePicture(file, idToken);

            onPhotoUpdate?.(result.url);
            setPreview(null);

            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

        } catch (error) {
            console.error('Error uploading profile picture:', error);
            setError(error instanceof Error ? error.message : 'Failed to upload profile picture. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleCancel = () => {
        setPreview(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemovePhoto = async () => {
        if (!user || !currentPhotoURL) return;

        setUploading(true);
        setError(null);

        try {
            const idToken = await user.getIdToken();

            // Delete through backend API
            await api.deleteProfilePicture(idToken);

            onPhotoUpdate?.('');
        } catch (error) {
            console.error('Error removing profile picture:', error);
            setError(error instanceof Error ? error.message : 'Failed to remove profile picture. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const displayPhoto = preview || currentPhotoURL;

    return (
        <div className={`relative ${className}`}>
            {/* Profile Picture Display */}
            <div className={`${sizeClasses[size]} relative rounded-full overflow-hidden bg-neutral-100 border-2 border-neutral-200`}>
                {displayPhoto ? (
                    <Image
                        src={displayPhoto}
                        alt="Profile"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                        <CameraIcon className="w-8 h-8" />
                    </div>
                )}

                {/* Upload Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="p-2 bg-white rounded-full text-neutral-700 hover:bg-neutral-100 transition-colors disabled:opacity-50"
                    >
                        <CameraIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Loading Overlay */}
                {uploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Preview Actions */}
            <AnimatePresence>
                {preview && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white rounded-full shadow-lg border border-neutral-200 p-1"
                    >
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors disabled:opacity-50"
                            title="Confirm upload"
                        >
                            <CheckSolidIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={uploading}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                            title="Cancel"
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Remove Photo Button */}
            {currentPhotoURL && !preview && (
                <button
                    onClick={handleRemovePhoto}
                    disabled={uploading}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                    title="Remove photo"
                >
                    <XMarkIcon className="w-3 h-3" />
                </button>
            )}

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs text-center"
                >
                    {error}
                </motion.div>
            )}
        </div>
    );
}
