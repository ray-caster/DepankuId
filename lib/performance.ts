/**
 * Performance Optimization Utilities
 * Memoization, debouncing, throttling, and lazy loading helpers
 */

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Debounce hook - delays execution until after user stops typing/acting
 * Perfect for search inputs and expensive operations
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}

/**
 * Throttle hook - limits execution rate
 * Perfect for scroll events and resize handlers
 */
export function useThrottle<T>(value: T, limit: number = 200): T {
    const [throttledValue, setThrottledValue] = useState<T>(value);
    const lastRan = useRef(Date.now());

    useEffect(() => {
        const handler = setTimeout(() => {
            if (Date.now() - lastRan.current >= limit) {
                setThrottledValue(value);
                lastRan.current = Date.now();
            }
        }, limit - (Date.now() - lastRan.current));

        return () => clearTimeout(handler);
    }, [value, limit]);

    return throttledValue;
}

/**
 * Intersection Observer hook for lazy loading
 * Perfect for images, components, and infinite scroll
 */
export function useIntersectionObserver(
    ref: React.RefObject<Element>,
    options: IntersectionObserverInit = {}
): boolean {
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);
        }, options);

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [ref, options]);

    return isIntersecting;
}

/**
 * Memoized callback that won't change on re-renders
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(
    callback: T,
    dependencies: React.DependencyList
): T {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(callback, dependencies) as T;
}

/**
 * Local storage hook with SSR safety
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') return initialValue;

        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = (value: T) => {
        try {
            setStoredValue(value);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(value));
            }
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue];
}

/**
 * Prefetch utility for optimistic loading
 */
export const prefetch = async (url: string): Promise<void> => {
    if (typeof window === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
};

/**
 * Image optimization utility
 */
export const getOptimizedImageUrl = (
    src: string,
    width: number = 800,
    quality: number = 75
): string => {
    // For Next.js Image Optimization API
    if (src.startsWith('/')) {
        return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
    }
    return src;
};

