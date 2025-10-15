import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/ErrorBoundary";
import { QueryProvider } from "@/components/QueryProvider";

const inter = Inter({
    subsets: ["latin"],
    variable: '--font-inter',
    display: 'swap',
});

export const metadata: Metadata = {
    title: "Depanku.id - Find Research Programs and Youth Opportunities in Indonesia",
    description: "Free platform for Indonesian students to discover research programs, competitions, and youth opportunities. Search 500+ verified opportunities.",
    keywords: ["research programs Indonesia", "youth opportunities", "student competitions", "academic programs", "scholarships Indonesia", "student research", "youth development"],
    icons: {
        icon: [
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
            { url: '/favicon.ico', sizes: 'any' }
        ],
        apple: [
            { url: '/apple-icon-57x57.png', sizes: '57x57', type: 'image/png' },
            { url: '/apple-icon-60x60.png', sizes: '60x60', type: 'image/png' },
            { url: '/apple-icon-72x72.png', sizes: '72x72', type: 'image/png' },
            { url: '/apple-icon-76x76.png', sizes: '76x76', type: 'image/png' },
            { url: '/apple-icon-114x114.png', sizes: '114x114', type: 'image/png' },
            { url: '/apple-icon-120x120.png', sizes: '120x120', type: 'image/png' },
            { url: '/apple-icon-144x144.png', sizes: '144x144', type: 'image/png' },
            { url: '/apple-icon-152x152.png', sizes: '152x152', type: 'image/png' },
            { url: '/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
            { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }
        ],
        other: [
            { url: '/android-icon-36x36.png', sizes: '36x36', type: 'image/png' },
            { url: '/android-icon-48x48.png', sizes: '48x48', type: 'image/png' },
            { url: '/android-icon-72x72.png', sizes: '72x72', type: 'image/png' },
            { url: '/android-icon-96x96.png', sizes: '96x96', type: 'image/png' },
            { url: '/android-icon-144x144.png', sizes: '144x144', type: 'image/png' },
            { url: '/android-icon-192x192.png', sizes: '192x192', type: 'image/png' },
            { url: '/ms-icon-70x70.png', sizes: '70x70', type: 'image/png' },
            { url: '/ms-icon-144x144.png', sizes: '144x144', type: 'image/png' },
            { url: '/ms-icon-150x150.png', sizes: '150x150', type: 'image/png' },
            { url: '/ms-icon-310x310.png', sizes: '310x310', type: 'image/png' }
        ]
    },
    manifest: '/manifest.json',
    openGraph: {
        title: "Depanku.id - Find Research Programs and Youth Opportunities",
        description: "Free platform for Indonesian students to discover research programs, competitions, and youth opportunities.",
        type: "website",
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: "Depanku.id - Find Research Programs and Youth Opportunities",
        description: "Free platform for Indonesian students to discover research programs, competitions, and youth opportunities.",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

// Industry standard: Proper viewport configuration (Next.js 14+)
export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    viewportFit: 'cover', // For devices with notches
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={inter.variable} suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            // Suppress hydration warnings for browser extension attributes
                            if (typeof window !== 'undefined') {
                                const originalConsoleWarn = console.warn;
                                console.warn = function(...args) {
                                    const message = args.join(' ');
                                    if (message.includes('Extra attributes from the server') && 
                                        message.includes('webcrx')) {
                                        return; // Suppress webcrx warnings
                                    }
                                    originalConsoleWarn.apply(console, args);
                                };
                            }
                        `
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            "name": "Depanku.id",
                            "description": "Free platform for Indonesian students to discover research programs, competitions, and youth opportunities",
                            "url": "https://depanku.id",
                            "potentialAction": {
                                "@type": "SearchAction",
                                "target": "https://depanku.id/search?q={search_term_string}",
                                "query-input": "required name=search_term_string"
                            },
                            "publisher": {
                                "@type": "Organization",
                                "name": "Depanku.id",
                                "url": "https://depanku.id"
                            }
                        })
                    }}
                />
            </head>
            <body className={inter.className} suppressHydrationWarning>
                <QueryProvider>
                    <ErrorBoundary>
                        <ScrollToTop />
                        {children}
                    </ErrorBoundary>
                </QueryProvider>
            </body>
        </html>
    );
}

