'use client';

import { useState } from 'react';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import Header from '@/components/Header';
import { api, Opportunity } from '@/lib/api';
import { motion } from 'framer-motion';

function AdminContent() {
    const { user } = useAuth();
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
    });
    const [tagInput, setTagInput] = useState('');
    const [categoryInput, setCategoryInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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
            });
            setTagInput('');
            setCategoryInput('');

            // Trigger Algolia sync
            await api.syncAlgolia();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to create opportunity' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
            setFormData({
                ...formData,
                tags: [...(formData.tags || []), tagInput.trim()],
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

    const addCategory = () => {
        if (categoryInput.trim() && !formData.category?.includes(categoryInput.trim())) {
            setFormData({
                ...formData,
                category: [...(formData.category || []), categoryInput.trim()],
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

    if (!user) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="pt-32 text-center">
                    <h1 className="text-2xl font-semibold mb-4">Please sign in to access the admin panel</h1>
                    <p className="text-neutral-600">You need to be authenticated to create opportunities</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-24 pb-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-4xl font-bold text-foreground mb-2">Admin Panel</h1>
                        <p className="text-neutral-600">Create new opportunities for the community</p>
                    </motion.div>

                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mb-6 p-4 rounded-soft ${message.type === 'success' ? 'bg-secondary-light text-secondary-dark' : 'bg-red-100 text-red-700'
                                }`}
                        >
                            {message.text}
                        </motion.div>
                    )}

                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        onSubmit={handleSubmit}
                        className="card space-y-6"
                    >
                        {/* Title */}
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

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Description *
                            </label>
                            <textarea
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-soft focus-ring"
                                placeholder="Describe the opportunity..."
                            />
                        </div>

                        {/* Type & Organization */}
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

                        {/* Location & Deadline */}
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
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Deadline
                                </label>
                                <input
                                    type="date"
                                    value={formData.deadline}
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-soft focus-ring"
                                />
                            </div>
                        </div>

                        {/* URL */}
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

                        {/* Categories */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Categories
                            </label>
                            <div className="flex gap-2 mb-2">
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
                                    onClick={addCategory}
                                    className="btn-secondary"
                                >
                                    Add
                                </button>
                            </div>
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
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Tags
                            </label>
                            <div className="flex gap-2 mb-2">
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
                                    onClick={addTag}
                                    className="btn-secondary"
                                >
                                    Add
                                </button>
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
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating...' : 'Create Opportunity'}
                            </button>
                        </div>
                    </motion.form>
                </div>
            </main>
        </div>
    );
}

export default function AdminPage() {
    return (
        <AuthProvider>
            <AdminContent />
        </AuthProvider>
    );
}

