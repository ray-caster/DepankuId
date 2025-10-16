/**
 * Centralized Error Handling System
 * Provides consistent error codes, user-friendly messages, and developer context
 */

export interface AppError {
    code: string;
    message: string;
    userMessage: string;
    statusCode: number;
    category: 'auth' | 'validation' | 'network' | 'server' | 'permission' | 'not_found' | 'rate_limit';
    context?: string;
}

export class ErrorManager {
    private static errors: Record<string, AppError> = {
        // Authentication Errors (AUTH_*)
        'AUTH_001': {
            code: 'AUTH_001',
            message: 'Invalid authentication token',
            userMessage: 'Your session has expired. Please sign in again.',
            statusCode: 401,
            category: 'auth'
        },
        'AUTH_002': {
            code: 'AUTH_002',
            message: 'User not authenticated',
            userMessage: 'Please sign in to continue.',
            statusCode: 401,
            category: 'auth'
        },
        'AUTH_003': {
            code: 'AUTH_003',
            message: 'Invalid email or password',
            userMessage: 'Incorrect email or password. Please try again.',
            statusCode: 401,
            category: 'auth'
        },
        'AUTH_004': {
            code: 'AUTH_004',
            message: 'Email not verified',
            userMessage: 'Please verify your email address before continuing.',
            statusCode: 403,
            category: 'auth'
        },
        'AUTH_005': {
            code: 'AUTH_005',
            message: 'Admin access required',
            userMessage: 'You need admin privileges to access this feature.',
            statusCode: 403,
            category: 'permission'
        },

        // Validation Errors (VAL_*)
        'VAL_001': {
            code: 'VAL_001',
            message: 'Required field missing',
            userMessage: 'Please fill in all required fields.',
            statusCode: 400,
            category: 'validation'
        },
        'VAL_002': {
            code: 'VAL_002',
            message: 'Invalid email format',
            userMessage: 'Please enter a valid email address.',
            statusCode: 400,
            category: 'validation'
        },
        'VAL_003': {
            code: 'VAL_003',
            message: 'Invalid URL format',
            userMessage: 'Please enter a valid URL (e.g., https://example.com).',
            statusCode: 400,
            category: 'validation'
        },
        'VAL_004': {
            code: 'VAL_004',
            message: 'Invalid date format',
            userMessage: 'Please enter a valid date.',
            statusCode: 400,
            category: 'validation'
        },
        'VAL_005': {
            code: 'VAL_005',
            message: 'Text too long',
            userMessage: 'The text is too long. Please shorten it.',
            statusCode: 400,
            category: 'validation'
        },
        'VAL_006': {
            code: 'VAL_006',
            message: 'Invalid opportunity type',
            userMessage: 'Please select a valid opportunity type.',
            statusCode: 400,
            category: 'validation'
        },

        // Network Errors (NET_*)
        'NET_001': {
            code: 'NET_001',
            message: 'Network connection failed',
            userMessage: 'Unable to connect to the server. Please check your internet connection.',
            statusCode: 0,
            category: 'network'
        },
        'NET_002': {
            code: 'NET_002',
            message: 'Request timeout',
            userMessage: 'The request took too long. Please try again.',
            statusCode: 408,
            category: 'network'
        },
        'NET_003': {
            code: 'NET_003',
            message: 'Server unavailable',
            userMessage: 'The server is temporarily unavailable. Please try again later.',
            statusCode: 503,
            category: 'network'
        },
        'NET_004': {
            code: 'NET_004',
            message: 'CORS error',
            userMessage: 'Unable to connect to the server. Please refresh the page.',
            statusCode: 0,
            category: 'network'
        },

        // Server Errors (SRV_*)
        'SRV_001': {
            code: 'SRV_001',
            message: 'Internal server error',
            userMessage: 'Something went wrong on our end. Please try again later.',
            statusCode: 500,
            category: 'server'
        },
        'SRV_002': {
            code: 'SRV_002',
            message: 'Database connection failed',
            userMessage: 'Unable to save data. Please try again.',
            statusCode: 500,
            category: 'server'
        },
        'SRV_003': {
            code: 'SRV_003',
            message: 'External service unavailable',
            userMessage: 'A required service is temporarily unavailable. Please try again later.',
            statusCode: 503,
            category: 'server'
        },
        'SRV_004': {
            code: 'SRV_004',
            message: 'File upload failed',
            userMessage: 'Unable to upload file. Please try again.',
            statusCode: 500,
            category: 'server'
        },

        // Permission Errors (PERM_*)
        'PERM_001': {
            code: 'PERM_001',
            message: 'Insufficient permissions',
            userMessage: 'You don\'t have permission to perform this action.',
            statusCode: 403,
            category: 'permission'
        },
        'PERM_002': {
            code: 'PERM_002',
            message: 'Resource access denied',
            userMessage: 'You cannot access this resource.',
            statusCode: 403,
            category: 'permission'
        },
        'PERM_003': {
            code: 'PERM_003',
            message: 'Action not allowed',
            userMessage: 'This action is not allowed.',
            statusCode: 403,
            category: 'permission'
        },

        // Not Found Errors (NF_*)
        'NF_001': {
            code: 'NF_001',
            message: 'Opportunity not found',
            userMessage: 'The opportunity you\'re looking for doesn\'t exist or has been removed.',
            statusCode: 404,
            category: 'not_found'
        },
        'NF_002': {
            code: 'NF_002',
            message: 'User not found',
            userMessage: 'User account not found.',
            statusCode: 404,
            category: 'not_found'
        },
        'NF_003': {
            code: 'NF_003',
            message: 'Page not found',
            userMessage: 'The page you\'re looking for doesn\'t exist.',
            statusCode: 404,
            category: 'not_found'
        },

        // Rate Limit Errors (RL_*)
        'RL_001': {
            code: 'RL_001',
            message: 'Too many requests',
            userMessage: 'You\'re making requests too quickly. Please wait a moment and try again.',
            statusCode: 429,
            category: 'rate_limit'
        },
        'RL_002': {
            code: 'RL_002',
            message: 'Rate limit exceeded',
            userMessage: 'You\'ve exceeded the maximum number of requests. Please try again later.',
            statusCode: 429,
            category: 'rate_limit'
        },

        // Opportunity Specific Errors (OPP_*)
        'OPP_001': {
            code: 'OPP_001',
            message: 'Opportunity creation failed',
            userMessage: 'Unable to create opportunity. Please try again.',
            statusCode: 500,
            category: 'server'
        },
        'OPP_002': {
            code: 'OPP_002',
            message: 'Opportunity update failed',
            userMessage: 'Unable to update opportunity. Please try again.',
            statusCode: 500,
            category: 'server'
        },
        'OPP_003': {
            code: 'OPP_003',
            message: 'Opportunity deletion failed',
            userMessage: 'Unable to delete opportunity. Please try again.',
            statusCode: 500,
            category: 'server'
        },
        'OPP_004': {
            code: 'OPP_004',
            message: 'Opportunity already published',
            userMessage: 'This opportunity is already published.',
            statusCode: 400,
            category: 'validation'
        },
        'OPP_005': {
            code: 'OPP_005',
            message: 'Opportunity already unpublished',
            userMessage: 'This opportunity is already unpublished.',
            statusCode: 400,
            category: 'validation'
        },
        'OPP_006': {
            code: 'OPP_006',
            message: 'No draft to publish',
            userMessage: 'No draft found to publish. Please save your changes first.',
            statusCode: 400,
            category: 'validation'
        }
    };

