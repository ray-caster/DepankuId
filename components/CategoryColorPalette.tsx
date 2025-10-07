'use client';

import { categoryColors, categoryLabels, OpportunityType } from '@/lib/categoryColors';

/**
 * Category Color Palette Demo Component
 * 
 * This component displays all available category colors for reference
 * and can be used during development to visualize the color system.
 */
export default function CategoryColorPalette() {
    const categories = Object.keys(categoryColors) as OpportunityType[];

    return (
        <div className="p-8 bg-background min-h-screen">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-foreground mb-8">Category Color Palette</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => {
                        const colors = categoryColors[category];
                        const label = categoryLabels[category];
                        
                        return (
                            <div key={category} className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground">{label}</h3>
                                
                                {/* Badge Example */}
                                <div className="space-y-2">
                                    <p className="text-sm text-foreground-light">Badge Style:</p>
                                    <span className={`${colors.background} ${colors.text} ${colors.border} border rounded-soft px-3 py-1 text-xs font-medium`}>
                                        {label}
                                    </span>
                                </div>
                                
                                {/* Card Example */}
                                <div className="space-y-2">
                                    <p className="text-sm text-foreground-light">Card Style:</p>
                                    <div className={`${colors.background} ${colors.text} ${colors.border} border rounded-comfort p-4`}>
                                        <h4 className="font-medium mb-2">Sample Opportunity</h4>
                                        <p className="text-sm opacity-80">This is how {label.toLowerCase()} opportunities will appear.</p>
                                    </div>
                                </div>
                                
                                {/* Color Values */}
                                <div className="space-y-1 text-xs text-foreground-lighter">
                                    <p>Background: {colors.background}</p>
                                    <p>Text: {colors.text}</p>
                                    <p>Border: {colors.border}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                <div className="mt-12 p-6 bg-background-light rounded-comfort">
                    <h2 className="text-xl font-semibold text-foreground mb-4">Color System Explanation</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                        <div>
                            <h3 className="font-semibold text-primary-800 mb-2">Primary (Teal-blue)</h3>
                            <p className="text-foreground-light">Research, Competition, Fellowship, Conference</p>
                            <p className="text-foreground-lighter mt-1">Academic and professional opportunities</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-secondary-800 mb-2">Secondary (Sage green)</h3>
                            <p className="text-foreground-light">Youth Program, Scholarship, Volunteer, Workshop</p>
                            <p className="text-foreground-lighter mt-1">Educational and community-focused opportunities</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-accent-800 mb-2">Accent (Warm amber)</h3>
                            <p className="text-foreground-light">Community, Internship, Hackathon, Summer Program</p>
                            <p className="text-foreground-lighter mt-1">Social and hands-on opportunities</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
