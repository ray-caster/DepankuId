# 🎨 Depanku.id Design System

## Color Palette (OKLCH)

### Primary Colors
```css
primary-600: oklch(60% 0.15 265)  /* Main blue - Actions, links */
primary-700: oklch(55% 0.15 265)  /* Darker blue - Hover states */
```

### Neutral Colors
```css
neutral-400: oklch(65% 0 0)       /* Borders (Base) */
neutral-500: oklch(55% 0 0)       /* Borders (Hover) */
neutral-600: oklch(45% 0 0)       /* Borders (Strong) */
```

### Background Colors
```css
background: oklch(100% 0 0)           /* #FFFFFF - Main bg */
background-light: oklch(98% 0 0)      /* Subtle bg */
background-lighter: oklch(96% 0 0)    /* Cards, inputs */
```

## Border System

### Base Rule: All Borders are 2px Solid

```css
/* Default State */
border-2 border-neutral-400

/* Hover State */
hover:border-neutral-500

/* Focus State */
focus:border-primary-500

/* Active State (Navigation) */
border-neutral-500
```

### Border Usage by Component:

| Component | Border Color | Hover | Focus |
|-----------|-------------|-------|-------|
| **Search Input** | neutral-400 | neutral-500 | primary-500 |
| **Buttons (Primary)** | neutral-500 | neutral-600 | - |
| **Buttons (Secondary)** | neutral-400 | neutral-500 | - |
| **Cards** | neutral-400 | primary-400 | - |
| **Dropdowns** | neutral-400 | - | - |
| **Navigation (Active)** | neutral-500 | - | - |
| **Navigation (Inactive)** | neutral-400 | neutral-500 | - |

## Shadow System

### Multi-Layer Shadows for Depth

```css
/* Subtle Elements (Cards) */
boxShadow: '0 2px 4px -1px oklch(0% 0 0 / 0.08)'

/* Medium Elevation (Inputs) */
boxShadow: `inset 0 2px 4px 0 oklch(0% 0 0 / 0.05),
            0 6px 12px -2px oklch(0% 0 0 / 0.08),
            0 10px 20px -4px oklch(0% 0 0 / 0.05)`

/* High Elevation (Buttons) */
boxShadow: `0 8px 16px -4px oklch(0% 0 0 / 0.2),
            0 4px 8px -2px oklch(0% 0 0 / 0.1),
            inset 0 1px 0 0 oklch(100% 0 0 / 0.1)`

/* Floating Elements (Dropdowns) */
boxShadow: `0 12px 24px -4px oklch(0% 0 0 / 0.15),
            0 16px 32px -6px oklch(0% 0 0 / 0.1)`
```

## Typography

### Font Sizes (Responsive)

```css
/* Headings */
Hero (H1): 
  - Mobile: text-3xl (30px)
  - Tablet: text-4xl (36px)
  - Desktop: text-5xl (48px)

Section (H2):
  - Mobile: text-2xl (24px)
  - Desktop: text-4xl (36px)

Subsection (H3):
  - Mobile: text-xl (20px)
  - Desktop: text-2xl (24px)

/* Body Text */
Large: text-lg (18px)
Base: text-base (16px)
Small: text-sm (14px)
Tiny: text-xs (12px)
```

### Font Weights
```css
font-normal: 400     /* Body text */
font-medium: 500     /* Inputs, subtle emphasis */
font-semibold: 600   /* Labels, headings */
font-bold: 700       /* Buttons, strong emphasis */
```

## Spacing System

All spacing divisible by 4 (REM units):

```css
gap-2: 0.5rem (8px)
gap-3: 0.75rem (12px)
gap-4: 1rem (16px)
gap-6: 1.5rem (24px)
gap-8: 2rem (32px)
gap-12: 3rem (48px)
gap-16: 4rem (64px)
```

## Border Radius

```css
rounded-soft: 0.5rem (8px)     /* Small elements */
rounded-gentle: 0.75rem (12px) /* Cards, containers */
rounded-comfort: 1rem (16px)   /* Large elements */
```

## Button Styles

### Primary Button
```tsx
className="px-8 py-4 text-lg font-bold
           bg-primary-600 text-white rounded-comfort
           border-2 border-neutral-500
           hover:bg-primary-700 hover:border-neutral-600"
style={{
  boxShadow: '0 8px 16px -4px oklch(0% 0 0 / 0.2), 
              0 4px 8px -2px oklch(0% 0 0 / 0.1), 
              inset 0 1px 0 0 oklch(100% 0 0 / 0.1)'
}}
```

