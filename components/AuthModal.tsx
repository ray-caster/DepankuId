'use client';

import { useState, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { XMarkIcon, EnvelopeIcon, LockClosedIcon, UserIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useAuth } from './AuthProvider';
import SocialSignIn from './SocialSignIn';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
    const router = useRouter();
    const { signUpWithEmail, signInWithEmail } = useAuth();
    const [isSignUp, setIsSignUp] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [verificationSent, setVerificationSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isSignUp) {
                console.log('Attempting signup...', { email, name });
                const response = await signUpWithEmail(email, password, name);
                console.log('Signup response:', response);

                if (response.success) {
                    setVerificationSent(true);
                } else {
                    setError(response.message || 'Signup failed');
                    console.error('Signup failed:', response.message);
                }
            } else {
                console.log('Attempting signin...', { email });
                const response = await signInWithEmail(email, password);
                console.log('Signin response:', response);

                if (response.success) {
                    onSuccess();
                    onClose();
                } else {
                    setError(response.message || 'Invalid credentials');
                    console.error('Signin failed:', response.message);
                }
            }
        } catch (err: any) {
            console.error('Auth error:', err);
            setError(err?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const benefits = [
        '🔖 Bookmark your favorite opportunities',
        '🎯 Get personalized recommendations',
        '📧 Receive deadline reminders',
        '✨ Share opportunities with others',
        '📊 Track your application progress'
    ];

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div
                        className="fixed inset-0 bg-black/30"
                        style={{
                            backdropFilter: 'blur(12px) saturate(150%)',
                            WebkitBackdropFilter: 'blur(12px) saturate(150%)',
                        }}
                    />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel
                                className="w-full max-w-4xl transform overflow-hidden rounded-comfort bg-white/60 backdrop-blur-xl border-2 border-neutral-400/60 shadow-2xl transition-all"
                                style={{
                                    backdropFilter: 'blur(16px) saturate(180%)',
                                    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                                }}
                            >
                                <div className="grid md:grid-cols-2">
                                    {/* Left Side - Benefits */}
                                    <div className="hidden md:block bg-gradient-to-br from-primary-600 to-accent-600 p-12 text-white">
                                        <div className="flex items-center gap-3 mb-8">
                                            <SparklesIcon className="w-10 h-10" />
                                            <h2 className="text-3xl font-bold">Join Depanku.id</h2>
                                        </div>

                                        <p className="text-lg mb-8 text-white/90">
                                            Unlock your full potential with exclusive features designed to help you succeed
                                        </p>

                                        <div className="space-y-4">
                                            {benefits.map((benefit, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="flex items-center gap-3 bg-white/10 rounded-soft p-3"
                                                >
                                                    <span className="text-lg">{benefit}</span>
                                                </motion.div>
                                            ))}
                                        </div>

                                        <div className="mt-8 p-4 bg-white/10 rounded-soft">
                                            <p className="text-sm text-white/80">
                                                💯 <strong>100% Free Forever</strong> - No credit card required
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right Side - Form */}
                                    <div className="p-8 sm:p-12 relative">
                                        <button
                                            onClick={onClose}
                                            className="absolute top-4 right-4 p-2 rounded-soft hover:bg-neutral-100 transition-colors border-2 border-transparent hover:border-neutral-300"
                                        >
                                            <XMarkIcon className="w-6 h-6 text-neutral-600" />
                                        </button>

                                        {verificationSent ? (
                                            <div className="text-center py-8">
                                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <EnvelopeIcon className="w-8 h-8 text-green-600" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-foreground mb-3">Check Your Email</h3>
                                                <p className="text-foreground-light mb-6">
                                                    We&apos;ve sent a verification link to <strong>{email}</strong>
                                                </p>
                                                <p className="text-sm text-foreground-lighter">
                                                    Please verify your email to complete your registration
                                                </p>
                                            </div>
                                        ) : (
                                            <>
                                                <h3 className="text-3xl font-bold text-foreground mb-2">
                                                    {isSignUp ? 'Create Account' : 'Welcome Back'}
                                                </h3>
                                                <p className="text-foreground-light mb-8">
                                                    {isSignUp
                                                        ? 'Start discovering opportunities tailored just for you'
                                                        : 'Continue your journey to success'
                                                    }
                                                </p>

                                                {error && (
                                                    <div className="mb-6 p-4 bg-red-50 border-2 border-red-400 rounded-soft">
                                                        <p className="text-red-700 text-sm">{error}</p>
                                                    </div>
                                                )}

                                                {/* Social Sign In */}
                                                <div className="mb-6">
                                                    <SocialSignIn
                                                        onSuccess={onSuccess}
                                                        onError={setError}
                                                        disabled={loading}
                                                    />

                                                    <div className="relative my-6">
                                                        <div className="absolute inset-0 flex items-center">
                                                            <div className="w-full border-t border-neutral-300" />
                                                        </div>
                                                        <div className="relative flex justify-center text-sm">
                                                            <span className="px-2 bg-white text-neutral-500">Or continue with email</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <form onSubmit={handleSubmit} className="space-y-6">
                                                    {isSignUp && (
                                                        <div>
                                                            <label className="block text-sm font-semibold text-foreground mb-2">
                                                                Full Name
                                                            </label>
                                                            <div className="relative">
                                                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                                                <input
                                                                    type="text"
                                                                    value={name}
                                                                    onChange={(e) => setName(e.target.value)}
                                                                    placeholder="Enter your full name"
                                                                    required
                                                                    className="w-full pl-12 pr-4 py-3 border-2 border-neutral-400 rounded-soft focus:border-primary-500 focus:outline-none transition-colors"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div>
                                                        <label className="block text-sm font-semibold text-foreground mb-2">
                                                            Email Address
                                                        </label>
                                                        <div className="relative">
                                                            <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                                            <input
                                                                type="email"
                                                                value={email}
                                                                onChange={(e) => setEmail(e.target.value)}
                                                                placeholder="Enter your email"
                                                                required
                                                                className="w-full pl-12 pr-4 py-3 border-2 border-neutral-400 rounded-soft focus:border-primary-500 focus:outline-none transition-colors"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-semibold text-foreground mb-2">
                                                            Password
                                                        </label>
                                                        <div className="relative">
                                                            <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                                            <input
                                                                type="password"
                                                                value={password}
                                                                onChange={(e) => setPassword(e.target.value)}
                                                                placeholder="Enter your password"
                                                                required
                                                                minLength={8}
                                                                className="w-full pl-12 pr-4 py-3 border-2 border-neutral-400 rounded-soft focus:border-primary-500 focus:outline-none transition-colors"
                                                            />
                                                        </div>
                                                        {isSignUp && (
                                                            <p className="text-xs text-foreground-lighter mt-2">
                                                                Minimum 8 characters with uppercase, lowercase, and number
                                                            </p>
                                                        )}
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        disabled={loading}
                                                        className="w-full py-4 bg-primary-600 text-white font-bold rounded-soft border-2 border-neutral-400 hover:bg-primary-700 hover:border-neutral-500 disabled:opacity-50 transition-all"
                                                        style={{
                                                            boxShadow: '0 8px 16px -4px oklch(0% 0 0 / 0.2), 0 4px 8px -2px oklch(0% 0 0 / 0.1)'
                                                        }}
                                                    >
                                                        {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
                                                    </button>
                                                </form>

                                                <div className="mt-6 text-center">
                                                    <button
                                                        onClick={() => {
                                                            setIsSignUp(!isSignUp);
                                                            setError('');
                                                        }}
                                                        className="text-primary-600 hover:text-primary-700 font-semibold"
                                                    >
                                                        {isSignUp
                                                            ? 'Already have an account? Sign In'
                                                            : "Don't have an account? Sign Up"
                                                        }
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

