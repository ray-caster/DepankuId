import { ErrorManager, AppError, ERROR_CODES } from './errors';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.depanku.id';

export interface AIMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface AIChatRequest {
    message: string;
    history: AIMessage[];
    conversation_id?: string;
}

export interface AIChatResponse {
    success: boolean;
    message?: string;
    conversation_id?: string;
    error?: string;
    user_profile?: UserPreferences;
    should_show_opportunities?: boolean;
    opportunities?: Opportunity[];
}

export interface SocialMediaLinks {
    website?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    discord?: string;
    telegram?: string;
}

export interface Opportunity {
    id?: string;
    objectID?: string;
    title: string;
    description: string;
    type: 'research' | 'youth-program' | 'community' | 'competition';
    deadline?: string;
    location?: string;
    organization: string;
    url?: string;
    tags: string[];
    createdAt?: any;
    social_media?: SocialMediaLinks;
    benefits?: string;
    eligibility?: string;
    cost?: string;
    duration?: string;
    application_process?: string;
    contact_email?: string;
    has_indefinite_deadline?: boolean;
    created_by_uid?: string;
    created_by_email?: string;
    status?: 'published' | 'draft' | 'rejected';
    moderation_notes?: string;
    application_form?: ApplicationForm;
    applications?: ApplicationSubmission[];
}

export interface ApplicationForm {
    id: string;
    title: string;
    description?: string;
    pages: FormPage[];
    settings: {
        allowMultipleSubmissions: boolean;
        collectEmail: boolean;
        showProgressBar: boolean;
    };
}

export interface FormPage {
    id: string;
    title: string;
    description?: string;
    questions: FormQuestion[];
}

export interface FormQuestion {
    id: string;
    type: 'text' | 'textarea' | 'multiple_choice' | 'checkbox' | 'dropdown' | 'file' | 'video' | 'image';
    title: string;
    description?: string;
    required: boolean;
    options?: string[];
    placeholder?: string;
    maxLength?: number;
    fileTypes?: string[];
    maxFileSize?: number;
}

export interface ApplicationSubmission {
    id: string;
    opportunityId: string;
    applicantId: string;
    applicantEmail: string;
    applicantName: string;
    responses: ApplicationResponse[];
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
    submittedAt: string;
    reviewedAt?: string;
    notes?: string;
}

export interface ApplicationResponse {
    questionId: string;
    questionTitle: string;
    questionType: string;
    answer: string | string[] | File[];
    required: boolean;
}

export interface OpportunityTemplate {
    type: string;
    tags: string[];
    description: string;
    requirements?: string;
    benefits?: string;
}

export interface UserPreferences {
    interests?: string[];
    skills?: string[];
    goals?: string[];
    preferredTypes?: string[];
    conversationSummary?: string;
}

class API {
    private baseURL: string;

    constructor() {
        this.baseURL = API_URL;
    }