    static getError(code: string, context?: string): AppError {
        const error = this.errors[code];
        if (!error) {
            return {
                code: 'SRV_001',
                message: 'Unknown error',
                userMessage: 'An unexpected error occurred. Please try again.',
                statusCode: 500,
                category: 'server',
                context: `Unknown error code: ${code}`
            };
        }
        return { ...error, context };
    }

    static createError(code: string, context?: string): Error {
        const appError = this.getError(code, context);
        const error = new Error(appError.message);
        (error as any).appError = appError;
        return error;
    }

    static getErrorFromResponse(response: any, context?: string): AppError {
        // Handle API response errors
        if (response?.code && this.errors[response.code]) {
            return this.getError(response.code, context);
        }

        // Handle HTTP status codes
        const statusCode = response?.status || response?.statusCode || 500;

        switch (statusCode) {
            case 400:
                return this.getError('VAL_001', context);
            case 401:
                return this.getError('AUTH_001', context);
            case 403:
                return this.getError('PERM_001', context);
            case 404:
                return this.getError('NF_001', context);
            case 408:
                return this.getError('NET_002', context);
            case 429:
                return this.getError('RL_001', context);
            case 500:
                return this.getError('SRV_001', context);
            case 503:
                return this.getError('NET_003', context);
            default:
                return this.getError('SRV_001', context);
        }
    }

