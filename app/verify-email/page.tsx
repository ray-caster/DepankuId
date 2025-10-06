'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { api } from '@/lib/api';
import Link from 'next/link';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get('token');
            const uid = searchParams.get('uid');

            if (!token || !uid) {
                setStatus('error');
                setMessage('Invalid verification link');
                return;
            }

            try {
                const response = await api.verifyEmail({ token, uid });

                if (response.success) {
                    setStatus('success');
                    setMessage('Your email has been verified successfully!');

                    // Redirect to home page after 3 seconds
                    setTimeout(() => {
                        router.push('/');
                    }, 3000);
                } else {
                    setStatus('error');
                    setMessage(response.message || 'Verification failed');
                }
            } catch (error) {
                setStatus('error');
                setMessage('Something went wrong. Please try again.');
            }
        };

        verifyEmail();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                <div className="card text-center">
                    {status === 'loading' && (
                        <>
                            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                            <h1 className="text-2xl font-bold text-foreground mb-3">Verifying Your Email</h1>
                            <p className="text-foreground-light">Please wait while we verify your email address...</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircleIcon className="w-12 h-12 text-green-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-foreground mb-3">Email Verified!</h1>
                            <p className="text-foreground-light mb-6">{message}</p>
                            <p className="text-sm text-foreground-lighter">Redirecting you to the homepage...</p>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <XCircleIcon className="w-12 h-12 text-red-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-foreground mb-3">Verification Failed</h1>
                            <p className="text-foreground-light mb-8">{message}</p>
                            <Link
                                href="/"
                                className="inline-block px-6 py-3 bg-primary-600 text-white font-bold rounded-soft border-2 border-neutral-500 hover:bg-primary-700 transition-all"
                                style={{
                                    boxShadow: '0 4px 8px -2px oklch(0% 0 0 / 0.15), inset 0 1px 0 0 oklch(100% 0 0 / 0.1)'
                                }}
                            >
                                Go to Homepage
                            </Link>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}

