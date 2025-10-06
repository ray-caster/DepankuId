# 📱 Mobile Testing & Optimization Guide

## Quick Start

### 1. Update Backend Environment Variables

Add to `backend/.env`:
```env
BREVO_SENDER_EMAIL=verify@depanku.id
BREVO_SENDER_NAME=Depanku Verification
```

### 2. Test Responsive Design

```bash
# Start development server
npm run dev

# Open browser DevTools (F12)
# Click Toggle Device Toolbar (Ctrl+Shift+M / Cmd+Shift+M)
# Select different devices
```

## 🎯 Responsive Breakpoints

Your site now uses industry-standard breakpoints:

| Size | Width | Device Type | Example |
|------|-------|-------------|---------|
| `xs` | 475px | Small phones | iPhone SE |
| `sm` | 640px | Phones | iPhone 13 Pro |
| `md` | 768px | Tablets | iPad Mini |
| `lg` | 1024px | Desktop | Laptop |
| `xl` | 1280px | Large Desktop | iMac |
| `2xl` | 1536px | XL Desktop | Large monitor |
| `3xl` | 1920px | Ultra-wide | 4K monitor |

## 🔧 Using Responsive Components

### Example 1: Conditional Rendering

```tsx
import { useResponsive } from '@/components/MobileOptimized';

export default function MyPage() {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return (
    <div>
      {isMobile && <MobileNav />}
      {isDesktop && <DesktopNav />}
    </div>
  );
}
```

### Example 2: Responsive Grid

```tsx
import { ResponsiveGrid } from '@/components/MobileOptimized';

<ResponsiveGrid 
  mobileColumns={1} 
  tabletColumns={2} 
  desktopColumns={3}
>
  <OpportunityCard />
  <OpportunityCard />
  <OpportunityCard />
</ResponsiveGrid>
```

### Example 3: Touch-Optimized Buttons

```tsx
import { TouchButton } from '@/components/MobileOptimized';

<TouchButton 
  onClick={handleClick}
  className="bg-primary-600 text-white px-6 py-3 rounded-lg"
>
  Apply Now
</TouchButton>
```

### Example 4: Mobile Modal

```tsx
import { ResponsiveModal } from '@/components/MobileOptimized';

<ResponsiveModal
  isOpen={isOpen}
  onClose={handleClose}
  title="Application Details"
>
  <ApplicationForm />
</ResponsiveModal>
```

### Example 5: Responsive Headings

```tsx
import { ResponsiveHeading } from '@/components/MobileOptimized';

<ResponsiveHeading level={1}>
  Discover Your Next Opportunity
</ResponsiveHeading>
{/* Automatically: text-3xl on mobile, text-6xl on desktop */}
```

## 🎨 Tailwind Responsive Classes

Use these classes in your components:

```tsx
// Padding that grows with screen size
<div className="p-4 sm:p-6 lg:p-8">

// Grid that adapts
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

// Text that scales
<h1 className="text-2xl sm:text-4xl lg:text-6xl">

// Hidden on mobile, visible on desktop
<div className="hidden lg:block">

// Visible only on mobile
<div className="block lg:hidden">

// Flex direction changes
<div className="flex flex-col sm:flex-row">
```

## ⚡ Performance Optimization Tools

### Lazy Loading Components

```tsx
import { lazyLoad } from '@/lib/performance';

// Heavy component that loads on demand
const GanttChart = lazyLoad(
  () => import('@/components/GanttChart'),
  <div>Loading chart...</div>
);

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <GanttChart />
    </div>
  );
}
```

### Debounce Search Input

```tsx
import { debounce } from '@/lib/performance';
import { useState, useCallback } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  // Debounce API calls
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      // API call here
      performSearch(value);
    }, 300),
    []
  );

  const handleChange = (e) => {
    setQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  return <input value={query} onChange={handleChange} />;
}
```

### Throttle Scroll Events

```tsx
import { throttle } from '@/lib/performance';
import { useEffect } from 'react';

export default function InfiniteScroll() {
  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Load more when near bottom
      if (scrollPosition + windowHeight > documentHeight - 100) {
        loadMoreItems();
      }
    }, 200);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <div>...</div>;
}
```

## 📊 Testing Checklist

### Visual Testing

- [ ] **Navigation**
  - Desktop: Full navbar visible
  - Mobile: Hamburger menu works
  - Profile dropdown accessible
  - "Make Your Own Opportunity!" button prominent

- [ ] **Homepage**
  - Hero section scales properly
  - Cards display in responsive grid
  - Images load and scale
  - CTA buttons visible and tappable

- [ ] **Browse Page**
  - Filters stack on mobile
  - Results grid adapts (1→2→3 columns)
  - Search bar easy to use
  - Algolia results display correctly

- [ ] **Dashboard**
  - Bookmarks display in grid
  - Gantt chart responsive
  - Stats cards stack on mobile
  - No horizontal scroll

- [ ] **Opportunities Form**
  - Form inputs full-width on mobile
  - Date pickers work on touch
  - File uploads functional
  - Submit button accessible

- [ ] **Profile & Settings**
  - Tabs scroll horizontally on mobile
  - Form fields stack vertically
  - Avatar upload works
  - Save buttons visible

### Performance Testing

- [ ] **Load Times**
  - Homepage < 2s on 3G
  - Subsequent pages < 1s
  - Images lazy load
  - No blocking resources

