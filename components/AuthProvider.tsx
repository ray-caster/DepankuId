'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    signInWithPopup,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    GithubAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { api } from '@/lib/api';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    idToken: string | null;
    signInWithGoogle: () => Promise<void>;
    signInWithGithub: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    signUpWithEmail: (email: string, password: string, name: string) => Promise<{ success: boolean; message: string }>;
    signOut: () => Promise<void>;
    refreshIdToken: () => Promise<string | null>;
    getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    idToken: null,
    signInWithGoogle: async () => { },
    signInWithGithub: async () => { },
    signInWithEmail: async () => ({ success: false, message: '' }),
    signUpWithEmail: async () => ({ success: false, message: '' }),
    signOut: async () => { },
    refreshIdToken: async () => null,
    getIdToken: async () => null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [idToken, setIdToken] = useState<string | null>(null);

    // Helper function to create user profile for social sign-ins
    const createUserProfile = async (user: User) => {
        try {
            const token = await user.getIdToken();
            if (token) {
                // Check if user profile exists
                const profile = await api.getProfile(token);
                if (!profile) {
                    // Create user profile for social sign-in
                    await api.updateProfile({
                        displayName: user.displayName || '',
                        bio: '',
                        website: '',
                        location: '',
                        photoURL: user.photoURL || ''
                    }, token);
                    console.log('User profile created for social sign-in');
                }
            }
        } catch (error) {
            console.error('Error creating user profile:', error);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                const token = await user.getIdToken();
                setIdToken(token);

                // Create profile for social sign-ins if needed
                if (user.providerData.some(provider =>
                    provider.providerId === 'google.com' ||
                    provider.providerId === 'github.com'
                )) {
                    await createUserProfile(user);
                }
            } else {
                setIdToken(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const refreshIdToken = async () => {
        if (user) {
            const token = await user.getIdToken(true);
            setIdToken(token);
            return token;
        }
        return null;
    };

    const getIdToken = async () => {
        if (user) {
            return await user.getIdToken();
        }
        return null;
    };

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error('Error signing in with Google:', error);
            throw error;
        }
    };

    const signInWithGithub = async () => {
        try {
            const provider = new GithubAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error('Error signing in with GitHub:', error);
            throw error;
        }
    };

    const signInWithEmail = async (email: string, password: string) => {
        try {
            // First check if email is verified via backend
            const verificationCheck = await api.signin({ email, password });

            if (!verificationCheck.success) {
                return { success: false, message: verificationCheck.message };
            }

            // If verified, sign in with Firebase
            await firebaseSignInWithEmailAndPassword(auth, email, password);
            return { success: true, message: 'Sign in successful' };
        } catch (error: any) {
            console.error('Error signing in with email:', error);

            // Handle Firebase auth errors
            if (error.code === 'auth/user-not-found') {
                return { success: false, message: 'No account found with this email' };
            } else if (error.code === 'auth/wrong-password') {
                return { success: false, message: 'Incorrect password' };
            } else if (error.code === 'auth/too-many-requests') {
                return { success: false, message: 'Too many failed attempts. Please try again later' };
            }

            return { success: false, message: error.message || 'Sign in failed' };
        }
    };

    const signUpWithEmail = async (email: string, password: string, name: string) => {
        try {
            const response = await api.signup({ email, password, name });
            return response;
        } catch (error: any) {
            console.error('Error signing up with email:', error);
            return { success: false, message: error.message || 'Sign up failed' };
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            setIdToken(null);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, idToken, signInWithGoogle, signInWithGithub, signInWithEmail, signUpWithEmail, signOut, refreshIdToken, getIdToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

