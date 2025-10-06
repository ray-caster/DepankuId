import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({
    subsets: ["latin"],
    variable: '--font-inter',
    display: 'swap',
});

export const metadata: Metadata = {
    title: "Depanku.id - Find Research Programs and Youth Opportunities in Indonesia",
    description: "Free platform for Indonesian students to discover research programs, competitions, and youth opportunities. Search 500+ verified opportunities.",
    keywords: ["research programs Indonesia", "youth opportunities", "student competitions", "academic programs", "scholarships Indonesia", "student research", "youth development"],
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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={inter.variable}>
            <head>
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
                <ScrollToTop />
                {children}
            </body>
        </html>
    );
}

