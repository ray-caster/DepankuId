'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import { getIdToken } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import AuthModal from '@/components/AuthModal';
import Header from '@/components/Header';
import ErrorModal, { ModerationErrorModal, SuccessModal } from '@/components/ErrorModal';
import { ErrorManager, AppError } from '@/lib/errors';
import { api, Opportunity, OpportunityTemplate, SocialMediaLinks } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import ApplicationFormBuilder from '@/components/ApplicationFormBuilder';
import Image from 'next/image';
import {
    SparklesIcon,
    DocumentDuplicateIcon,
    DocumentIcon,
    CalendarIcon,
    ArrowPathIcon,
    LinkIcon,
    XMarkIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    TrashIcon,
    PencilIcon
} from '@heroicons/react/24/outline';

const SOCIAL_PLATFORMS = [
    { key: 'twitter', label: 'Twitter/X', placeholder: 'https://twitter.com/...' },
    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
    { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/...' },
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/...' },
    { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/...' },
    { key: 'discord', label: 'Discord', placeholder: 'https://discord.gg/...' },
    { key: 'telegram', label: 'Telegram', placeholder: 'https://t.me/...' },
];

const SECTIONS = [
    { id: 'basic', label: 'Basic Info', icon: DocumentDuplicateIcon },
    { id: 'application', label: 'Application Form', icon: CalendarIcon },
    { id: 'links', label: 'Links & Social', icon: LinkIcon },
];

function OpportunitiesContent() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [currentSection, setCurrentSection] = useState('basic');
    const [formData, setFormData] = useState<Partial<Opportunity>>({
        title: '',
        description: '',
        type: 'research',
        organization: '',
        location: '',
        deadline: '',
        url: '',
        tags: [],
        social_media: {},
        benefits: '',
        eligibility: '',
        cost: '',
        duration: '',
        application_process: '',
        contact_email: '',
        has_indefinite_deadline: false,
    });

    const [templates, setTemplates] = useState<Record<string, OpportunityTemplate>>({});
    const [tagPresets, setTagPresets] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showSocialMedia, setShowSocialMedia] = useState(false);
    const [applicationForm, setApplicationForm] = useState<any>({
        id: '',
        title: 'Application Form',
        description: '',
        pages: [{
            id: 'page_1',
            title: 'Page 1',
            questions: []
        }]
    });

    // Error modal states
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [currentError, setCurrentError] = useState<AppError | undefined>(undefined);
    const [showModerationModal, setShowModerationModal] = useState(false);
    const [moderationData, setModerationData] = useState<{ issues: string[]; moderation_notes: string } | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successData, setSuccessData] = useState<{ title: string; message: string } | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [isDraft, setIsDraft] = useState(false);
    const [draftId, setDraftId] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [customFields, setCustomFields] = useState<Record<string, any>>({});
    const [loadingEdit, setLoadingEdit] = useState(false);

    // Auto-save functionality - only for drafts
    const autoSave = useCallback(async () => {
        if (!user || !formData.title || loading) return; // Don't auto-save while submitting
        if (!isDraft) return; // Only auto-save if it's a draft

        try {
            const idToken = await getIdToken(auth.currentUser!);
            const draftData = { ...formData, status: 'draft' } as Opportunity;

            if (draftId) {
                // Update existing draft
                await api.updateOpportunity(draftId, draftData, idToken);
                console.log('Draft updated:', draftId);
            } else {
                // Create new draft - backend will handle duplicate prevention
                const result = await api.createOpportunity(draftData, idToken);
                if (result.id) {
                    setDraftId(result.id);
                    console.log('Draft created/updated:', result.id);
                }
            }
        } catch (error) {
            console.error('Auto-save failed:', error);
        }
    }, [user, formData, draftId, loading, isDraft]);

    // Handle edit mode
    useEffect(() => {
        const editParam = searchParams.get('edit');
        if (editParam && user) {
            setIsEditMode(true);
            setEditId(editParam);
            // Load the opportunity data for editing
            loadOpportunityForEdit(editParam);
        }
    }, [searchParams, user]);

    const loadOpportunityForEdit = async (opportunityId: string) => {
        setLoadingEdit(true);
        try {
            const idToken = await getIdToken(auth.currentUser!);
            const opportunity = await api.getOpportunity(opportunityId);
            if (opportunity) {
                setFormData(opportunity);
                setIsDraft(opportunity.status === 'draft');
                setDraftId(opportunityId);

                // Load existing application form if it exists
                if (opportunity.application_form) {
                    setApplicationForm(opportunity.application_form);
                } else {
                    // Reset to default if no form exists
                    setApplicationForm({
                        id: '',
                        title: 'Application Form',
                        description: '',
                        pages: [{
                            id: 'page_1',
                            title: 'Page 1',
                            questions: []
                        }]
                    });
                }

                // Load existing images and custom fields
                // Convert blob URLs to base64 if needed
                const images = opportunity.images || [];
                const processedImages = images.map(img => {
                    // If it's a blob URL, we need to convert it to base64
                    if (img.startsWith('blob:')) {
                        // For now, we'll skip blob URLs as they're not accessible
                        // In a real app, you'd need to store base64 or upload to a storage service
                        return null;
                    }
                    return img;
                }).filter((img): img is string => img !== null); // Remove null values and type guard

                setUploadedImages(processedImages);
                setCustomFields(opportunity.additional_info || {});
            }
        } catch (error) {
            console.error('Failed to load opportunity for edit:', error);
            setMessage({ type: 'error', text: 'Failed to load opportunity for editing' });
        } finally {
            setLoadingEdit(false);
        }
    };

    // Auto-save on form changes - only for drafts
    useEffect(() => {
        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current);
        }

        // Don't auto-save if loading, not a draft, or if we're in edit mode with a published opportunity
        if (loading || !isDraft || (isEditMode && editId && !isDraft)) {
            return;
        }

        const timeout = setTimeout(() => {
            autoSave();
        }, 2000); // Auto-save after 2 seconds of inactivity

        autoSaveTimeoutRef.current = timeout;

        return () => {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, [formData, autoSave, loading, isEditMode, editId, isDraft]);

    // Load templates and presets
    useEffect(() => {
        const loadData = async () => {
            try {
                const [templatesData, tagPresetsData] = await Promise.all([
                    api.getOpportunityTemplates(),
                    api.getTagPresets()
                ]);
                setTemplates(templatesData);
                setTagPresets(tagPresetsData);
            } catch (error) {
                console.error('Error loading templates:', error);
            }
        };
        loadData();
    }, []);

    // Check for existing drafts when user changes
    useEffect(() => {
        const checkExistingDrafts = async () => {
            if (!user || !formData.title) return;

            try {
                const idToken = await getIdToken(auth.currentUser!);
                // The backend will now handle finding existing drafts
                // We'll let the auto-save mechanism handle this
            } catch (error) {
                console.error('Failed to check existing drafts:', error);
            }
        };

        if (user && formData.title) {
            checkExistingDrafts();
        }
    }, [user, formData.title]);

    const applyTemplate = (templateKey: string) => {
        const template = templates[templateKey];
        if (template) {
            setFormData(prev => ({
                ...prev,
                type: template.type as 'research' | 'competition' | 'youth-program' | 'community',
                tags: template.tags,
                description: template.description,
                benefits: template.benefits || ''
            }));
            setSelectedTemplate(templateKey);
        }
    };

    const handlePublish = async () => {
        if (!user || !draftId) {
            const error = ErrorManager.getError('OPP_006', isEditMode ? 'Updating Opportunity' : 'Publishing Opportunity');
            setCurrentError(error);
            setShowErrorModal(true);
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const idToken = await getIdToken(auth.currentUser!);

            // Prepare update data
            const updateData: Opportunity = {
                title: formData.title || '',
                description: formData.description || '',
                type: formData.type || 'research',
                organization: formData.organization || '',
                tags: formData.tags || [],
                ...formData,
                application_form: applicationForm,
                images: uploadedImages,
                additional_info: customFields
            };

            // Check if this is an update to a published opportunity
            const isUpdate = isEditMode && formData.status === 'published';

            if (isUpdate) {
                // For published opportunities, just update and keep status as published
                updateData.status = 'published';
                await api.updateOpportunity(draftId, updateData, idToken);
            } else {
                // For new opportunities or drafts, update then publish
                await api.updateOpportunity(draftId, updateData, idToken);
                await api.publishOpportunity(draftId, idToken);
            }

            // Show success modal with appropriate message
            setSuccessData({
                title: isUpdate ? 'Opportunity Updated!' : 'Opportunity Published!',
                message: isUpdate
                    ? 'Your opportunity has been successfully updated and is now visible to users.'
                    : 'Your opportunity has been successfully published and is now visible to users.'
            });
            setShowSuccessModal(true);

            // Only reset form if creating a new opportunity, not when updating
            if (!isUpdate) {
                setIsDraft(false);
                setDraftId(null);

                // Reset form after successful publishing
                setFormData({
                    title: '',
                    description: '',
                    type: 'research',
                    organization: '',
                    location: '',
                    deadline: '',
                    url: '',
                    tags: [],
                    social_media: {},
                    benefits: '',
                    eligibility: '',
                    cost: '',
                    duration: '',
                    application_process: '',
                    contact_email: '',
                    has_indefinite_deadline: false,
                });
                setApplicationForm({
                    id: '',
                    title: 'Application Form',
                    description: '',
                    pages: [{
                        id: 'page_1',
                        title: 'Application Information',
                        description: '',
                        questions: []
                    }],
                    settings: {
                        allowMultipleSubmissions: false,
                        collectEmail: true,
                        showProgressBar: true
                    }
                });
                setTagInput('');
                setSelectedTemplate('');
                setCurrentSection('basic');
            }

            // Trigger Algolia sync
            await api.syncAlgolia();

        } catch (error) {
            console.error('Error publishing opportunity:', error);

            // Check if it's a moderation error
            if (error instanceof Error && (error as any).moderationData) {
                const moderationData = (error as any).moderationData;
                setModerationData({
                    issues: moderationData.issues || [],
                    moderation_notes: moderationData.moderation_notes || ''
                });
                setShowModerationModal(true);
            } else {
                // Handle other errors
                let appError: AppError;
                if (error instanceof Error && (error as any).appError) {
                    appError = (error as any).appError;
                } else {
                    appError = ErrorManager.getErrorFromException(error, isEditMode ? 'Updating Opportunity' : 'Publishing Opportunity');
                }
                setCurrentError(appError);
                setShowErrorModal(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            setMessage({ type: 'error', text: 'Please sign in to create opportunities' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const idToken = await getIdToken(auth.currentUser!);
            const submissionData: Opportunity = {
                title: formData.title || '',
                description: formData.description || '',
                type: formData.type || 'research',
                organization: formData.organization || '',
                tags: formData.tags || [],
                ...formData,
                application_form: applicationForm,
                images: uploadedImages,
                additional_info: customFields,
                status: 'draft'
            };

            let result;
            if (isEditMode && editId) {
                result = await api.updateOpportunity(editId, submissionData, idToken);
            } else {
                result = await api.createOpportunity(submissionData, idToken);
            }

            if (result.status === 'rejected') {
                setMessage({
                    type: 'error',
                    text: `Opportunity rejected: ${result.message}. Issues: ${result.issues?.join(', ')}`
                });
                return;
            }

            setMessage({
                type: 'success',
                text: isEditMode ? 'Draft updated successfully!' : 'Draft saved successfully!'
            });

            // Set as draft
            setIsDraft(true);
            if (result.id) {
                setDraftId(result.id);
            }

            // Clear auto-save timeout
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
                autoSaveTimeoutRef.current = null;
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to create opportunity' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const addTag = (tag?: string) => {
        const newTag = tag || tagInput.trim();
        if (newTag && !formData.tags?.includes(newTag)) {
            setFormData(prev => ({
                ...prev,
                tags: [...(prev.tags || []), newTag]
            }));
        }
        setTagInput('');
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
        }));
    };

    const updateSocialMedia = (platform: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            social_media: {
                ...prev.social_media,
                [platform]: value
            }
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked,
            }));
        } else {
            let processedValue = value;
            // Auto-add https:// to URL fields
            if (name === 'url' && value) {
                processedValue = value.startsWith('http') ? value : `https://${value}`;
            }
            setFormData(prev => ({
                ...prev,
                [name]: processedValue,
            }));
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Check if adding these files would exceed the limit
        if (uploadedImages.length + files.length > 10) {
            alert('Maximum 10 images allowed');
            return;
        }

        setUploadingImages(true);
        try {
            const uploadPromises = files.map(async (file) => {
                // Convert file to base64 for persistent storage
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            });

            const newImageUrls = await Promise.all(uploadPromises);
            setUploadedImages(prev => [...prev, ...newImageUrls]);
        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Error uploading images. Please try again.');
        } finally {
            setUploadingImages(false);
        }
    };

    const removeImage = (index: number) => {
        setUploadedImages(prev => {
            const newImages = [...prev];
            newImages.splice(index, 1);
            return newImages;
        });
    };

    const addCustomField = () => {
        const fieldKey = `field_${Date.now()}`;
        setCustomFields(prev => ({
            ...prev,
            [fieldKey]: ''
        }));
    };

    const updateCustomFieldKey = (index: number, newKey: string) => {
        const entries = Object.entries(customFields);
        const newFields: Record<string, any> = {};

        entries.forEach(([key, value], i) => {
            if (i === index) {
                newFields[newKey] = value;
            } else {
                newFields[key] = value;
            }
        });

        setCustomFields(newFields);
    };

    const updateCustomFieldValue = (index: number, newValue: string) => {
        const entries = Object.entries(customFields);
        const newFields: Record<string, any> = {};

        entries.forEach(([key, value], i) => {
            if (i === index) {
                newFields[key] = newValue;
            } else {
                newFields[key] = value;
            }
        });

        setCustomFields(newFields);
    };

    const removeCustomField = (index: number) => {
        const entries = Object.entries(customFields);
        const newFields: Record<string, any> = {};

        entries.forEach(([key, value], i) => {
            if (i !== index) {
                newFields[key] = value;
            }
        });

        setCustomFields(newFields);
    };

    const nextSection = () => {
        const currentIndex = SECTIONS.findIndex(s => s.id === currentSection);
        if (currentIndex < SECTIONS.length - 1) {
            setCurrentSection(SECTIONS[currentIndex + 1].id);
        }
    };

    const prevSection = () => {
        const currentIndex = SECTIONS.findIndex(s => s.id === currentSection);
        if (currentIndex > 0) {
            setCurrentSection(SECTIONS[currentIndex - 1].id);
        }
    };

    const canProceed = () => {
        switch (currentSection) {
            case 'basic':
                return formData.title && formData.description && formData.organization;
            case 'application':
                return formData.benefits;
            case 'links':
                return true;
            default:
                return false;
        }
    };

    const renderBasicInfo = () => (
        <motion.div
            key="basic"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            {/* Template Selection */}
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-comfort p-6 border-2 border-primary-200">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5 text-primary-600" />
                    Quick Start Templates
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(templates).map(([key, template]) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => applyTemplate(key)}
                            className={`p-3 text-left rounded-comfort border-2 transition-all ${selectedTemplate === key
                                ? 'border-primary-500 bg-primary-100'
                                : 'border-neutral-300 hover:border-primary-400 hover:bg-primary-50'
                                }`}
                        >
                            <div className="font-medium text-sm text-foreground">{key.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                            <div className="text-xs text-neutral-600 mt-1">{template.description}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Basic Information */}
            <div className="bg-background-light rounded-gentle p-6 border-2 border-neutral-400">
                <h3 className="text-lg font-semibold text-foreground mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white border-2 border-neutral-300 rounded-comfort focus:outline-none focus:border-primary-500 text-sm"
                            placeholder="Enter opportunity title"
                            required
                        />
                    </div>

                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-3 bg-white border-2 border-neutral-300 rounded-comfort focus:outline-none focus:border-primary-500 text-sm resize-none"
                            placeholder="Describe the opportunity in detail"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Type *
                        </label>
                        <select
                            name="type"
                            value={formData.type || 'research'}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white border-2 border-neutral-300 rounded-comfort focus:outline-none focus:border-primary-500 text-sm"
                        >
                            <option value="research">Research</option>
                            <option value="competition">Competition</option>
                            <option value="youth-program">Youth Program</option>
                            <option value="community">Community</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Organization *
                        </label>
                        <input
                            type="text"
                            name="organization"
                            value={formData.organization || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white border-2 border-neutral-300 rounded-comfort focus:outline-none focus:border-primary-500 text-sm"
                            placeholder="Organization name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Location
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white border-2 border-neutral-300 rounded-comfort focus:outline-none focus:border-primary-500 text-sm"
                            placeholder="City, Country or Online"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Deadline
                        </label>
                        <input
                            type="date"
                            name="deadline"
                            value={formData.deadline || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white border-2 border-neutral-300 rounded-comfort focus:outline-none focus:border-primary-500 text-sm"
                            disabled={formData.has_indefinite_deadline}
                        />
                    </div>

                    <div className="lg:col-span-2 flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="has_indefinite_deadline"
                            checked={formData.has_indefinite_deadline || false}
                            onChange={handleChange}
                            className="w-4 h-4 text-primary-600 border-2 border-neutral-300 rounded focus:ring-primary-500"
                        />
                        <label className="text-sm text-foreground">No specific deadline (ongoing opportunity)</label>
                    </div>

                    {/* Additional Details */}
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Benefits *
                        </label>
                        <textarea
                            name="benefits"
                            value={formData.benefits || ''}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-3 bg-white border-2 border-neutral-300 rounded-comfort focus:outline-none focus:border-primary-500 text-sm resize-none"
                            placeholder="What benefits will participants receive?"
                            required
                        />
                    </div>

                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Eligibility
                        </label>
                        <textarea
                            name="eligibility"
                            value={formData.eligibility || ''}
                            onChange={handleChange}
                            rows={2}
                            className="w-full px-4 py-3 bg-white border-2 border-neutral-300 rounded-comfort focus:outline-none focus:border-primary-500 text-sm resize-none"
                            placeholder="Who is eligible to apply?"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Cost
                        </label>
                        <input
                            type="text"
                            name="cost"
                            value={formData.cost || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white border-2 border-neutral-300 rounded-comfort focus:outline-none focus:border-primary-500 text-sm"
                            placeholder="Free, $50, etc."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Duration
                        </label>
                        <input
                            type="text"
                            name="duration"
                            value={formData.duration || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white border-2 border-neutral-300 rounded-comfort focus:outline-none focus:border-primary-500 text-sm"
                            placeholder="2 weeks, 6 months, etc."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Application Process
                        </label>
                        <textarea
                            name="application_process"
                            value={formData.application_process || ''}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-3 bg-white border-2 border-neutral-300 rounded-comfort focus:outline-none focus:border-primary-500 text-sm resize-none"
                            placeholder="How do students apply? What documents are needed?"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Contact Email
                        </label>
                        <input
                            type="email"
                            name="contact_email"
                            value={formData.contact_email || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white border-2 border-neutral-300 rounded-comfort focus:outline-none focus:border-primary-500 text-sm"
                            placeholder="contact@organization.com"
                        />
                    </div>
                </div>

                {/* Image Upload Section */}
                <div className="mt-6">
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Images (up to 10)
                    </label>
                    <div className="space-y-4">
                        {/* Upload Area */}
                        <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                            <input
                                type="file"
                                id="image-upload"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                disabled={uploadingImages || uploadedImages.length >= 10}
                            />
                            <label
                                htmlFor="image-upload"
                                className={`cursor-pointer ${uploadingImages || uploadedImages.length >= 10 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className="text-neutral-500 mb-2">
                                    <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <p className="text-sm text-neutral-600">
                                    {uploadingImages ? 'Uploading...' : uploadedImages.length >= 10 ? 'Maximum 10 images reached' : 'Click to upload images'}
                                </p>
                                <p className="text-xs text-neutral-500 mt-1">
                                    {uploadedImages.length}/10 images uploaded
                                </p>
                            </label>
                        </div>

                        {/* Image Preview */}
                        {uploadedImages.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {uploadedImages.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <div className="relative w-full h-24 rounded-lg overflow-hidden">
                                            <Image
                                                src={image}
                                                alt={`Upload ${index + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                                            />
                                        </div>
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <XMarkIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Custom Fields Section */}
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium text-foreground">
                            Additional Information
                        </label>
                        <button
                            type="button"
                            onClick={addCustomField}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                            + Add Field
                        </button>
                    </div>
                    <div className="space-y-4">
                        {Object.entries(customFields).map(([key, value], index) => (
                            <div key={index} className="flex gap-4 items-end">
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-neutral-600 mb-1">
                                        Field Name
                                    </label>
                                    <input
                                        type="text"
                                        value={key}
                                        onChange={(e) => updateCustomFieldKey(index, e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-neutral-300 rounded focus:outline-none focus:border-primary-500 text-sm"
                                        placeholder="e.g., Age Requirement"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-neutral-600 mb-1">
                                        Value
                                    </label>
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) => updateCustomFieldValue(index, e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-neutral-300 rounded focus:outline-none focus:border-primary-500 text-sm"
                                        placeholder="e.g., 18-25 years old"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeCustomField(index)}
                                    className="p-2 text-red-500 hover:text-red-700"
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        {Object.keys(customFields).length === 0 && (
                            <p className="text-sm text-neutral-500 italic">No additional fields added yet</p>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const renderApplicationForm = () => (
        <motion.div
            key="application"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >

            {/* Application Form Builder */}
            <div className="bg-background-light rounded-gentle p-6 border-2 border-neutral-400">
                <h3 className="text-lg font-semibold text-foreground mb-4">Custom Application Form</h3>
                <p className="text-sm text-neutral-600 mb-6">
                    Create a custom application form with multiple question types, pages, and validation rules.
                </p>
                <ApplicationFormBuilder
                    form={applicationForm}
                    onChange={setApplicationForm}
                    isEditing={true}
                />
            </div>
        </motion.div>
    );

    const renderLinks = () => (
        <motion.div
            key="links"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="bg-background-light rounded-gentle p-6 border-2 border-neutral-400">
                <h3 className="text-lg font-semibold text-foreground mb-4">Website & Links</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Official Website
                        </label>
                        <input
                            type="url"
                            name="url"
                            value={formData.url || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white border-2 border-neutral-300 rounded-comfort focus:outline-none focus:border-primary-500 text-sm"
                            placeholder="https://example.com"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-background-light rounded-gentle p-6 border-2 border-neutral-400">
                <h3 className="text-lg font-semibold text-foreground mb-4">Social Media Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SOCIAL_PLATFORMS.map(({ key, label, placeholder }) => (
                        <div key={key}>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                {label}
                            </label>
                            <input
                                type="url"
                                value={(formData.social_media as any)?.[key] || ''}
                                onChange={(e) => updateSocialMedia(key, e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-neutral-300 rounded-comfort focus:outline-none focus:border-primary-500 text-sm"
                                placeholder={placeholder}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-background-light rounded-gentle p-6 border-2 border-neutral-400">
                <h3 className="text-lg font-semibold text-foreground mb-4">Tags</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Add Tags
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                className="flex-1 px-4 py-3 bg-white border-2 border-neutral-300 rounded-comfort focus:outline-none focus:border-primary-500 text-sm"
                                placeholder="Type a tag and press Enter"
                            />
                            <button
                                type="button"
                                onClick={() => addTag()}
                                className="px-4 py-3 bg-primary-600 text-white rounded-comfort hover:bg-primary-700 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {tagPresets.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Popular Tags
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {tagPresets.slice(0, 20).map((tag, index) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => addTag(tag)}
                                        className={`px-3 py-1 bg-neutral-200 text-neutral-700 rounded-soft text-sm hover:bg-primary-100 hover:text-primary-700 transition-colors ${index >= 8 ? 'hidden sm:block' : ''
                                            } ${index >= 12 ? 'hidden lg:block' : ''
                                            }`}
                                    >
                                        #{tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {formData.tags && formData.tags.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Selected Tags
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-soft text-sm"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="hover:text-primary-900"
                                        >
                                            <XMarkIcon className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );

    const renderSection = () => {
        switch (currentSection) {
            case 'basic':
                return renderBasicInfo();
            case 'application':
                return renderApplicationForm();
            case 'links':
                return renderLinks();
            default:
                return renderBasicInfo();
        }
    };

    // Show loading screen when loading edit data
    if (loadingEdit) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center min-h-[400px]">
                            <div className="text-center">
                                <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <h2 className="text-xl font-semibold text-foreground mb-2">Loading Opportunity</h2>
                                <p className="text-neutral-600">Please wait while we load the opportunity details...</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6 sm:mb-8">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4 text-sm sm:text-base"
                        >
                            <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                            Back to Dashboard
                        </button>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                                {isEditMode ? 'Edit Opportunity' : 'Create Opportunity'}
                            </h1>
                            {isDraft && (
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full border border-yellow-300 self-start">
                                    Draft
                                </span>
                            )}
                        </div>
                        <p className="text-sm sm:text-base text-foreground-light">
                            {isEditMode ? 'Update your opportunity details' : 'Share an educational opportunity with the community'}
                        </p>
                    </div>

                    {/* Section Tabs */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {SECTIONS.map((section) => {
                                const Icon = section.icon;
                                const isActive = currentSection === section.id;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => setCurrentSection(section.id)}
                                        className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-comfort border-2 transition-all text-xs sm:text-sm ${isActive
                                            ? 'border-primary-500 bg-primary-100 text-primary-700'
                                            : 'border-neutral-300 hover:border-primary-400 hover:bg-primary-50'
                                            }`}
                                    >
                                        <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span className="font-medium">{section.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {renderSection()}
                        </AnimatePresence>

                        {/* Navigation */}
                        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-6 border-t-2 border-neutral-200">
                            <button
                                type="button"
                                onClick={prevSection}
                                disabled={currentSection === 'basic'}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 text-neutral-600 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                            >
                                <ChevronLeftIcon className="w-4 h-4" />
                                Previous
                            </button>

                            <div className="flex flex-col sm:flex-row gap-2">
                                {currentSection === 'links' ? (
                                    <>
                                        <button
                                            type="submit"
                                            disabled={loading || !canProceed()}
                                            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-neutral-600 text-white rounded-comfort hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                                        >
                                            {loading ? (
                                                <>
                                                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <DocumentIcon className="w-4 h-4" />
                                                    Save Draft
                                                </>
                                            )}
                                        </button>
                                        {isDraft && draftId && (
                                            <button
                                                type="button"
                                                onClick={handlePublish}
                                                disabled={loading}
                                                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-primary-600 text-white rounded-comfort hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                                            >
                                                {loading ? (
                                                    <>
                                                        <ArrowPathIcon className="w-4 h-4 animate-spin" />
                                                        {isEditMode && formData.status === 'published' ? 'Updating...' : 'Publishing...'}
                                                    </>
                                                ) : (
                                                    <>
                                                        <SparklesIcon className="w-4 h-4" />
                                                        {isEditMode && formData.status === 'published' ? 'Update' : 'Publish'}
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={nextSection}
                                        disabled={!canProceed()}
                                        className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-primary-600 text-white rounded-comfort hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                                    >
                                        Next
                                        <ChevronRightIcon className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>

                    {/* Messages */}
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-6 p-4 rounded-comfort ${message.type === 'success'
                                ? 'bg-green-100 text-green-700 border-2 border-green-300'
                                : 'bg-red-100 text-red-700 border-2 border-red-300'
                                }`}
                        >
                            {message.text}
                        </motion.div>
                    )}
                </div>
            </main>

            {/* Error Modals */}
            <ErrorModal
                isOpen={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                error={currentError}
            />

            <ModerationErrorModal
                isOpen={showModerationModal}
                onClose={() => setShowModerationModal(false)}
                issues={moderationData?.issues || []}
                moderationNotes={moderationData?.moderation_notes || ''}
            />

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    // If updating an existing opportunity, redirect to dashboard
                    if (isEditMode && formData.status === 'published') {
                        router.push('/dashboard');
                    }
                }}
                title={successData?.title || 'Success'}
                message={successData?.message || 'Operation completed successfully'}
            />
        </div>
    );
}

export default function OpportunitiesPage() {
    return (
        <AuthProvider>
            <Suspense fallback={
                <div className="min-h-screen bg-background flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-neutral-600">Loading...</p>
                    </div>
                </div>
            }>
                <OpportunitiesContent />
            </Suspense>
        </AuthProvider>
    );
}