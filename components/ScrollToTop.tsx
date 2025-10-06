'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
    const pathname = usePathname();

    useEffect(() => {
        // Scroll to top when pathname changes
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        });

        // Also ensure document element is at top
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, [pathname]);

    return null;
}
