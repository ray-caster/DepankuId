'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function CreateOpportunityPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'research',
    organization: '',
    location: '',
    deadline: '',
    url: '',
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

  // Check if user is admin
  useEffect(() => {
    const checkAdminSession = () => {
      const adminSession = localStorage.getItem('admin_session');
      const adminEmail = localStorage.getItem('admin_email');

      if (adminSession === 'true' && adminEmail === 'admin@depanku.id') {
        setIsAdmin(true);
      } else {
        router.push('/admin/login');
      }
      setCheckingAuth(false);
    };

    checkAdminSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      console.log('Submitting opportunity data:', formData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/opportunities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok && data.success) {
        alert('Opportunity created successfully!');
        router.push('/admin');
      } else {
        // Handle moderation errors with detailed feedback
        if (data.issues && Array.isArray(data.issues)) {
          const issuesList = data.issues.map((issue: string, index: number) => `${index + 1}. ${issue}`).join('\n');
          setError(`Opportunity rejected by moderation:\n\n${issuesList}\n\nPlease address these issues and try again.`);
        } else {
          setError(data.message || data.error || 'Failed to create opportunity');
        }
      }
    } catch (error: any) {
      console.error('Error creating opportunity:', error);
      setError(error.message || 'An error occurred while creating the opportunity');
    } finally {
      setIsSubmitting(false);
    }
  };

  const normalizeUrl = (url: string) => {
    if (!url) return url;
    url = url.trim();
    if (url && !url.match(/^https?:\/\//i)) {
      return 'https://' + url;
    }
    return url;
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
        processedValue = normalizeUrl(value);
      }
      setFormData(prev => ({
        ...prev,
        [name]: processedValue,
      }));
    }
  };

  const handleArrayChange = (field: 'tags', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: items,
    }));
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-neutral-600">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect to admin/login
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4 text-sm sm:text-base"
            >
              <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              Back to Admin
            </button>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">Create Opportunity</h1>
            <p className="text-sm sm:text-base text-foreground-light">Add a new opportunity to the platform</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border-2 border-red-400 rounded-comfort text-red-700">
              <pre className="whitespace-pre-wrap font-sans">{error}</pre>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Basic Info */}
            <div className="bg-background-light rounded-gentle p-4 sm:p-6 border-2 border-neutral-400">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Basic Information</h2>

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
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600 text-sm sm:text-base"
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
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600 text-sm sm:text-base resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600 text-sm sm:text-base"
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
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600 text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600 text-sm sm:text-base"
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
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600 disabled:bg-neutral-200 text-sm sm:text-base"
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
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600 text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-background-light rounded-gentle p-4 sm:p-6 border-2 border-neutral-400">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Tags</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tags (comma-separated, will be prefixed with #)
                  </label>
                  <input
                    type="text"
                    value={formData.tags.join(', ')}
                    onChange={(e) => handleArrayChange('tags', e.target.value)}
                    placeholder="e.g. stem, research, undergraduate, funded, international"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600 text-sm sm:text-base"
                  />
                  <p className="mt-2 text-xs sm:text-sm text-neutral-600">
                    Suggested: stem, research, science, technology, engineering, coding, leadership, competition, online, free, scholarship
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-background-light rounded-gentle p-4 sm:p-6 border-2 border-neutral-400">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Additional Details</h2>

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
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600 text-sm sm:text-base resize-none"
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
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600 text-sm sm:text-base resize-none"
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
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600 text-sm sm:text-base resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600 text-sm sm:text-base"
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
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600 text-sm sm:text-base"
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
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600 text-sm sm:text-base resize-none"
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
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600 text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-neutral-400 rounded-comfort hover:bg-neutral-200 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-primary-600 text-white rounded-comfort hover:bg-primary-700 transition-colors disabled:opacity-50 text-sm sm:text-base"
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
