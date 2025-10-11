'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Header from '@/components/Header';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function CreateOpportunityPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'research',
    organization: '',
    location: '',
    deadline: '',
    url: '',
    category: [] as string[],
    tags: [] as string[],
    requirements: '',
    benefits: '',
    eligibility: '',
    cost: '',
    duration: '',
    application_process: '',
    contact_email: '',
    has_indefinite_deadline: false,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const token = await user?.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/opportunities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin');
      } else {
        setError(data.message || 'Failed to create opportunity');
      }
    } catch (error) {
      console.error('Error creating opportunity:', error);
      setError('An error occurred while creating the opportunity');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleArrayChange = (field: 'category' | 'tags', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: items,
    }));
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Admin
            </button>
            <h1 className="text-4xl font-bold text-foreground mb-2">Create Opportunity</h1>
            <p className="text-foreground-light">Add a new opportunity to the platform</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border-2 border-red-400 rounded-comfort text-red-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="bg-background-light rounded-gentle p-6 border-2 border-neutral-400">
              <h2 className="text-2xl font-bold text-foreground mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600"
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
                      value={formData.organization}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Deadline
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      disabled={formData.has_indefinite_deadline}
                      className="w-full px-4 py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600 disabled:bg-neutral-200"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="has_indefinite_deadline"
                    checked={formData.has_indefinite_deadline}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <label className="text-sm text-foreground">
                    This opportunity has no specific deadline
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    URL
                  </label>
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600"
                  />
                </div>
              </div>
            </div>

            {/* Categories & Tags */}
            <div className="bg-background-light rounded-gentle p-6 border-2 border-neutral-400">
              <h2 className="text-2xl font-bold text-foreground mb-4">Categories & Tags</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Categories (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.category.join(', ')}
                    onChange={(e) => handleArrayChange('category', e.target.value)}
                    placeholder="e.g. Science, Technology, Engineering"
                    className="w-full px-4 py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags.join(', ')}
                    onChange={(e) => handleArrayChange('tags', e.target.value)}
                    placeholder="e.g. undergraduate, funded, international"
                    className="w-full px-4 py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600"
                  />
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-background-light rounded-gentle p-6 border-2 border-neutral-400">
              <h2 className="text-2xl font-bold text-foreground mb-4">Additional Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Requirements
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Benefits
                  </label>
                  <textarea
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Eligibility
                  </label>
                  <textarea
                    name="eligibility"
                    value={formData.eligibility}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Cost
                    </label>
                    <input
                      type="text"
                      name="cost"
                      value={formData.cost}
                      onChange={handleChange}
                      placeholder="e.g. Free, $50, Varies"
                      className="w-full px-4 py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="e.g. 6 months, Summer 2024"
                      className="w-full px-4 py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Application Process
                  </label>
                  <textarea
                    name="application_process"
                    value={formData.application_process}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border-2 border-neutral-400 rounded-comfort hover:bg-neutral-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-comfort hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Opportunity'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
