'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Header from '@/components/Header';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: string;
  organization: string;
  deadline?: string;
  category: string[];
  tags: string[];
  location?: string;
  url?: string;
  created_at?: any;
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Check if user is authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Fetch opportunities
  useEffect(() => {
    if (user) {
      fetchOpportunities();
    }
  }, [user]);

  const fetchOpportunities = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/opportunities`);
      const data = await response.json();
      if (data.success) {
        setOpportunities(data.opportunities || []);
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setOpportunities(opportunities.filter(opp => opp.id !== id));
        setShowDeleteConfirm(false);
        setDeleteId(null);
      } else {
        alert('Failed to delete opportunity');
      }
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      alert('Error deleting opportunity');
    }
  };

  const handleEdit = (opportunity: Opportunity) => {
    router.push(`/admin/edit/${opportunity.id}`);
  };

  const handleCreate = () => {
    router.push('/admin/create');
  };

  // Filter opportunities
  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opp.organization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || opp.type === filterType;
    return matchesSearch && matchesType;
  });

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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-foreground-light">Manage opportunities</p>
          </div>

          {/* Controls */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-600" />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600"
              />
            </div>

            {/* Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600"
            >
              <option value="all">All Types</option>
              <option value="research">Research</option>
              <option value="competition">Competition</option>
              <option value="youth-program">Youth Program</option>
              <option value="community">Community</option>
            </select>

            {/* Create Button */}
            <button
              onClick={handleCreate}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-comfort hover:bg-primary-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Create New
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-background-light rounded-gentle p-4 border-2 border-neutral-400">
              <div className="text-2xl font-bold text-foreground">{opportunities.length}</div>
              <div className="text-sm text-foreground-light">Total</div>
            </div>
            <div className="bg-background-light rounded-gentle p-4 border-2 border-neutral-400">
              <div className="text-2xl font-bold text-foreground">
                {opportunities.filter(o => o.type === 'research').length}
              </div>
              <div className="text-sm text-foreground-light">Research</div>
            </div>
            <div className="bg-background-light rounded-gentle p-4 border-2 border-neutral-400">
              <div className="text-2xl font-bold text-foreground">
                {opportunities.filter(o => o.type === 'competition').length}
              </div>
              <div className="text-sm text-foreground-light">Competitions</div>
            </div>
            <div className="bg-background-light rounded-gentle p-4 border-2 border-neutral-400">
              <div className="text-2xl font-bold text-foreground">
                {opportunities.filter(o => o.type === 'youth-program').length}
              </div>
              <div className="text-sm text-foreground-light">Programs</div>
            </div>
          </div>

          {/* Opportunities List */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredOpportunities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-600">No opportunities found</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredOpportunities.map((opportunity, index) => (
                <motion.div
                  key={opportunity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-background-light rounded-gentle p-6 border-2 border-neutral-400 hover:border-primary-400 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-soft font-medium">
                          {opportunity.type}
                        </span>
                        {opportunity.deadline && (
                          <span className="text-sm text-neutral-600">
                            Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{opportunity.title}</h3>
                      <p className="text-foreground-light mb-2 line-clamp-2">{opportunity.description}</p>
                      <div className="flex items-center gap-4 text-sm text-neutral-600">
                        <span>🏢 {opportunity.organization}</span>
                        {opportunity.location && <span>📍 {opportunity.location}</span>}
                      </div>
                      {opportunity.tags && opportunity.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {opportunity.tags.slice(0, 5).map((tag, i) => (
                            <span key={i} className="px-2 py-1 bg-neutral-300 text-neutral-700 text-xs rounded-soft">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(opportunity)}
                        className="p-2 bg-primary-600 text-white rounded-soft hover:bg-primary-700 transition-colors"
                        title="Edit"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(opportunity.id);
                          setShowDeleteConfirm(true);
                        }}
                        className="p-2 bg-red-600 text-white rounded-soft hover:bg-red-700 transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-comfort p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-foreground mb-4">Confirm Delete</h3>
            <p className="text-foreground-light mb-6">
              Are you sure you want to delete this opportunity? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteId(null);
                }}
                className="flex-1 px-4 py-2 border-2 border-neutral-400 rounded-comfort hover:bg-neutral-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteId && handleDelete(deleteId)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-comfort hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}