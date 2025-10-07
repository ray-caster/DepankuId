/**
 * Category Color System
 * 
 * This utility provides consistent color mapping for different opportunity categories
 * that matches the sage green color palette used throughout the application.
 */

export type OpportunityType = 
  | 'research' 
  | 'youth-program' 
  | 'community' 
  | 'competition'
  | 'scholarship'
  | 'internship'
  | 'fellowship'
  | 'volunteer'
  | 'hackathon'
  | 'conference'
  | 'workshop'
  | 'summer-program';

export interface CategoryColor {
  background: string;
  text: string;
  border: string;
  hover: string;
}

/**
 * Color mapping for different opportunity types
 * Uses the sage green palette with OKLCH colors for consistency
 */
export const categoryColors: Record<OpportunityType, CategoryColor> = {
  // Primary colors (Teal-blue family)
  'research': {
    background: 'bg-primary-100',
    text: 'text-primary-800',
    border: 'border-primary-200',
    hover: 'hover:bg-primary-150'
  },
  'competition': {
    background: 'bg-primary-50',
    text: 'text-primary-700',
    border: 'border-primary-100',
    hover: 'hover:bg-primary-100'
  },
  'fellowship': {
    background: 'bg-primary-200',
    text: 'text-primary-900',
    border: 'border-primary-300',
    hover: 'hover:bg-primary-250'
  },
  'conference': {
    background: 'bg-primary-150',
    text: 'text-primary-800',
    border: 'border-primary-250',
    hover: 'hover:bg-primary-200'
  },

  // Secondary colors (Sage green family)
  'youth-program': {
    background: 'bg-secondary-100',
    text: 'text-secondary-800',
    border: 'border-secondary-200',
    hover: 'hover:bg-secondary-150'
  },
  'scholarship': {
    background: 'bg-secondary-50',
    text: 'text-secondary-700',
    border: 'border-secondary-100',
    hover: 'hover:bg-secondary-100'
  },
  'volunteer': {
    background: 'bg-secondary-200',
    text: 'text-secondary-900',
    border: 'border-secondary-300',
    hover: 'hover:bg-secondary-250'
  },
  'workshop': {
    background: 'bg-secondary-150',
    text: 'text-secondary-800',
    border: 'border-secondary-250',
    hover: 'hover:bg-secondary-200'
  },

  // Accent colors (Warm amber family)
  'community': {
    background: 'bg-accent-100',
    text: 'text-accent-800',
    border: 'border-accent-200',
    hover: 'hover:bg-accent-150'
  },
  'internship': {
    background: 'bg-accent-50',
    text: 'text-accent-700',
    border: 'border-accent-100',
    hover: 'hover:bg-accent-100'
  },
  'hackathon': {
    background: 'bg-accent-200',
    text: 'text-accent-900',
    border: 'border-accent-300',
    hover: 'hover:bg-accent-250'
  },
  'summer-program': {
    background: 'bg-accent-150',
    text: 'text-accent-800',
    border: 'border-accent-250',
    hover: 'hover:bg-accent-200'
  },
};

/**
 * Get color classes for a specific opportunity type
 */
export function getCategoryColors(type: OpportunityType): CategoryColor {
  return categoryColors[type] || categoryColors['research'];
}

/**
 * Get combined CSS classes for a category badge
 */
export function getCategoryBadgeClasses(type: OpportunityType): string {
  const colors = getCategoryColors(type);
  return `${colors.background} ${colors.text} ${colors.border} ${colors.hover} border rounded-soft px-3 py-1 text-xs font-medium transition-colors`;
}

/**
 * Get combined CSS classes for a category card
 */
export function getCategoryCardClasses(type: OpportunityType): string {
  const colors = getCategoryColors(type);
  return `${colors.background} ${colors.text} ${colors.border} ${colors.hover} border rounded-comfort p-4 transition-colors`;
}

/**
 * Human-readable labels for opportunity types
 */
export const categoryLabels: Record<OpportunityType, string> = {
  'research': 'Research',
  'youth-program': 'Youth Program',
  'community': 'Community',
  'competition': 'Competition',
  'scholarship': 'Scholarship',
  'internship': 'Internship',
  'fellowship': 'Fellowship',
  'volunteer': 'Volunteer',
  'hackathon': 'Hackathon',
  'conference': 'Conference',
  'workshop': 'Workshop',
  'summer-program': 'Summer Program',
};

/**
 * Get human-readable label for an opportunity type
 */
export function getCategoryLabel(type: OpportunityType): string {
  return categoryLabels[type] || 'Opportunity';
}

/**
 * Color palette explanation:
 * 
 * Primary (Teal-blue): Research, Competition, Fellowship, Conference
 * - Represents academic and professional opportunities
 * - Cool, trustworthy, intellectual feeling
 * 
 * Secondary (Sage green): Youth Program, Scholarship, Volunteer, Workshop
 * - Represents educational and community-focused opportunities
 * - Natural, growth-oriented, nurturing feeling
 * 
 * Accent (Warm amber): Community, Internship, Hackathon, Summer Program
 * - Represents social and hands-on opportunities
 * - Energetic, creative, collaborative feeling
 * 
 * Each category uses different shades (50, 100, 150, 200) to create
 * visual hierarchy and distinction while maintaining consistency.
 */
