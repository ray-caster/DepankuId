'use client';

import Link from 'next/link';

interface FooterProps {
    variant?: 'full' | 'minimal';
}

export default function Footer({ variant = 'full' }: FooterProps) {
    if (variant === 'minimal') {
        return (
            <footer className="mt-16 border-t border-neutral-200 py-8 bg-background-light">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-foreground-lighter">
                            Depanku.id © 2025
                        </div>
                        <div className="flex gap-6 text-sm">
                            <Link href="/search" className="text-foreground-light hover:text-primary-600 transition-colors">
                                Browse
                            </Link>
                            <Link href="/opportunities" className="text-foreground-light hover:text-primary-600 transition-colors">
                                Share Opportunity
                            </Link>
                            <Link href="/about" className="text-foreground-light hover:text-primary-600 transition-colors">
                                About
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }

    return (
        <footer
            className="mt-24 border-t-2 border-neutral-200 py-12 sm:py-16 bg-background-light"
            style={{
                boxShadow: 'inset 0 2px 0 0 oklch(100% 0 0 / 0.1)'
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="md:col-span-2">
                        <h3 className="text-2xl font-bold text-foreground mb-4">Depanku.id</h3>
                        <p className="text-base text-foreground-light leading-relaxed max-w-md">
                            Find research programs, competitions, and youth opportunities across Indonesia.
                            Free platform for students and young professionals.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-foreground mb-4">Explore</h4>
                        <ul className="space-y-2">
                            <li><Link href="/search" className="text-foreground-light hover:text-primary-600 transition-colors">Browse Opportunities</Link></li>
                            <li><Link href="/opportunities" className="text-foreground-light hover:text-primary-600 transition-colors">Share Opportunity</Link></li>
                            <li><Link href="/features" className="text-foreground-light hover:text-primary-600 transition-colors">Features</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-foreground mb-4">Support</h4>
                        <ul className="space-y-2">
                            <li><Link href="/about" className="text-foreground-light hover:text-primary-600 transition-colors">About Us</Link></li>
                            <li><Link href="#" className="text-foreground-light hover:text-primary-600 transition-colors">Contact</Link></li>
                            <li><Link href="#" className="text-foreground-light hover:text-primary-600 transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-neutral-200 pt-8 text-center">
                    <p className="text-sm text-foreground-lighter font-medium">
                        Built to help you find your path • Depanku.id © 2025
                    </p>
                </div>
            </div>
        </footer>
    );
}
