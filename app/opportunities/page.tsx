'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import AuthModal from '@/components/AuthModal';
import Header from '@/components/Header';
import { api, Opportunity, OpportunityTemplate, SocialMediaLinks } from '@/lib/api';
import { motion } from 'framer-motion';
import {
    SparklesIcon,
    DocumentDuplicateIcon,
    CalendarIcon,
    ArrowPathIcon,
    LinkIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const SOCIAL_PLATFORMS = [
    { key: 'website', label: 'Website', placeholder: 'https://example.com' },
    { key: 'twitter', label: 'Twitter/X', placeholder: 'https://twitter.com/...' },
    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
    { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/...' },
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/...' },
    { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/...' },
    { key: 'discord', label: 'Discord', placeholder: 'https://discord.gg/...' },
    { key: 'telegram', label: 'Telegram', placeholder: 'https://t.me/...' },
];

function OpportunitiesContent() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [formData, setFormData] = useState<Partial<Opportunity>>({
        title: '',
        description: '',
        type: 'research',
        category: [],
        organization: '',
        location: '',
        deadline: '',
        url: '',
        tags: [],
        social_media: {},
        requirements: '',
        benefits: '',
        eligibility: '',
        cost: '',
        duration: '',
        application_process: '',
        contact_email: '',
        has_indefinite_deadline: false,
    });

    const [templates, setTemplates] = useState<Record<string, OpportunityTemplate>>({});
    const [categoryPresets, setCategoryPresets] = useState<Record<string, string[]>>({});
    const [tagPresets, setTagPresets] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [categoryInput, setCategoryInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showSocialMedia, setShowSocialMedia] = useState(false);
    // Security: Input validation and sanitization
    const validateInput = useCallback((field: string, value: any): string | null => {
        switch (field) {
            case 'title':
                if (!value || value.trim().length < 3) return 'Title must be at least 3 characters';
                if (value.length > 200) return 'Title must be less than 200 characters';
                break;
            case 'description':
                if (!value || value.trim().length < 10) return 'Description must be at least 10 characters';
                if (value.length > 2000) return 'Description must be less than 2000 characters';
                break;
            case 'organization':
                if (!value || value.trim().length < 2) return 'Organization must be at least 2 characters';
                if (value.length > 100) return 'Organization must be less than 100 characters';
                break;
            case 'url':
                if (value && !isValidUrl(value)) return 'Please enter a valid URL';
                break;
            case 'contact_email':
                if (value && !isValidEmail(value)) return 'Please enter a valid email address';
                break;
            case 'deadline':
                if (!formData.has_indefinite_deadline && value && !isValidDate(value)) {
                    return 'Please enter a valid date';
                }
                break;
        }
        return null;
    }, [formData.has_indefinite_deadline]);

    const isValidUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isValidDate = (dateString: string): boolean => {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date.getTime()) && date > new Date();
    };

    const sanitizeInput = (input: string): string => {
        return input
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+=/gi, '') // Remove event handlers
            .trim();
    };
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');

    useEffect(() => {
        loadPresetsAndTemplates();
        // Show auth modal if user is not signed in or if auth_redirect param exists
        const authRedirect = searchParams.get('auth_redirect');
        if (!user && (authRedirect === 'signup' || authRedirect === 'create')) {
            setShowAuthModal(true);
        } else if (!user) {
            setShowAuthModal(true);
        }
    }, [user, searchParams]);

    const loadPresetsAndTemplates = async () => {
        try {
            const [templatesData, categoriesData, tagsData] = await Promise.all([
                api.getOpportunityTemplates(),
                api.getCategoryPresets(),
                api.getTagPresets()
            ]);

            setTemplates(templatesData);
            setCategoryPresets(categoriesData);
            setTagPresets(tagsData);
        } catch (error) {
            console.error('Failed to load presets:', error);
        }
    };

    const applyTemplate = (templateKey: string) => {
        const template = templates[templateKey];
        if (template) {
            setFormData({
                ...formData,
                type: template.type as any,
                category: [...template.category],
                tags: [...template.tags],
                description: template.description,
                requirements: template.requirements || '',
                benefits: template.benefits || '',
            });
            setSelectedTemplate(templateKey);
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
            await api.createOpportunity(formData as Opportunity);
            setMessage({ type: 'success', text: 'Opportunity created successfully!' });

            // Reset form
            setFormData({
                title: '',
                description: '',
                type: 'research',
                category: [],
                organization: '',
                location: '',
                deadline: '',
                url: '',
                tags: [],
                social_media: {},
                requirements: '',
                benefits: '',
                eligibility: '',
                cost: '',
                duration: '',
                application_process: '',
                contact_email: '',
                has_indefinite_deadline: false,
            });
            setTagInput('');
            setCategoryInput('');
            setSelectedTemplate('');

            // Trigger Algolia sync
            await api.syncAlgolia();
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
            setFormData({
                ...formData,
                tags: [...(formData.tags || []), newTag],
            });
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        setFormData({
            ...formData,
            tags: formData.tags?.filter(t => t !== tag) || [],
        });
    };

    const addCategory = (cat?: string) => {
        const newCat = cat || categoryInput.trim();
        if (newCat && !formData.category?.includes(newCat)) {
            setFormData({
                ...formData,
                category: [...(formData.category || []), newCat],
            });
            setCategoryInput('');
        }
    };

    const removeCategory = (cat: string) => {
        setFormData({
            ...formData,
            category: formData.category?.filter(c => c !== cat) || [],
        });
    };

    const updateSocialMedia = (platform: string, value: string) => {
        setFormData({
            ...formData,
            social_media: {
                ...formData.social_media,
                [platform]: value || undefined
            }
        });
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <AuthModal 
                    isOpen={showAuthModal}
                    onClose={() => {
                        setShowAuthModal(false);
                        // Redirect to home if they close without signing in
                        router.push('/');
                    }}
                    onSuccess={() => {
                        setShowAuthModal(false);
                        // Remove auth_redirect param from URL
                        router.replace('/opportunities');
                    }}
                />
                <div className="pt-32 text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="text-6xl mb-6">✨</div>
                        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                            Share Your Opportunity
                        </h1>
                        <p className="text-lg text-neutral-600 mb-6 max-w-2xl mx-auto">
                            Help other students discover amazing opportunities by sharing what you know. 
                            Sign in to get started!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <div className="flex items-center gap-2 text-neutral-600">
                                <span className="text-2xl">🚀</span>
                                <span>Quick & Easy</span>
                            </div>
                            <div className="flex items-center gap-2 text-neutral-600">
                                <span className="text-2xl">🌟</span>
                                <span>Help Others Succeed</span>
                            </div>
                            <div className="flex items-center gap-2 text-neutral-600">
                                <span className="text-2xl">💯</span>
                                <span>100% Free</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-20 sm:pt-24 laptop:pt-28 pb-12 sm:pb-16 laptop:pb-20 px-4 sm:px-6 laptop:px-8">
                <div className="max-w-5xl laptop:max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-4xl font-bold text-foreground mb-2">Create New Opportunity</h1>
                        <p className="text-neutral-600">Share amazing opportunities with the community</p>
                    </motion.div>

                    {/* Templates Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-6"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <DocumentDuplicateIcon className="w-5 h-5 text-primary-600" />
                            <h2 className="text-lg font-semibold">Quick Start Templates</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {Object.entries(templates).map(([key, template]) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => applyTemplate(key)}
                                    className={`p-4 rounded-soft border-2 transition-all ${selectedTemplate === key
                                        ? 'border-primary-600 bg-primary-50'
                                        : 'border-neutral-300 hover:border-primary-400 bg-white'
                                        }`}
                                >
                                    <div className="text-2xl mb-2">
                                        {key === 'research' && '🔬'}
                                        {key === 'competition' && '🏆'}
                                        {key === 'youth-program' && '🌟'}
                                        {key === 'community' && '👥'}
                                    </div>
                                    <div className="text-sm font-semibold capitalize">{key.replace('-', ' ')}</div>
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mb-6 p-4 rounded-soft ${message.type === 'success'
                                ? 'bg-secondary-light text-secondary-dark'
                                : 'bg-red-100 text-red-700'
                                }`}
                        >
                            {message.text}
                        </motion.div>
                    )}

                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        onSubmit={handleSubmit}
                        className="card space-y-6"
                    >
                        {/* Basic Information */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-foreground border-b-2 border-neutral-200 pb-2">
                                Basic Information
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-soft focus-ring"
                                    placeholder="e.g., Stanford AI Research Program"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Description *
                                </label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={5}
                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-soft focus-ring"
                                    placeholder="Describe the opportunity in detail..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Type *
                                    </label>
                                    <select
                                        required
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-soft focus-ring"
                                    >
                                        <option value="research">Research</option>
                                        <option value="youth-program">Youth Program</option>
                                        <option value="community">Community</option>
                                        <option value="competition">Competition</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Organization *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.organization}
                                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-soft focus-ring"
                                        placeholder="e.g., Stanford University"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-soft focus-ring"
                                        placeholder="e.g., Online or Jakarta, Indonesia"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4" />
                                        Deadline
                                    </label>
                                    <div className="space-y-2">
                                        <input
                                            type="date"
                                            value={formData.deadline}
                                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value, has_indefinite_deadline: false })}
                                            disabled={formData.has_indefinite_deadline}
                                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-soft focus-ring disabled:opacity-50"
                                        />
                                        <label className="flex items-center gap-2 text-sm text-neutral-600">
                                            <input
                                                type="checkbox"
                                                checked={formData.has_indefinite_deadline}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    has_indefinite_deadline: e.target.checked,
                                                    deadline: e.target.checked ? 'indefinite' : ''
                                                })}
                                                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            <ArrowPathIcon className="w-4 h-4" />
                                            No deadline / Indefinite
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Categories & Tags */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-foreground border-b-2 border-neutral-200 pb-2">
                                Classification
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Categories
                                </label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={categoryInput}
                                        onChange={(e) => setCategoryInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                                        className="flex-1 px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-soft focus-ring"
                                        placeholder="Add category..."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => addCategory()}
                                        className="btn-secondary"
                                    >
                                        Add
                                    </button>
                                </div>

                                {/* Category Presets */}
                                {formData.type && categoryPresets[formData.type] && (
                                    <div className="mb-3">
                                        <p className="text-xs text-neutral-500 mb-2">Quick add:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {categoryPresets[formData.type].map((cat) => (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => addCategory(cat)}
                                                    disabled={formData.category?.includes(cat)}
                                                    className="text-xs px-2 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    + {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2">
                                    {formData.category?.map((cat) => (
                                        <span
                                            key={cat}
                                            className="px-3 py-1 bg-secondary-light text-secondary-dark rounded-full text-sm flex items-center gap-2"
                                        >
                                            {cat}
                                            <button
                                                type="button"
                                                onClick={() => removeCategory(cat)}
                                                className="hover:text-secondary"
                                            >
                                                <XMarkIcon className="w-4 h-4" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Tags
                                </label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                        className="flex-1 px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-soft focus-ring"
                                        placeholder="Add tag..."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => addTag()}
                                        className="btn-secondary"
                                    >
                                        Add
                                    </button>
                                </div>

                                {/* Tag Presets */}
                                <div className="mb-3">
                                    <p className="text-xs text-neutral-500 mb-2">Popular tags:</p>
                                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                                        {tagPresets.slice(0, 30).map((tag) => (
                                            <button
                                                key={tag}
                                                type="button"
                                                onClick={() => addTag(tag)}
                                                disabled={formData.tags?.includes(tag)}
                                                className="text-xs px-2 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                + {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {formData.tags?.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 bg-neutral-200 text-neutral-700 rounded-full text-sm flex items-center gap-2"
                                        >
                                            #{tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="hover:text-neutral-900"
                                            >
                                                <XMarkIcon className="w-4 h-4" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-foreground border-b-2 border-neutral-200 pb-2">
                                Additional Details
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Website URL
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-soft focus-ring"
                                        placeholder="https://example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Contact Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.contact_email}
                                        onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-soft focus-ring"
                                        placeholder="contact@example.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Duration
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-soft focus-ring"
                                        placeholder="e.g., 6 weeks, 3 months"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Cost/Fee
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.cost}
                                        onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-soft focus-ring"
                                        placeholder="e.g., Free, $100, Rp 500.000"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Requirements
                                </label>
                                <textarea
                                    value={formData.requirements}
                                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-soft focus-ring"
                                    placeholder="List the requirements (use bullet points)..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Benefits
                                </label>
                                <textarea
                                    value={formData.benefits}
                                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-soft focus-ring"
                                    placeholder="What participants will gain..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Eligibility Criteria
                                </label>
                                <textarea
                                    value={formData.eligibility}
                                    onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-soft focus-ring"
                                    placeholder="Who can apply..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Application Process
                                </label>
                                <textarea
                                    value={formData.application_process}
                                    onChange={(e) => setFormData({ ...formData, application_process: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-soft focus-ring"
                                    placeholder="How to apply (step by step)..."
                                />
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <div className="space-y-4">
                            <button
                                type="button"
                                onClick={() => setShowSocialMedia(!showSocialMedia)}
                                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                            >
                                <LinkIcon className="w-5 h-5" />
                                {showSocialMedia ? 'Hide' : 'Add'} Social Media Links
                                <SparklesIcon className="w-4 h-4" />
                            </button>

                            {showSocialMedia && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-soft"
                                >
                                    {SOCIAL_PLATFORMS.map(({ key, label, placeholder }) => (
                                        <div key={key}>
                                            <label className="block text-sm font-medium text-foreground mb-1">
                                                {label}
                                            </label>
                                            <input
                                                type="url"
                                                value={(formData.social_media as any)?.[key] || ''}
                                                onChange={(e) => updateSocialMedia(key, e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-soft focus-ring text-sm"
                                                placeholder={placeholder}
                                            />
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </div>

                        {/* Submit */}
                        <div className="pt-4 border-t-2 border-neutral-200">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating...' : '✨ Create Opportunity'}
                            </button>
                        </div>
                    </motion.form>
                </div>
            </main>
        </div>
    );
}

export default function OpportunitiesPage() {
    return (
        <AuthProvider>
            <OpportunitiesContent />
        </AuthProvider>
    );
}

