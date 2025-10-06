'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect mobile device and screen size
 * Industry standard breakpoints:
 * - mobile: < 640px
 * - tablet: 640px - 1024px  
 * - desktop: > 1024px
 */
export function useResponsive() {
    const [screenSize, setScreenSize] = useState({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setScreenSize({
                isMobile: width < 640,
                isTablet: width >= 640 && width < 1024,
                isDesktop: width >= 1024,
                width,
            });
        };

        // Initial check
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);
        
        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return screenSize;
}

/**
 * Container component with responsive padding and max-width
 */
export function ResponsiveContainer({ children, className = '' }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
            {children}
        </div>
    );
}

/**
 * Responsive grid with automatic columns based on screen size
 */
export function ResponsiveGrid({ 
    children, 
    className = '',
    mobileColumns = 1,
    tabletColumns = 2,
    desktopColumns = 3
}: { 
    children: React.ReactNode, 
    className?: string,
    mobileColumns?: number,
    tabletColumns?: number,
    desktopColumns?: number
}) {
    const gridClasses = `grid grid-cols-${mobileColumns} sm:grid-cols-${tabletColumns} lg:grid-cols-${desktopColumns} gap-4 sm:gap-6`;
    
    return (
        <div className={`${gridClasses} ${className}`}>
            {children}
        </div>
    );
}

/**
 * Responsive text with appropriate sizes for different screens
 */
export function ResponsiveHeading({ 
    level = 1, 
    children, 
    className = '' 
}: { 
    level?: 1 | 2 | 3 | 4 | 5 | 6, 
    children: React.ReactNode, 
    className?: string 
}) {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
    
    const sizeClasses = {
        1: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
        2: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
        3: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
        4: 'text-lg sm:text-xl md:text-2xl lg:text-3xl',
        5: 'text-base sm:text-lg md:text-xl lg:text-2xl',
        6: 'text-sm sm:text-base md:text-lg lg:text-xl',
    };
    
    return (
        <Tag className={`${sizeClasses[level]} font-bold ${className}`}>
            {children}
        </Tag>
    );
}

/**
 * Touch-optimized button for mobile
 */
export function TouchButton({ 
    children, 
    className = '',
    ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={`min-h-[44px] min-w-[44px] touch-manipulation active:scale-95 transition-transform ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

/**
 * Mobile-optimized modal that slides up from bottom on mobile
 */
export function ResponsiveModal({ 
    isOpen, 
    onClose, 
    children, 
    title 
}: { 
    isOpen: boolean, 
    onClose: () => void, 
    children: React.ReactNode, 
    title?: string 
}) {
    const { isMobile } = useResponsive();
    
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className={`relative min-h-full flex items-end sm:items-center justify-center p-0 sm:p-4`}>
                <div className={`
                    relative w-full bg-white
                    ${isMobile 
                        ? 'rounded-t-3xl max-h-[90vh] overflow-y-auto' 
                        : 'rounded-2xl max-w-2xl max-h-[85vh] overflow-y-auto'
                    }
                `}>
                    {title && (
                        <div className="sticky top-0 bg-white border-b border-neutral-200 p-4 sm:p-6">
                            <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
                        </div>
                    )}
                    <div className="p-4 sm:p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Responsive spacing utility
 */
export function ResponsiveSpacing({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
    const spacingClasses = {
        sm: 'h-4 sm:h-6',
        md: 'h-6 sm:h-8 lg:h-12',
        lg: 'h-8 sm:h-12 lg:h-16',
        xl: 'h-12 sm:h-16 lg:h-24',
    };
    
    return <div className={spacingClasses[size]} />;
}

