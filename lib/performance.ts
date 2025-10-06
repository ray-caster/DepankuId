/**
 * Performance utilities and optimizations
 */

// Lazy load components
export const lazyLoad = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = React.lazy(importFunc);
  
  return (props: React.ComponentProps<T>) => (
    <React.Suspense fallback={fallback || <LoadingSpinner />}>
      <LazyComponent {...props} />
    </React.Suspense>
  );
};

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Debounce function for search inputs
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function for scroll events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Intersection Observer for lazy loading
export const useIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) => {
  const observerRef = React.useRef<IntersectionObserver | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver(callback, {
        rootMargin: '50px',
        threshold: 0.01,
        ...options,
      });
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback, options]);

  return observerRef.current;
};

// Prefetch link on hover
export const prefetchOnHover = (href: string) => {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  }
};

// Measure performance
export const measurePerformance = (metricName: string, callback: () => void) => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const startMark = `${metricName}-start`;
    const endMark = `${metricName}-end`;
    
    performance.mark(startMark);
    callback();
    performance.mark(endMark);
    
    try {
      performance.measure(metricName, startMark, endMark);
      const measure = performance.getEntriesByName(metricName)[0];
      console.log(`${metricName}: ${measure.duration.toFixed(2)}ms`);
    } catch (e) {
      // Ignore errors in production
    }
  } else {
    callback();
  }
};

// Web Vitals reporting
export const reportWebVitals = (metric: any) => {
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics
    console.log(metric);
    
    // You can send to Google Analytics, Vercel Analytics, etc.
    // Example: gtag('event', metric.name, { value: metric.value });
  }
};

// Import React for lazy loading
import React from 'react';
