/**
 * Application Constants
 * Centralized configuration for magic numbers and limits
 */

export const TIMEOUTS = {
  DEBOUNCE: 1000,
  MODAL_CLOSE: 200,
  AUTOSAVE: 2000,
  SEARCH_DEBOUNCE: 300,
} as const;

export const LIMITS = {
  MAX_SUGGESTIONS: 8,
  MAX_TAGS: 20,
  MAX_CATEGORIES: 10,
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 2000,
  ORGANIZATION_MIN_LENGTH: 2,
  ORGANIZATION_MAX_LENGTH: 100,
} as const;

export const CACHE_KEYS = {
  TEMPLATES: 'opportunity-templates',
  CATEGORY_PRESETS: 'category-presets',
  TAG_PRESETS: 'tag-presets',
  OPPORTUNITIES: 'opportunities',
  BOOKMARKS: 'user-bookmarks',
} as const;

export const STORAGE_KEYS = {
  OPPORTUNITY_DRAFT: 'opportunity-draft',
  LAST_SAVED: 'opportunity-draft-timestamp',
  USER_PREFERENCES: 'user-preferences',
} as const;

