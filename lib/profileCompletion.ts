export interface ProfileCompletionData {
    hasDisplayName: boolean;
    hasBio: boolean;
    hasLocation: boolean;
    hasWebsite: boolean;
    hasPhoto: boolean;
    totalScore: number;
    percentage: number;
    missingFields: string[];
}

export function calculateProfileCompletion(user: any, profileData: any): ProfileCompletionData {
    const hasDisplayName = !!user?.displayName;
    const hasBio = !!profileData?.bio && profileData.bio.trim().length > 0;
    const hasLocation = !!profileData?.location && profileData.location.trim().length > 0;
    const hasWebsite = !!profileData?.website && profileData.website.trim().length > 0;
    const hasPhoto = !!user?.photoURL;

    const fields = [
        { name: 'Display Name', completed: hasDisplayName },
        { name: 'Bio', completed: hasBio },
        { name: 'Location', completed: hasLocation },
        { name: 'Website', completed: hasWebsite },
        { name: 'Profile Photo', completed: hasPhoto },
    ];

    const completedFields = fields.filter(field => field.completed).length;
    const totalFields = fields.length;
    const percentage = Math.round((completedFields / totalFields) * 100);
    const missingFields = fields.filter(field => !field.completed).map(field => field.name);

    return {
        hasDisplayName,
        hasBio,
        hasLocation,
        hasWebsite,
        hasPhoto,
        totalScore: completedFields,
        percentage,
        missingFields,
    };
}

export function getCompletionMessage(completion: ProfileCompletionData): string {
    if (completion.percentage === 100) {
        return 'Your profile is complete! 🎉';
    } else if (completion.percentage >= 80) {
        return 'Your profile is almost complete!';
    } else if (completion.percentage >= 60) {
        return 'Your profile is looking good!';
    } else if (completion.percentage >= 40) {
        return 'Your profile needs some work.';
    } else {
        return 'Your profile is just getting started.';
    }
}

export function getCompletionColor(percentage: number): string {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
}
