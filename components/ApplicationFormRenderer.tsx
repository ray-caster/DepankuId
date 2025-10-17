'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    CheckIcon,
    DocumentTextIcon,
    PhotoIcon,
    VideoCameraIcon
} from '@heroicons/react/24/outline';
import { ApplicationForm, FormQuestion, FormPage } from './ApplicationFormBuilder';

interface ApplicationFormRendererProps {
    form: ApplicationForm;
    onSubmit: (responses: ApplicationResponse[]) => void;
    onCancel?: () => void;
    isSubmitting?: boolean;
    existingResponses?: ApplicationResponse[];
}

export interface ApplicationResponse {
    questionId: string;
    questionTitle: string;
    questionType: string;
    answer: string | string[] | File[];
    required: boolean;
}

export default function ApplicationFormRenderer({
    form,
    onSubmit,
    onCancel,
    isSubmitting = false,
    existingResponses = []
}: ApplicationFormRendererProps) {
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [responses, setResponses] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    const currentPage = form.pages[currentPageIndex];
    const isLastPage = currentPageIndex === form.pages.length - 1;
    const isFirstPage = currentPageIndex === 0;

    // Initialize responses with existing data if available
    useEffect(() => {
        if (existingResponses && existingResponses.length > 0) {
            const initialResponses: Record<string, any> = {};
            existingResponses.forEach(response => {
                initialResponses[response.questionId] = response.answer;
            });
            setResponses(initialResponses);
        }
    }, [existingResponses]);

    const updateResponse = useCallback((questionId: string, answer: any) => {
        setResponses(prev => ({
            ...prev,
            [questionId]: answer
        }));

        // Clear error when user starts answering
        if (errors[questionId]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[questionId];
                return newErrors;
            });
        }
    }, [errors]);

    const validatePage = useCallback((page: FormPage) => {
        const pageErrors: Record<string, string> = {};

        page.questions.forEach(question => {
            if (question.required) {
                const response = responses[question.id];
                if (!response || (Array.isArray(response) && response.length === 0) ||
                    (typeof response === 'string' && response.trim() === '')) {
                    pageErrors[question.id] = 'This field is required';
                }
            }
        });

        setErrors(prev => ({ ...prev, ...pageErrors }));
        return Object.keys(pageErrors).length === 0;
    }, [responses]);

    const handleNext = useCallback(() => {
        if (validatePage(currentPage)) {
            if (isLastPage) {
                // Submit form
                const applicationResponses: ApplicationResponse[] = form.pages.flatMap(page =>
                    page.questions.map(question => ({
                        questionId: question.id,
                        questionTitle: question.title,
                        questionType: question.type,
                        answer: responses[question.id] || '',
                        required: question.required
                    }))
                );
                onSubmit(applicationResponses);
            } else {
                setCurrentPageIndex(prev => prev + 1);
            }
        }
    }, [currentPage, validatePage, isLastPage, form.pages, responses, onSubmit]);

    const handlePrevious = useCallback(() => {
        if (!isFirstPage) {
            setCurrentPageIndex(prev => prev - 1);
        }
    }, [isFirstPage]);

    const handleFileUpload = useCallback((questionId: string, files: FileList | null) => {
        if (files) {
            const fileArray = Array.from(files);
            updateResponse(questionId, fileArray);
        }
    }, [updateResponse]);

    // Calculate progress based on page completion
    const progress = form.pages.length > 1 ? ((currentPageIndex + 1) / form.pages.length) * 100 : 100;

    return (
        <div className="max-w-2xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    {form.title}
                </h1>
                {form.description && (
                    <p className="text-neutral-600">{form.description}</p>
                )}

                {/* Progress Bar */}
                {form.settings.showProgressBar && (
                    <div className="mt-4">
                        <div className="flex items-center justify-between text-sm text-neutral-600 mb-2">
                            <span>Page {currentPageIndex + 1} of {form.pages.length}</span>
                            <span>{Math.round(progress)}% Complete</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                            <div
                                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Current Page */}
            <motion.div
                key={currentPageIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-lg border border-neutral-200 p-6 mb-6"
            >
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                        {currentPage.title}
                    </h2>
                    {currentPage.description && (
                        <p className="text-neutral-600">{currentPage.description}</p>
                    )}
                </div>

                {/* Questions */}
                <div className="space-y-6">
                    {currentPage.questions.map((question) => (
                        <QuestionRenderer
                            key={question.id}
                            question={question}
                            value={responses[question.id]}
                            onChange={(value) => updateResponse(question.id, value)}
                            error={errors[question.id]}
                            onFileUpload={handleFileUpload}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <div>
                    {onCancel && (
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {!isFirstPage && (
                        <button
                            onClick={handlePrevious}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <ChevronLeftIcon className="w-4 h-4" />
                            Previous
                        </button>
                    )}

                    <button
                        onClick={handleNext}
                        disabled={isSubmitting}
                        className="btn-primary flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Submitting...
                            </>
                        ) : isLastPage ? (
                            <>
                                <CheckIcon className="w-4 h-4" />
                                Submit Application
                            </>
                        ) : (
                            <>
                                Next
                                <ChevronRightIcon className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

interface QuestionRendererProps {
    question: FormQuestion;
    value: any;
    onChange: (value: any) => void;
    error?: string;
    onFileUpload: (questionId: string, files: FileList | null) => void;
}

function QuestionRenderer({ question, value, onChange, error, onFileUpload }: QuestionRendererProps) {
    const handleOptionChange = useCallback((optionValue: string, checked: boolean) => {
        if (question.type === 'multiple_choice') {
            onChange(optionValue);
        } else if (question.type === 'checkbox') {
            const currentValues = Array.isArray(value) ? value : [];
            if (checked) {
                onChange([...currentValues, optionValue]);
            } else {
                onChange(currentValues.filter((v: string) => v !== optionValue));
            }
        }
    }, [question.type, value, onChange]);

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
                {question.title}
                {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {question.description && (
                <p className="text-sm text-neutral-600">{question.description}</p>
            )}

            <div className="mt-2">
                {question.type === 'text' && (
                    <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={question.placeholder || 'Enter your answer...'}
                        maxLength={question.maxLength}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${error ? 'border-red-300' : 'border-neutral-300'
                            }`}
                    />
                )}

                {question.type === 'textarea' && (
                    <textarea
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={question.placeholder || 'Enter your answer...'}
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none ${error ? 'border-red-300' : 'border-neutral-300'
                            }`}
                    />
                )}

                {question.type === 'multiple_choice' && (
                    <div className="space-y-2">
                        {question.options?.map((option, index) => (
                            <label key={index} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name={question.id}
                                    value={option}
                                    checked={value === option}
                                    onChange={(e) => onChange(e.target.value)}
                                    className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                                />
                                <span className="text-sm text-neutral-700">{option}</span>
                            </label>
                        ))}
                    </div>
                )}

                {question.type === 'checkbox' && (
                    <div className="space-y-2">
                        {question.options?.map((option, index) => (
                            <label key={index} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={Array.isArray(value) && value.includes(option)}
                                    onChange={(e) => handleOptionChange(option, e.target.checked)}
                                    className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                                />
                                <span className="text-sm text-neutral-700">{option}</span>
                            </label>
                        ))}
                    </div>
                )}

                {question.type === 'dropdown' && (
                    <select
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${error ? 'border-red-300' : 'border-neutral-300'
                            }`}
                    >
                        <option value="">Select an option</option>
                        {question.options?.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                )}

                {(question.type === 'file' || question.type === 'image' || question.type === 'video') && (
                    <div className="border-2 border-dashed border-neutral-300 rounded-md p-6 text-center hover:border-neutral-400 transition-colors">
                        <div className="text-neutral-500 mb-2">
                            {question.type === 'file' && <DocumentTextIcon className="w-8 h-8 mx-auto" />}
                            {question.type === 'image' && <PhotoIcon className="w-8 h-8 mx-auto" />}
                            {question.type === 'video' && <VideoCameraIcon className="w-8 h-8 mx-auto" />}
                        </div>
                        <p className="text-sm text-neutral-600 mb-2">
                            {question.type === 'file' && 'Upload your file'}
                            {question.type === 'image' && 'Upload your image'}
                            {question.type === 'video' && 'Upload your video'}
                        </p>
                        <input
                            type="file"
                            accept={question.type === 'file' ?
                                question.fileTypes?.map(type => `.${type}`).join(',') :
                                question.type === 'image' ? 'image/*' : 'video/*'
                            }
                            onChange={(e) => onFileUpload(question.id, e.target.files)}
                            className="hidden"
                            id={`file-${question.id}`}
                        />
                        <label
                            htmlFor={`file-${question.id}`}
                            className="btn-secondary cursor-pointer"
                        >
                            Choose File
                        </label>
                        {value && Array.isArray(value) && value.length > 0 && (
                            <div className="mt-2 text-sm text-neutral-600">
                                {value.map((file: File, index: number) => (
                                    <div key={index}>{file.name}</div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {error && (
                <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
        </div>
    );
}