    async aiChat(data: AIChatRequest): Promise<AIChatResponse> {
        try {
            const response = await fetch(`${this.baseURL}/api/ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const appError = ErrorManager.getErrorFromResponse({ ...response, ...errorData }, 'AI Chat');
                throw ErrorManager.createError(appError.code, 'AI Chat');
            }

            return response.json();
        } catch (error) {
            if (error instanceof Error && (error as any).appError) {
                throw error;
            }
            const appError = ErrorManager.getErrorFromException(error, 'AI Chat');
            throw ErrorManager.createError(appError.code, 'AI Chat');
        }
    }

    async startDiscovery(userProfile?: UserPreferences): Promise<AIChatResponse> {
        const response = await fetch(`${this.baseURL}/api/ai/discovery/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_profile: userProfile }),
        });

        if (!response.ok) {
            throw new Error('Failed to start discovery');
        }

        return response.json();
    }

    async continueDiscovery(data: {
        message: string;
        history: AIMessage[];
        user_profile: UserPreferences;
        user_answers: Record<string, any>;
    }): Promise<AIChatResponse & {
        user_profile: UserPreferences;
        should_show_opportunities: boolean;
        opportunities?: Opportunity[];
    }> {
        const response = await fetch(`${this.baseURL}/api/ai/discovery/continue`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to continue discovery');
        }

        return response.json();
    }

    async getDiscoveryOpportunities(userProfile: UserPreferences, limit: number = 5): Promise<{
        success: boolean;
        opportunities: Opportunity[];
        count: number;
    }> {
        const response = await fetch(`${this.baseURL}/api/ai/discovery/opportunities`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_profile: userProfile, limit }),
        });

        if (!response.ok) {
            throw new Error('Failed to get discovery opportunities');
        }

        return response.json();
    }

    async analyzeProfile(data: {
        history: AIMessage[];
        user_answers: Record<string, any>;
    }): Promise<{
        success: boolean;
        user_profile: UserPreferences;
    }> {
        const response = await fetch(`${this.baseURL}/api/ai/discovery/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to analyze profile');
        }

        return response.json();
    }

    async getOpportunities(): Promise<Opportunity[]> {
        const response = await fetch(`${this.baseURL}/api/opportunities`);

        if (!response.ok) {
            throw new Error('Failed to fetch opportunities');
        }

        const data = await response.json();
        return data.data || [];
    }

    async getOpportunity(id: string): Promise<Opportunity | null> {
        console.log('API: Getting opportunity with ID:', id);
        const response = await fetch(`${this.baseURL}/api/opportunities/${id}`);

        console.log('API: Response status:', response.status);
        console.log('API: Response URL:', response.url);

        if (!response.ok) {
            console.error('API: Failed to get opportunity:', response.status, response.statusText);
            return null;
        }

        const data = await response.json();
        console.log('API: Response data:', data);
        return data.data || null;
    }

    async createOpportunity(opportunity: Opportunity, idToken: string): Promise<{ success: boolean; status?: string; id?: string; data?: any; message?: string; issues?: string[]; moderation_notes?: string }> {
        const response = await fetch(`${this.baseURL}/api/opportunities`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify(opportunity),
        });

        const data = await response.json();

        if (!response.ok && data.status === 'rejected') {
            // Return the rejection data
            return data;
        }

        if (!response.ok) {
            throw new Error(data.error || 'Failed to create opportunity');
        }

        return data;
    }

    async updateOpportunity(opportunityId: string, opportunity: Opportunity, idToken: string): Promise<{ success: boolean; status?: string; id?: string; data?: any; message?: string; issues?: string[]; moderation_notes?: string }> {
        const response = await fetch(`${this.baseURL}/api/opportunities/${opportunityId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify(opportunity),
        });

        const data = await response.json();

        if (!response.ok && data.status === 'rejected') {
            // Return the rejection data
            return data;
        }

        if (!response.ok) {
            throw new Error(data.error || 'Failed to update opportunity');
        }

        return data;
    }

    async getMyOpportunities(idToken: string): Promise<Opportunity[]> {
        const response = await fetch(`${this.baseURL}/api/opportunities/my-opportunities`, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch your opportunities');
        }

        const data = await response.json();
        return data.data || [];
    }


    async deleteOpportunity(opportunityId: string, idToken: string): Promise<void> {
        const response = await fetch(`${this.baseURL}/api/opportunities/${opportunityId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${idToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete opportunity');
        }
    }

    async publishOpportunity(opportunityId: string, idToken: string): Promise<{ success: boolean; message: string; issues?: string[]; moderation_notes?: string; status?: string }> {
        try {
            const response = await fetch(`${this.baseURL}/api/opportunities/${opportunityId}/publish`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}), // Send empty JSON object instead of no body
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle moderation rejection with detailed feedback
                if (data.issues && data.status === 'rejected') {
                    const error = ErrorManager.createError(ERROR_CODES.REQUIRED_FIELD, 'Opportunity Publishing');
                    (error as any).moderationData = {
                        issues: data.issues,
                        moderation_notes: data.moderation_notes,
                        status: data.status
                    };
                    throw error;
                }

                const appError = ErrorManager.getErrorFromResponse({ ...response, ...data }, 'Opportunity Publishing');
                throw ErrorManager.createError(appError.code, 'Opportunity Publishing');
            }

            return data;
        } catch (error) {
            if (error instanceof Error && (error as any).appError) {
                throw error;
            }
            const appError = ErrorManager.getErrorFromException(error, 'Opportunity Publishing');
            throw ErrorManager.createError(appError.code, 'Opportunity Publishing');
        }
    }

    async unpublishOpportunity(opportunityId: string, idToken: string): Promise<{ success: boolean; message: string }> {
        const response = await fetch(`${this.baseURL}/api/opportunities/${opportunityId}/unpublish`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}), // Send empty JSON object instead of no body
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to unpublish opportunity');
        }

        return data;
    }

    async saveUserPreferences(userId: string, preferences: UserPreferences): Promise<void> {
        const response = await fetch(`${this.baseURL}/api/user/preferences`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                preferences,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to save preferences');
        }
    }

    async getUserPreferences(userId: string): Promise<UserPreferences> {
        const response = await fetch(`${this.baseURL}/api/user/preferences/${userId}`);

        if (!response.ok) {
            throw new Error('Failed to fetch preferences');
        }

        const data = await response.json();
        return data.data?.preferences || {};
    }

    async syncAlgolia(): Promise<void> {
        const response = await fetch(`${this.baseURL}/api/sync/algolia`, {
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error('Failed to sync Algolia');
        }
    }


    async getOpportunityTemplates(): Promise<Record<string, OpportunityTemplate>> {
        const response = await fetch(`${this.baseURL}/api/opportunities/templates`);

        if (!response.ok) {
            throw new Error('Failed to fetch templates');
        }

        const data = await response.json();
        return data.data || {};
    }

    async getTagPresets(): Promise<string[]> {
        const response = await fetch(`${this.baseURL}/api/opportunities/presets/tags`);

        if (!response.ok) {
            throw new Error('Failed to fetch tag presets');
        }

        const data = await response.json();
        return data.data || [];
    }

    async signup(data: { email: string; password: string; name: string }): Promise<{ success: boolean; message: string }> {
        const response = await fetch(`${this.baseURL}/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        return response.json();
    }

    async signin(data: { email: string; password: string }): Promise<{ success: boolean; message: string; idToken?: string; refreshToken?: string; user?: any }> {
        const response = await fetch(`${this.baseURL}/api/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        return response.json();
    }

    async verifyEmail(data: { token: string; uid: string }): Promise<{ success: boolean; message: string; customToken?: string; user?: any }> {
        const response = await fetch(`${this.baseURL}/api/auth/verify-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        return response.json();
    }

    async getBookmarks(idToken: string): Promise<Opportunity[]> {
        const response = await fetch(`${this.baseURL}/api/bookmarks`, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch bookmarks');
        }

        const data = await response.json();
        return data.data || [];
    }

    async addBookmark(opportunityId: string, idToken: string): Promise<void> {
        const response = await fetch(`${this.baseURL}/api/bookmarks/${opportunityId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${idToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to add bookmark');
        }
    }

    async removeBookmark(opportunityId: string, idToken: string): Promise<void> {
        const response = await fetch(`${this.baseURL}/api/bookmarks/${opportunityId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${idToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to remove bookmark');
        }
    }


    // Profile API methods
    async getProfile(idToken: string): Promise<any> {
        const response = await fetch(`${this.baseURL}/api/profile`, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        return data.data || {};
    }

    async updateProfile(profileData: any, idToken: string): Promise<void> {
        const response = await fetch(`${this.baseURL}/api/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({ profile: profileData }),
        });

        if (!response.ok) {
            throw new Error('Failed to update profile');
        }
    }

    async getNotificationSettings(idToken: string): Promise<any> {
        const response = await fetch(`${this.baseURL}/api/profile/settings/notifications`, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch notification settings');
        }

        const data = await response.json();
        return data.data || {};
    }

    async updateNotificationSettings(settings: any, idToken: string): Promise<void> {
        const response = await fetch(`${this.baseURL}/api/profile/settings/notifications`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({ settings }),
        });

        if (!response.ok) {
            throw new Error('Failed to update notification settings');
        }
    }

    async getPrivacySettings(idToken: string): Promise<any> {
        const response = await fetch(`${this.baseURL}/api/profile/settings/privacy`, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch privacy settings');
        }

        const data = await response.json();
        return data.data || {};
    }

    async updatePrivacySettings(settings: any, idToken: string): Promise<void> {
        const response = await fetch(`${this.baseURL}/api/profile/settings/privacy`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({ settings }),
        });

        if (!response.ok) {
            throw new Error('Failed to update privacy settings');
        }
    }

    // Activity tracking methods
    async getActivity(idToken: string): Promise<any[]> {
        const response = await fetch(`${this.baseURL}/api/profile/activity`, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch activity');
        }

        const data = await response.json();
        return data.data || [];
    }

    async trackApplication(opportunityId: string, idToken: string): Promise<void> {
        const response = await fetch(`${this.baseURL}/api/profile/activity/application`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({ opportunityId }),
        });

        if (!response.ok) {
            throw new Error('Failed to track application');
        }
    }

    async getApplications(idToken: string): Promise<any[]> {
        const response = await fetch(`${this.baseURL}/api/profile/applications`, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch applications');
        }

        const data = await response.json();
        return data.data || [];
    }

    // Application Management Methods
    async getApplicationStatus(opportunityId: string, idToken: string): Promise<{
        has_applied: boolean;
        application?: ApplicationSubmission;
    }> {
        const response = await fetch(`${this.baseURL}/api/opportunities/${opportunityId}/application-status`, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to check application status');
        }

        const data = await response.json();
        return {
            has_applied: data.has_applied,
            application: data.application
        };
    }

    async getOpportunityApplications(opportunityId: string, idToken: string): Promise<ApplicationSubmission[]> {
        const response = await fetch(`${this.baseURL}/api/opportunities/${opportunityId}/applications`, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication failed. Please sign in again.');
            } else if (response.status === 403) {
                throw new Error('You do not have permission to view applications for this opportunity.');
            } else if (response.status === 404) {
                throw new Error('Opportunity not found.');
            } else {
                throw new Error(`Failed to fetch applications: ${response.status} ${response.statusText}`);
            }
        }

        const data = await response.json();
        return data.data || [];
    }

    async updateApplicationStatus(applicationId: string, status: 'pending' | 'reviewed' | 'accepted' | 'rejected', notes?: string, idToken?: string): Promise<void> {
        if (!idToken) return;

        const response = await fetch(`${this.baseURL}/api/applications/${applicationId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({ status, notes }),
        });

        if (!response.ok) {
            throw new Error('Failed to update application status');
        }
    }

    async submitApplication(opportunityId: string, responses: ApplicationResponse[], idToken: string): Promise<void> {
        const response = await fetch(`${this.baseURL}/api/opportunities/${opportunityId}/apply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({ responses }),
        });

        if (!response.ok) {
            throw new Error('Failed to submit application');
        }
    }

    // Upload Methods
    async uploadProfilePicture(file: File, idToken: string): Promise<{ url: string }> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${this.baseURL}/api/upload/profile-picture`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${idToken}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to upload profile picture');
        }

        const data = await response.json();
        return { url: data.url };
    }

    async deleteProfilePicture(idToken: string): Promise<void> {
        const response = await fetch(`${this.baseURL}/api/upload/profile-picture`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${idToken}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete profile picture');
        }
    }

    // Authentication Methods
    async changePassword(currentPassword: string, newPassword: string, idToken: string): Promise<void> {
        const response = await fetch(`${this.baseURL}/api/auth/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                currentPassword,
                newPassword,
                idToken
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to change password');
        }
    }

    // User Applications
    async getMyApplications(idToken: string): Promise<ApplicationSubmission[]> {
        const response = await fetch(`${this.baseURL}/api/profile/applications`, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch applications');
        }

        const data = await response.json();
        return data.data || [];
    }
}

export const api = new API();

