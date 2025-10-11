'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simple admin authentication
    if (credentials.email === 'admin@depanku.id' && credentials.password === 'admin') {
      // Store admin session in localStorage
      localStorage.setItem('admin_session', 'true');
      localStorage.setItem('admin_email', 'admin@depanku.id');
      
      // Redirect to admin panel
      router.push('/admin');
    } else {
      setError('Invalid admin credentials');
    }
    
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background-light rounded-gentle p-8 border-2 border-neutral-400"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Admin Login</h1>
              <p className="text-foreground-light">Enter admin credentials to access the panel</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 border-2 border-red-400 rounded-comfort text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Admin Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600"
                  placeholder="admin@depanku.id"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-neutral-400 rounded-comfort focus:outline-none focus:border-primary-600"
                  placeholder="admin"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-primary-600 text-white rounded-comfort hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-foreground-light">
                Default credentials: admin@depanku.id / admin
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
