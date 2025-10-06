'use client';

import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import {
    UserCircleIcon,
    BellIcon,
    ShieldCheckIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

function SettingsContent() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
    const [profileData, setProfileData] = useState({
        displayName: user?.displayName || '',
        email: user?.email || '',
        bio: '',
        website: '',
        location: '',
        photoURL: user?.photoURL || '',
    });
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        deadlineReminders: true,
        newOpportunities: false,
        weeklyDigest: true,
    });
    const [privacySettings, setPrivacySettings] = useState({
        profileVisibility: 'public',
        showEmail: false,
        showBookmarks: false,
    });
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const tabs = [
        { id: 'profile', label: 'Profile', icon: UserCircleIcon },
        { id: 'notifications', label: 'Notifications', icon: BellIcon },
        { id: 'privacy', label: 'Privacy', icon: ShieldCheckIcon },
        { id: 'account', label: 'Account', icon: Cog6ToothIcon },
    ];

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) setActiveTab(tab);
    }, [searchParams]);

    const handleSaveProfile = async () => {
        try {
            // TODO: API call to save profile
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile' });
        }
    };

    const handleSaveNotifications = async () => {
        try {
            // TODO: API call to save notifications
            setMessage({ type: 'success', text: 'Notification settings updated!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update settings' });
        }
    };

    const handleSavePrivacy = async () => {
        try {
            // TODO: API call to save privacy settings
            setMessage({ type: 'success', text: 'Privacy settings updated!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update settings' });
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="pt-32 text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-3xl font-bold mb-4">Settings</h1>
                        <p className="text-neutral-600 mb-6">Please sign in to access your settings</p>
                        <div className="text-4xl mb-4">🔒</div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-24 pb-16 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
                        <p className="text-neutral-600">Manage your account preferences and settings</p>
                    </motion.div>

                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mb-6 p-4 rounded-soft ${message.type === 'success'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                        >
                            {message.text}
                        </motion.div>
                    )}

                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Tabs Sidebar */}
                        <div className="lg:w-64">
                            <div className="card">
                                <nav className="space-y-1">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-soft transition-all ${activeTab === tab.id
                                                        ? 'bg-primary-600 text-white'
                                                        : 'text-foreground hover:bg-neutral-100'
                                                    }`}
                                            >
                                                <Icon className="w-5 h-5" />
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="card"
                            >
                                {activeTab === 'profile' && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold text-foreground">Profile Information</h2>

                                        {/* Profile Picture */}
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Profile Picture
                                            </label>
                                            <div className="flex items-center gap-4">
                                                {user.photoURL ? (
                                                    <Image
                                                        src={user.photoURL}
                                                        alt="Profile"
                                                        width={80}
                                                        height={80}
                                                        className="rounded-full ring-4 ring-primary-300"
                                                    />
                                                ) : (
                                                    <UserCircleIcon className="w-20 h-20 text-neutral-400" />
                                                )}
                                                <div>
                                                    <button className="btn-secondary text-sm">
                                                        Change Photo
                                                    </button>
                                                    <p className="text-xs text-neutral-500 mt-1">JPG, PNG or GIF. Max 2MB</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-2">
                                                    Display Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profileData.displayName}
                                                    onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-soft focus-ring"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-2">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={profileData.email}
                                                    disabled
                                                    className="w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-soft text-neutral-500 cursor-not-allowed"
                                                />
                                                <p className="text-xs text-neutral-500 mt-1">Email cannot be changed</p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Bio
                                            </label>
                                            <textarea
                                                value={profileData.bio}
                                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                                rows={4}
                                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-soft focus-ring"
                                                placeholder="Tell us about yourself..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-2">
                                                    Website
                                                </label>
                                                <input
                                                    type="url"
                                                    value={profileData.website}
                                                    onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-soft focus-ring"
                                                    placeholder="https://example.com"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-2">
                                                    Location
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profileData.location}
                                                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-soft focus-ring"
                                                    placeholder="Jakarta, Indonesia"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-neutral-200">
                                            <button onClick={handleSaveProfile} className="btn-primary">
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'notifications' && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold text-foreground">Notification Preferences</h2>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-soft">
                                                <div>
                                                    <h3 className="font-semibold text-foreground">Email Notifications</h3>
                                                    <p className="text-sm text-neutral-600">Receive email updates about your account</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={notificationSettings.emailNotifications}
                                                        onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-neutral-300 peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-soft">
                                                <div>
                                                    <h3 className="font-semibold text-foreground">Deadline Reminders</h3>
                                                    <p className="text-sm text-neutral-600">Get reminded about upcoming deadlines</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={notificationSettings.deadlineReminders}
                                                        onChange={(e) => setNotificationSettings({ ...notificationSettings, deadlineReminders: e.target.checked })}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-neutral-300 peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-soft">
                                                <div>
                                                    <h3 className="font-semibold text-foreground">New Opportunities</h3>
                                                    <p className="text-sm text-neutral-600">Get notified about new opportunities matching your interests</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={notificationSettings.newOpportunities}
                                                        onChange={(e) => setNotificationSettings({ ...notificationSettings, newOpportunities: e.target.checked })}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-neutral-300 peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-soft">
                                                <div>
                                                    <h3 className="font-semibold text-foreground">Weekly Digest</h3>
                                                    <p className="text-sm text-neutral-600">Receive a weekly summary of opportunities</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={notificationSettings.weeklyDigest}
                                                        onChange={(e) => setNotificationSettings({ ...notificationSettings, weeklyDigest: e.target.checked })}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-neutral-300 peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-neutral-200">
                                            <button onClick={handleSaveNotifications} className="btn-primary">
                                                Save Preferences
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'privacy' && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold text-foreground">Privacy Settings</h2>

                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Profile Visibility
                                            </label>
                                            <select
                                                value={privacySettings.profileVisibility}
                                                onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })}
                                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-soft focus-ring"
                                            >
                                                <option value="public">Public - Anyone can view</option>
                                                <option value="registered">Registered Users Only</option>
                                                <option value="private">Private - Only you</option>
                                            </select>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-soft">
                                                <div>
                                                    <h3 className="font-semibold text-foreground">Show Email on Profile</h3>
                                                    <p className="text-sm text-neutral-600">Allow others to see your email address</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={privacySettings.showEmail}
                                                        onChange={(e) => setPrivacySettings({ ...privacySettings, showEmail: e.target.checked })}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-neutral-300 peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-soft">
                                                <div>
                                                    <h3 className="font-semibold text-foreground">Show Bookmarks</h3>
                                                    <p className="text-sm text-neutral-600">Let others see your bookmarked opportunities</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={privacySettings.showBookmarks}
                                                        onChange={(e) => setPrivacySettings({ ...privacySettings, showBookmarks: e.target.checked })}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-neutral-300 peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-neutral-200">
                                            <button onClick={handleSavePrivacy} className="btn-primary">
                                                Save Settings
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'account' && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold text-foreground">Account Settings</h2>

                                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-soft">
                                            <h3 className="font-semibold text-blue-900 mb-2">Email Verified ✓</h3>
                                            <p className="text-sm text-blue-700">Your email {user.email} is verified and active</p>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-foreground mb-3">Change Password</h3>
                                            <p className="text-sm text-neutral-600 mb-4">Update your password to keep your account secure</p>
                                            <button className="btn-secondary">
                                                Change Password
                                            </button>
                                        </div>

                                        <div className="pt-4 border-t border-neutral-200">
                                            <h3 className="font-semibold text-red-600 mb-3">Danger Zone</h3>
                                            <div className="p-4 bg-red-50 border border-red-200 rounded-soft">
                                                <h4 className="font-semibold text-red-900 mb-2">Delete Account</h4>
                                                <p className="text-sm text-red-700 mb-3">Once you delete your account, there is no going back. Please be certain.</p>
                                                <button className="px-4 py-2 bg-red-600 text-white rounded-soft hover:bg-red-700 transition-colors text-sm font-semibold">
                                                    Delete My Account
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function SettingsPage() {
    return (
        <AuthProvider>
            <SettingsContent />
        </AuthProvider>
    );
}

