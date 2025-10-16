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
        const response = await fetch(`${this.baseURL}/api/opportunities/${id}`);

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
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
                    const error = ErrorManager.createError(ERROR_CODES.VAL_001, 'Opportunity Publishing');
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
}

export const api = new API();

