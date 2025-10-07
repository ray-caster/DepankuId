'use client';

import { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { api, AIMessage, Opportunity } from '@/lib/api';
import { 
    SparklesIcon, 
    ArrowLeftIcon, 
    CheckCircleIcon,
    XMarkIcon,
    HeartIcon,
    StarIcon,
    ClockIcon,
    MapPinIcon,
    BuildingOfficeIcon,
    TagIcon,
    LinkIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Question types
type QuestionType = 'open' | 'multiple_choice' | 'rating' | 'opportunity_reaction';

interface QuestionCard {
    id: string;
    type: QuestionType;
    question: string;
    options?: string[];
    opportunity?: Opportunity;
    required: boolean;
}

interface UserProfile {
    interests: string[];
    skills: string[];
    goals: string[];
    preferredTypes: string[];
    conversationSummary: string;
    confidence: number;
}

function AIDiscoveryContent() {
    const { user, getIdToken } = useAuth();
    const router = useRouter();
    
    // State management
    const [currentQuestion, setCurrentQuestion] = useState<QuestionCard | null>(null);
    const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
    const [userProfile, setUserProfile] = useState<UserProfile>({
        interests: [],
        skills: [],
        goals: [],
        preferredTypes: [],
        conversationSummary: '',
        confidence: 0
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [recommendations, setRecommendations] = useState<Opportunity[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [conversationHistory, setConversationHistory] = useState<AIMessage[]>([]);

    // Load conversation state from localStorage
    useEffect(() => {
        const savedState = localStorage.getItem('ai-discovery-state');
        if (savedState) {
            const parsed = JSON.parse(savedState);
            setUserAnswers(parsed.answers || {});
            setUserProfile(parsed.profile || userProfile);
            setConversationHistory(parsed.history || []);
        }
    }, []);

    // Save conversation state to localStorage
    const saveState = useCallback(() => {
        const state = {
            answers: userAnswers,
            profile: userProfile,
            history: conversationHistory
        };
        localStorage.setItem('ai-discovery-state', JSON.stringify(state));
    }, [userAnswers, userProfile, conversationHistory]);

    useEffect(() => {
        saveState();
    }, [saveState]);

    // Start the discovery process
    const startDiscovery = async () => {
        setIsLoading(true);
        try {
            const response = await api.aiChat({
                message: "Start the discovery process. Ask me a question to understand my interests and goals.",
                history: conversationHistory,
            });

            if (response.success && response.message) {
                const newMessage: AIMessage = {
                    role: 'assistant',
                    content: response.message
                };
                setConversationHistory(prev => [...prev, newMessage]);
                
                // Generate first question card
                generateQuestionCard(newMessage.content);
            }
        } catch (error) {
            console.error('Error starting discovery:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Generate question card from AI response
    const generateQuestionCard = async (aiResponse: string) => {
        // Parse AI response to determine question type and content
        const questionCard: QuestionCard = {
            id: Date.now().toString(),
            type: 'open', // Default to open-ended
            question: aiResponse,
            required: true
        };

        // Check if AI mentioned specific opportunities
        if (aiResponse.includes('opportunity') || aiResponse.includes('program')) {
            // Search for relevant opportunities
            try {
                const opportunities = await api.getOpportunities();
                const relevantOpp = opportunities[Math.floor(Math.random() * Math.min(3, opportunities.length))];
                if (relevantOpp) {
                    questionCard.type = 'opportunity_reaction';
                    questionCard.opportunity = relevantOpp;
                    questionCard.question = `What do you think about this opportunity?`;
                }
            } catch (error) {
                console.error('Error fetching opportunities:', error);
            }
        }

        setCurrentQuestion(questionCard);
    };

    // Handle answer submission
    const handleAnswer = async (answer: any) => {
        if (!currentQuestion) return;

        // Save answer
        setUserAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: answer
        }));

        // Add to conversation history
        const userMessage: AIMessage = {
            role: 'user',
            content: typeof answer === 'string' ? answer : JSON.stringify(answer)
        };
        setConversationHistory(prev => [...prev, userMessage]);

        // Update user profile based on answer
        updateUserProfile(currentQuestion, answer);

        // Check if we have enough information
        const updatedProfile = { ...userProfile };
        const confidence = calculateConfidence(updatedProfile);
        
        if (confidence >= 0.99) {
            // Generate recommendations
            await generateRecommendations();
        } else {
            // Ask next question
            await askNextQuestion();
        }
    };

    // Update user profile based on answer
    const updateUserProfile = (question: QuestionCard, answer: any) => {
        setUserProfile(prev => {
            const updated = { ...prev };
            
            // Extract keywords and update interests
            if (typeof answer === 'string') {
                const keywords = extractKeywords(answer);
                updated.interests = [...new Set([...updated.interests, ...keywords])];
            }

            // Update based on opportunity reaction
            if (question.type === 'opportunity_reaction' && question.opportunity) {
                if (answer === 'interested' || answer === 'very_interested') {
                    updated.preferredTypes.push(question.opportunity.type);
                    updated.interests.push(...question.opportunity.tags);
                }
            }

            return updated;
        });
    };

    // Extract keywords from text
    const extractKeywords = (text: string): string[] => {
        const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
        return text.toLowerCase()
            .split(/\W+/)
            .filter(word => word.length > 2 && !commonWords.includes(word))
            .slice(0, 5); // Limit to 5 keywords
    };

    // Calculate confidence in user profile
    const calculateConfidence = (profile: UserProfile): number => {
        let score = 0;
        
        if (profile.interests.length >= 3) score += 0.3;
        if (profile.goals.length >= 1) score += 0.2;
        if (profile.preferredTypes.length >= 1) score += 0.2;
        if (profile.skills.length >= 2) score += 0.2;
        if (conversationHistory.length >= 5) score += 0.1;
        
        return Math.min(score, 1);
    };

    // Ask next question
    const askNextQuestion = async () => {
        setIsLoading(true);
        try {
            const response = await api.aiChat({
                message: "Ask me another question to better understand my preferences and goals.",
                history: conversationHistory,
            });

            if (response.success && response.message) {
                const newMessage: AIMessage = {
                    role: 'assistant',
                    content: response.message
                };
                setConversationHistory(prev => [...prev, newMessage]);
                generateQuestionCard(newMessage.content);
            }
        } catch (error) {
            console.error('Error asking next question:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Generate recommendations
    const generateRecommendations = async () => {
        setIsAnalyzing(true);
        try {
            const opportunities = await api.getOpportunities();
            
            // Filter opportunities based on user profile
            const filtered = opportunities.filter(opp => {
                const hasMatchingInterest = opp.tags.some(tag => 
                    userProfile.interests.some(interest => 
                        interest.toLowerCase().includes(tag.toLowerCase()) ||
                        tag.toLowerCase().includes(interest.toLowerCase())
                    )
                );
                const hasMatchingType = userProfile.preferredTypes.includes(opp.type);
                
                return hasMatchingInterest || hasMatchingType;
            });

            // Sort by relevance and take top 5
            const sorted = filtered
                .sort((a, b) => {
                    const aScore = calculateRelevanceScore(a);
                    const bScore = calculateRelevanceScore(b);
                    return bScore - aScore;
                })
                .slice(0, 5);

            setRecommendations(sorted);
            setShowResults(true);
        } catch (error) {
            console.error('Error generating recommendations:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Calculate relevance score for an opportunity
    const calculateRelevanceScore = (opportunity: Opportunity): number => {
        let score = 0;
        
        // Type matching
        if (userProfile.preferredTypes.includes(opportunity.type)) {
            score += 2;
        }
        
        // Interest matching
        const matchingInterests = opportunity.tags.filter(tag =>
            userProfile.interests.some(interest =>
                interest.toLowerCase().includes(tag.toLowerCase()) ||
                tag.toLowerCase().includes(interest.toLowerCase())
            )
        ).length;
        
        score += matchingInterests * 0.5;
        
        return score;
    };

    // Render question card
    const renderQuestionCard = () => {
        if (!currentQuestion) return null;

        return (
            <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                className="max-w-2xl mx-auto"
            >
                <div className="bg-white rounded-comfort p-8 border-2 border-neutral-300 shadow-card">
                    <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                        {currentQuestion.question}
                    </h2>

                    {currentQuestion.type === 'open' && (
                        <div className="space-y-4">
                            <textarea
                                placeholder="Share your thoughts..."
                                className="w-full p-4 border-2 border-neutral-300 rounded-soft focus:border-primary-500 focus:outline-none resize-none"
                                rows={4}
                                id="answer-input"
                            />
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => {
                                        const input = document.getElementById('answer-input') as HTMLTextAreaElement;
                                        handleAnswer(input.value);
                                    }}
                                    className="btn-primary px-8 py-3"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {currentQuestion.type === 'opportunity_reaction' && currentQuestion.opportunity && (
                        <div className="space-y-6">
                            {/* Opportunity Card */}
                            <div className="bg-neutral-50 rounded-soft p-6 border-2 border-neutral-200">
                                <h3 className="text-xl font-bold text-foreground mb-3">
                                    {currentQuestion.opportunity.title}
                                </h3>
                                <p className="text-neutral-700 mb-4 line-clamp-3">
                                    {currentQuestion.opportunity.description}
                                </p>
                                
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        currentQuestion.opportunity.type === 'research' ? 'bg-blue-100 text-blue-700' :
                                        currentQuestion.opportunity.type === 'competition' ? 'bg-amber-100 text-amber-700' :
                                        currentQuestion.opportunity.type === 'youth-program' ? 'bg-green-100 text-green-700' :
                                        'bg-purple-100 text-purple-700'
                                    }`}>
                                        {currentQuestion.opportunity.type.replace('-', ' ')}
                                    </span>
                                    {currentQuestion.opportunity.tags.slice(0, 3).map(tag => (
                                        <span key={tag} className="px-2 py-1 bg-neutral-200 text-neutral-700 rounded-full text-xs">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center gap-4 text-sm text-neutral-600">
                                    <div className="flex items-center gap-1">
                                        <BuildingOfficeIcon className="w-4 h-4" />
                                        {currentQuestion.opportunity.organization}
                                    </div>
                                    {currentQuestion.opportunity.location && (
                                        <div className="flex items-center gap-1">
                                            <MapPinIcon className="w-4 h-4" />
                                            {currentQuestion.opportunity.location}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Reaction Options */}
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { value: 'very_interested', label: 'Very Interested', icon: HeartSolidIcon, color: 'bg-red-100 text-red-700 border-red-300' },
                                    { value: 'interested', label: 'Interested', icon: HeartIcon, color: 'bg-pink-100 text-pink-700 border-pink-300' },
                                    { value: 'maybe', label: 'Maybe', icon: StarIcon, color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
                                    { value: 'not_interested', label: 'Not Interested', icon: XMarkIcon, color: 'bg-neutral-100 text-neutral-700 border-neutral-300' }
                                ].map(option => {
                                    const Icon = option.icon;
                                    return (
                                        <button
                                            key={option.value}
                                            onClick={() => handleAnswer(option.value)}
                                            className={`p-4 rounded-soft border-2 ${option.color} hover:scale-105 transition-all flex flex-col items-center gap-2`}
                                        >
                                            <Icon className="w-6 h-6" />
                                            <span className="font-medium">{option.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        );
    };

    // Render results
    const renderResults = () => {
        return (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-4">
                        Your Personalized Recommendations
                    </h1>
                    <p className="text-neutral-600 text-lg">
                        Based on your interests and preferences, here are opportunities we think you'll love:
                    </p>
                </div>

                <div className="grid gap-6">
                    {recommendations.map((opportunity, index) => (
                        <motion.div
                            key={opportunity.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-comfort p-6 border-2 border-neutral-300 shadow-card hover:shadow-card-hover transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-foreground mb-2">
                                        {opportunity.title}
                                    </h3>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            opportunity.type === 'research' ? 'bg-blue-100 text-blue-700' :
                                            opportunity.type === 'competition' ? 'bg-amber-100 text-amber-700' :
                                            opportunity.type === 'youth-program' ? 'bg-green-100 text-green-700' :
                                            'bg-purple-100 text-purple-700'
                                        }`}>
                                            {opportunity.type.replace('-', ' ')}
                                        </span>
                                        {opportunity.deadline && opportunity.deadline !== 'indefinite' && !opportunity.has_indefinite_deadline && (
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                                                Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-soft transition-colors">
                                        <HeartIcon className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-soft transition-colors">
                                        <StarIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-neutral-700 mb-4 line-clamp-3">
                                {opportunity.description}
                            </p>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-neutral-600">
                                    <BuildingOfficeIcon className="w-4 h-4" />
                                    {opportunity.organization}
                                </div>
                                {opportunity.location && (
                                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                                        <MapPinIcon className="w-4 h-4" />
                                        {opportunity.location}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {opportunity.tags.slice(0, 5).map(tag => (
                                    <span key={tag} className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs flex items-center gap-1">
                                        <TagIcon className="w-3 h-3" />
                                        {tag}
                                    </span>
                                ))}
                                {opportunity.tags.length > 5 && (
                                    <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs">
                                        +{opportunity.tags.length - 5} more
                                    </span>
                                )}
                            </div>

                            {opportunity.url && (
                                <a
                                    href={opportunity.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary w-full flex items-center justify-center gap-2"
                                >
                                    <LinkIcon className="w-4 h-4" />
                                    Visit Website
                                </a>
                            )}
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-8">
                    <Link href="/search" className="btn-secondary">
                        Explore More Opportunities
                    </Link>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-background-light">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b-2 border-neutral-300 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-neutral-100 rounded-soft transition-colors"
                        >
                            <ArrowLeftIcon className="w-6 h-6 text-neutral-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">AI Discovery</h1>
                            <p className="text-sm text-neutral-600">Find your perfect opportunity</p>
                        </div>
                    </div>
                    
                    {user && (
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Signed in as {user.displayName}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <main className="px-4 py-8">
                <AnimatePresence mode="wait">
                    {!currentQuestion && !showResults && !isLoading && (
                        <motion.div
                            key="start"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            className="max-w-2xl mx-auto text-center"
                        >
                            <div className="bg-white rounded-comfort p-12 border-2 border-neutral-300 shadow-card">
                                <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <SparklesIcon className="w-10 h-10 text-white" />
                                </div>
                                
                                <h1 className="text-3xl font-bold text-foreground mb-4">
                                    Can't Decide? Let us pick!
                                </h1>
                                
                                <p className="text-neutral-600 text-lg mb-8 leading-relaxed">
                                    Our AI will ask you thoughtful questions to understand your interests, 
                                    goals, and preferences. Then we'll recommend opportunities that are 
                                    perfect for you.
                                </p>

                                <div className="space-y-4 mb-8 text-left">
                                    <div className="flex items-center gap-3">
                                        <CheckCircleIcon className="w-6 h-6 text-green-500" />
                                        <span className="text-neutral-700">Personalized questions based on your responses</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircleIcon className="w-6 h-6 text-green-500" />
                                        <span className="text-neutral-700">Access to our full database of opportunities</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircleIcon className="w-6 h-6 text-green-500" />
                                        <span className="text-neutral-700">Curated recommendations just for you</span>
                                    </div>
                                </div>

                                <button
                                    onClick={startDiscovery}
                                    className="btn-primary px-8 py-4 text-lg"
                                >
                                    Start Discovery
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {isLoading && !showResults && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="max-w-2xl mx-auto text-center"
                        >
                            <div className="bg-white rounded-comfort p-12 border-2 border-neutral-300 shadow-card">
                                <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                                <h2 className="text-xl font-semibold text-foreground mb-2">Analyzing your preferences...</h2>
                                <p className="text-neutral-600">This may take a moment</p>
                            </div>
                        </motion.div>
                    )}

                    {isAnalyzing && (
                        <motion.div
                            key="analyzing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="max-w-2xl mx-auto text-center"
                        >
                            <div className="bg-white rounded-comfort p-12 border-2 border-neutral-300 shadow-card">
                                <div className="w-16 h-16 border-4 border-accent-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                                <h2 className="text-xl font-semibold text-foreground mb-2">Finding your perfect matches...</h2>
                                <p className="text-neutral-600">Searching through our database</p>
                            </div>
                        </motion.div>
                    )}

                    {currentQuestion && !showResults && renderQuestionCard()}
                    {showResults && renderResults()}
                </AnimatePresence>
            </main>
        </div>
    );
}

export default function AIDiscoveryPage() {
    return (
        <AuthProvider>
            <AIDiscoveryContent />
        </AuthProvider>
    );
}