# Category Color System for DepankuId

## Overview

This document outlines the comprehensive category color system implemented for the DepankuId platform. The system uses OKLCH colors to maintain consistency with the existing sage green palette while providing distinct visual categories for different types of opportunities.

## Color Palette Structure

### Primary Colors (Teal-blue family)
- **Research**: `bg-primary-100 text-primary-800 border-primary-200`
- **Competition**: `bg-primary-50 text-primary-700 border-primary-100`
- **Fellowship**: `bg-primary-200 text-primary-900 border-primary-300`
- **Conference**: `bg-primary-150 text-primary-800 border-primary-250`

### Secondary Colors (Sage green family)
- **Youth Program**: `bg-secondary-100 text-secondary-800 border-secondary-200`
- **Scholarship**: `bg-secondary-50 text-secondary-700 border-secondary-100`
- **Volunteer**: `bg-secondary-200 text-secondary-900 border-secondary-300`
- **Workshop**: `bg-secondary-150 text-secondary-800 border-secondary-250`

### Accent Colors (Warm amber family)
- **Community**: `bg-accent-100 text-accent-800 border-accent-200`
- **Internship**: `bg-accent-50 text-accent-700 border-accent-100`
- **Hackathon**: `bg-accent-200 text-accent-900 border-accent-300`
- **Summer Program**: `bg-accent-150 text-accent-800 border-accent-250`

## Design Philosophy

### Color Psychology
- **Primary (Teal-blue)**: Represents academic and professional opportunities
  - Cool, trustworthy, intellectual feeling
  - Associated with knowledge, stability, and growth
  
- **Secondary (Sage green)**: Represents educational and community-focused opportunities
  - Natural, growth-oriented, nurturing feeling
  - Associated with learning, community, and personal development
  
- **Accent (Warm amber)**: Represents social and hands-on opportunities
  - Energetic, creative, collaborative feeling
  - Associated with innovation, teamwork, and dynamic experiences

### Visual Hierarchy
Each category uses different shades (50, 100, 150, 200) to create visual distinction:
- **50**: Lightest shade for subtle categories
- **100**: Standard shade for most categories
- **150**: Medium shade for emphasis
- **200**: Darkest shade for high-priority categories

## Implementation

### Utility Functions
The system is implemented through `lib/categoryColors.ts` which provides:

```typescript
// Get color classes for a specific opportunity type
getCategoryColors(type: OpportunityType): CategoryColor

// Get combined CSS classes for a category badge
getCategoryBadgeClasses(type: OpportunityType): string

// Get combined CSS classes for a category card
getCategoryCardClasses(type: OpportunityType): string

// Get human-readable label for an opportunity type
getCategoryLabel(type: OpportunityType): string
```

### Usage Examples

#### Badge Implementation
```tsx
<span className={getCategoryBadgeClasses(opportunity.type as OpportunityType)}>
    {getCategoryLabel(opportunity.type as OpportunityType)}
</span>
```

#### Card Implementation
```tsx
<div className={getCategoryCardClasses(opportunity.type as OpportunityType)}>
    {/* Card content */}
</div>
```

## Tailwind Configuration

The system extends the existing Tailwind config with additional color variants:

```typescript
primary: {
  50: 'oklch(97% 0.02 230)',
  100: 'oklch(94% 0.04 230)',
  150: 'oklch(91% 0.06 230)',  // New
  200: 'oklch(88% 0.08 230)',
  250: 'oklch(84% 0.10 230)',  // New
  // ... other variants
}
```

## Accessibility Considerations

- All color combinations meet WCAG AA contrast requirements
- Text colors are dark enough to ensure readability
- Background colors are light enough to provide sufficient contrast
- Hover states provide visual feedback without compromising accessibility

## Future Extensions

The system is designed to be easily extensible:

1. **New Categories**: Add new entries to `categoryColors` and `categoryLabels`
2. **New Color Families**: Extend the palette with additional color families
3. **Custom Themes**: Support for different color themes while maintaining the same structure

## Files Modified

1. **`lib/categoryColors.ts`** - New utility file with color system
2. **`components/OpportunityCard.tsx`** - Updated to use new color system
3. **`tailwind.config.ts`** - Extended with additional color variants
4. **`app/search/page.tsx`** - Reduced size of header and search bar
5. **`components/CategoryColorPalette.tsx`** - Demo component for color visualization

## Benefits

- **Consistency**: All category colors follow the same design system
- **Maintainability**: Centralized color management through utilities
- **Scalability**: Easy to add new categories or modify existing ones
- **Accessibility**: All combinations meet contrast requirements
- **Performance**: Uses Tailwind's utility classes for optimal CSS output