    static getErrorFromException(exception: any, context?: string): AppError {
        const message = exception?.message || 'Unknown error';

        // Network errors
        if (message.includes('fetch') || message.includes('network') || message.includes('CORS')) {
            return this.getError('NET_001', context);
        }

        // Authentication errors
        if (message.includes('auth') || message.includes('token') || message.includes('unauthorized')) {
            return this.getError('AUTH_001', context);
        }

        // Validation errors
        if (message.includes('validation') || message.includes('invalid') || message.includes('required')) {
            return this.getError('VAL_001', context);
        }

        // Default to server error
        return this.getError('SRV_001', context);
    }

    static getAllErrors(): Record<string, AppError> {
        return { ...this.errors };
    }

    static getErrorsByCategory(category: AppError['category']): AppError[] {
        return Object.values(this.errors).filter(error => error.category === category);
    }
}

// Export commonly used error codes for easy access
export const ERROR_CODES = {
    // Auth
    INVALID_TOKEN: 'AUTH_001',
    NOT_AUTHENTICATED: 'AUTH_002',
    INVALID_CREDENTIALS: 'AUTH_003',
    EMAIL_NOT_VERIFIED: 'AUTH_004',
    ADMIN_REQUIRED: 'AUTH_005',

    // Validation
    REQUIRED_FIELD: 'VAL_001',
    INVALID_EMAIL: 'VAL_002',
    INVALID_URL: 'VAL_003',
    INVALID_DATE: 'VAL_004',
    TEXT_TOO_LONG: 'VAL_005',
    INVALID_TYPE: 'VAL_006',

    // Network
    CONNECTION_FAILED: 'NET_001',
    TIMEOUT: 'NET_002',
    SERVER_UNAVAILABLE: 'NET_003',
    CORS_ERROR: 'NET_004',

    // Server
    INTERNAL_ERROR: 'SRV_001',
    DATABASE_ERROR: 'SRV_002',
    EXTERNAL_SERVICE_ERROR: 'SRV_003',
    UPLOAD_ERROR: 'SRV_004',

    // Permission
    INSUFFICIENT_PERMISSIONS: 'PERM_001',
    ACCESS_DENIED: 'PERM_002',
    ACTION_NOT_ALLOWED: 'PERM_003',

    // Not Found
    OPPORTUNITY_NOT_FOUND: 'NF_001',
    USER_NOT_FOUND: 'NF_002',
    PAGE_NOT_FOUND: 'NF_003',

    // Rate Limit
    TOO_MANY_REQUESTS: 'RL_001',
    RATE_LIMIT_EXCEEDED: 'RL_002',

    // Opportunity
    CREATE_FAILED: 'OPP_001',
    UPDATE_FAILED: 'OPP_002',
    DELETE_FAILED: 'OPP_003',
    ALREADY_PUBLISHED: 'OPP_004',
    ALREADY_UNPUBLISHED: 'OPP_005',
    NO_DRAFT: 'OPP_006'
} as const;