- [ ] **Interactions**
  - Smooth scrolling
  - No jank during animations
  - Fast navigation
  - Instant feedback on clicks

- [ ] **Network**
  - Efficient API calls
  - Proper caching
  - Minimal bundle size
  - Progressive loading

### Touch Interactions

- [ ] All buttons ≥ 44x44px
- [ ] No accidental clicks
- [ ] Proper touch feedback
- [ ] Swipeable components work
- [ ] Pull-to-refresh (if implemented)

## 🔍 Testing Tools

### Chrome DevTools

1. **Device Mode** (Ctrl+Shift+M)
   - Test different screen sizes
   - Simulate touch events
   - Throttle network speed

2. **Lighthouse**
   - Run audit (Ctrl+Shift+I → Lighthouse)
   - Check Performance score
   - Check Accessibility score
   - Check Best Practices

3. **Network Tab**
   - Monitor API calls
   - Check bundle sizes
   - Verify caching

### Browser Testing

Test on multiple browsers:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (if on Mac)
- ✅ Mobile browsers

### Real Device Testing

#### On Same WiFi Network

1. Find your IP address:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. Start dev server:
   ```bash
   npm run dev
   ```

3. On mobile device, visit:
   ```
   http://YOUR_IP:3000
   ```
   Example: `http://192.168.1.100:3000`

4. Test all features on real device

## 📧 Brevo Email Testing

### Setup

1. **Add Environment Variables**
   ```env
   BREVO_SENDER_EMAIL=verify@depanku.id
   BREVO_SENDER_NAME=Depanku Verification
   ```

2. **Verify in Brevo Dashboard**
   - Login to Brevo
   - Go to Settings → Senders
   - Verify `verify@depanku.id` is verified ✅
   - Check DKIM/DMARC status

### Testing Email Flow

1. **Start Backend**
   ```bash
   cd backend
   python run_uvicorn.py
   ```

2. **Monitor Logs**
   ```bash
   # Check backend.log
   tail -f backend.log
   ```

3. **Test Signup**
   - Go to frontend
   - Create test account
   - Check logs for email send confirmation
   - Check inbox for verification email
   - Click verification link

4. **Expected Log Output**
   ```
   INFO: Sending verification email to test@example.com
   INFO: Verification email sent successfully to test@example.com. Message ID: xxx
   ```

### Troubleshooting

**Email not received?**
- Check spam folder
- Verify sender in Brevo dashboard
- Check DKIM/DMARC configuration
- Review backend logs for errors

**Error in logs?**
- Verify BREVO_API_KEY is correct
- Ensure BREVO_SENDER_EMAIL matches verified sender
- Check Brevo API status

## 🎨 Design Tips

### Mobile-First Approach

1. Design for mobile first
2. Add features for larger screens
3. Use Tailwind's responsive prefixes

```tsx
// ❌ Bad: Desktop-first
<div className="grid-cols-3 sm:grid-cols-1">

// ✅ Good: Mobile-first
<div className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
```

### Touch Targets

- Minimum 44x44px (Apple HIG)
- Add padding around clickable elements
- Use `TouchButton` component

```tsx
// ❌ Bad: Small touch target
<button className="p-1 text-sm">Click</button>

// ✅ Good: Large touch target
<TouchButton className="px-6 py-3">Click</TouchButton>
```

### Font Sizes

- Minimum 16px for body text on mobile
- Use responsive headings
- Ensure good contrast

```tsx
// ❌ Bad: Too small on mobile
<p className="text-xs">Long paragraph...</p>

// ✅ Good: Readable on all screens
<p className="text-base sm:text-lg">Long paragraph...</p>
```

## 📈 Performance Monitoring

### Web Vitals

Check these metrics:

1. **LCP (Largest Contentful Paint)** < 2.5s
   - Optimize images
   - Lazy load below fold
   - Use CDN

2. **FID (First Input Delay)** < 100ms
   - Code splitting
   - Defer JavaScript
   - Optimize event handlers

3. **CLS (Cumulative Layout Shift)** < 0.1
   - Set image dimensions
   - Reserve space for ads
   - Avoid dynamic content above fold

### Monitoring in Production

```tsx
// app/layout.tsx
import { reportWebVitals } from '@/lib/performance';

export function reportWebVitals(metric: any) {
  console.log(metric);
  
  // Send to analytics
  // gtag('event', metric.name, { value: metric.value });
}
```

## 🚀 Deployment Checklist

Before deploying:

- [ ] Run Lighthouse audit (score > 90)
- [ ] Test on real mobile devices
- [ ] Verify all images optimized
- [ ] Check bundle size
- [ ] Test email sending in production
- [ ] Verify Brevo sender email
- [ ] Test authentication flow
- [ ] Check responsive breakpoints
- [ ] Verify touch targets
- [ ] Test offline behavior (if PWA)

## 🎉 Summary

You now have:
- ✅ Industry-standard responsive breakpoints
- ✅ Mobile-optimized components
- ✅ Performance optimization utilities
- ✅ Touch-friendly interactions
- ✅ Proper email configuration
- ✅ Lazy loading and code splitting
- ✅ PWA support
- ✅ Enhanced Tailwind configuration

**Your site is production-ready and mobile-optimized!** 📱✨

