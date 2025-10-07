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
    category: string[];
    deadline?: string;
    location?: string;
    organization: string;
    url?: string;
    tags: string[];
    createdAt?: any;
    social_media?: SocialMediaLinks;
    requirements?: string;
    benefits?: string;
    eligibility?: string;
    cost?: string;
    duration?: string;
    application_process?: string;
    contact_email?: string;
    has_indefinite_deadline?: boolean;
}

export interface OpportunityTemplate {
    type: string;
    category: string[];
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
        const response = await fetch(`${this.baseURL}/api/ai/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to get AI response');
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

    async createOpportunity(opportunity: Opportunity): Promise<Opportunity> {
        const response = await fetch(`${this.baseURL}/api/opportunities`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(opportunity),
        });

        if (!response.ok) {
            throw new Error('Failed to create opportunity');
        }

        const data = await response.json();
        return data.data;
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

    async getCategoryPresets(): Promise<Record<string, string[]>> {
        const response = await fetch(`${this.baseURL}/api/opportunities/presets/categories`);

        if (!response.ok) {
            throw new Error('Failed to fetch category presets');
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

    async verifyEmail(data: { token: string; uid: string }): Promise<{ success: boolean; message: string }> {
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