### Secondary Button
```tsx
className="px-8 py-4 text-lg font-bold
           bg-white text-primary-700 rounded-comfort
           border-2 border-neutral-400
           hover:bg-primary-50 hover:border-neutral-500"
style={{
  boxShadow: '0 8px 16px -4px oklch(0% 0 0 / 0.15), 
              0 4px 8px -2px oklch(0% 0 0 / 0.08), 
              inset 0 1px 0 0 oklch(100% 0 0 / 0.1)'
}}
```

## Input Styles

### Search Input
```tsx
className="w-full pl-20 pr-10 py-7 text-lg font-medium
           bg-background-light rounded-comfort
           border-2 border-neutral-400
           focus:outline-none focus:border-primary-500 
           focus:bg-background-lighter
           hover:border-neutral-500"
style={{
  boxShadow: `inset 0 2px 4px 0 oklch(0% 0 0 / 0.05),
              0 6px 12px -2px oklch(0% 0 0 / 0.08),
              0 10px 20px -4px oklch(0% 0 0 / 0.05)`
}}
```

## Card Styles

### Benefit Card
```tsx
className="bg-background rounded-gentle p-8 
           border-2 border-neutral-400 
           hover:border-primary-400"
style={{
  boxShadow: '0 4px 12px -2px oklch(0% 0 0 / 0.08), 
              0 2px 8px -2px oklch(0% 0 0 / 0.05)'
}}
```

### Testimonial Card
```tsx
className="bg-background-light rounded-gentle p-8 
           border-2 border-neutral-400"
style={{
  boxShadow: '0 8px 16px -4px oklch(0% 0 0 / 0.1), 
              inset 0 2px 0 0 oklch(100% 0 0 / 0.1)'
}}
```

## Navigation Styles

### Active Navigation Item
```tsx
className="flex items-center gap-2 px-4 py-2 rounded-soft 
           bg-primary-600 text-white 
           border-2 border-neutral-500"
style={{
  boxShadow: '0 4px 8px -2px oklch(0% 0 0 / 0.15), 
              inset 0 1px 0 0 oklch(100% 0 0 / 0.1)'
}}
```

### Inactive Navigation Item
```tsx
className="flex items-center gap-2 px-4 py-2 rounded-soft 
           bg-background-light text-foreground-light 
           border-2 border-neutral-400 
           hover:border-neutral-500 hover:bg-background-lighter"
style={{
  boxShadow: '0 2px 4px -1px oklch(0% 0 0 / 0.08)'
}}
```

## Responsive Breakpoints

```css
/* Mobile First Approach */
Default: < 640px (Mobile)
sm: >= 640px (Large Mobile)
md: >= 768px (Tablet)
lg: >= 1024px (Desktop)
xl: >= 1280px (Large Desktop)
```

### Usage Pattern:
```tsx
className="text-base sm:text-lg md:text-xl lg:text-2xl"
          "px-4 sm:px-6 md:px-8"
          "py-3 sm:py-4 md:py-5"
```

## Animation Guidelines

### Hover Effects
```tsx
whileHover={{ y: -3, scale: 1.02 }}
whileTap={{ scale: 0.98 }}
transition={{ duration: 0.3 }}
```

### Page Transitions
```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
```

## Accessibility

- Minimum touch target: 44x44px
- Color contrast ratio: 4.5:1 (AA standard)
- Focus indicators: 2px primary-500 border
- Keyboard navigation supported
- Screen reader friendly labels

## Usage Examples

### Example 1: Primary CTA Button
```tsx
<motion.button
  whileHover={{ y: -3, scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="px-8 py-4 text-lg font-bold
             bg-primary-600 text-white rounded-comfort
             border-2 border-neutral-500
             hover:bg-primary-700 hover:border-neutral-600
             transition-all duration-300"
  style={{
    boxShadow: '0 8px 16px -4px oklch(0% 0 0 / 0.2), 
                0 4px 8px -2px oklch(0% 0 0 / 0.1), 
                inset 0 1px 0 0 oklch(100% 0 0 / 0.1)'
  }}
>
  Get Started
</motion.button>
```

### Example 2: Search Input
```tsx
<input
  type="text"
  className="w-full pl-20 pr-10 py-7 text-lg font-medium
             bg-background-light rounded-comfort
             border-2 border-neutral-400
             focus:outline-none focus:border-primary-500 
             hover:border-neutral-500
             transition-all duration-300"
  style={{
    boxShadow: `inset 0 2px 4px 0 oklch(0% 0 0 / 0.05),
                0 6px 12px -2px oklch(0% 0 0 / 0.08),
                0 10px 20px -4px oklch(0% 0 0 / 0.05)`
  }}
  placeholder="Search..."
/>
```

---

**Last Updated**: 2025
**Version**: 2.0
**Maintained by**: Depanku.id Team

