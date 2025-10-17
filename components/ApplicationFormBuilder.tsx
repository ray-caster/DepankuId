'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PlusIcon,
    TrashIcon,
    PencilIcon,
    EyeIcon,
    DocumentTextIcon,
    PhotoIcon,
    VideoCameraIcon,
    CheckIcon,
    XMarkIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

export interface FormQuestion {
    id: string;
    type: 'text' | 'textarea' | 'multiple_choice' | 'checkbox' | 'dropdown' | 'file' | 'video' | 'image';
    title: string;
    description?: string;
    required: boolean;
    options?: string[];
    placeholder?: string;
    maxLength?: number;
    fileTypes?: string[];
    maxFileSize?: number;
}

export interface FormPage {
    id: string;
    title: string;
    description?: string;
    questions: FormQuestion[];
}

export interface ApplicationForm {
    id: string;
    title: string;
    description?: string;
    pages: FormPage[];
    settings: {
        allowMultipleSubmissions: boolean;
        collectEmail: boolean;
        showProgressBar: boolean;
    };
}

interface ApplicationFormBuilderProps {
    form: ApplicationForm;
    onChange: (form: ApplicationForm) => void;
    onSave?: (form: ApplicationForm) => void;
    onPreview?: (form: ApplicationForm) => void;
    isEditing?: boolean;
}

const QUESTION_TYPES = [
    { value: 'text', label: 'Short Answer', icon: DocumentTextIcon },
    { value: 'textarea', label: 'Paragraph', icon: DocumentTextIcon },
    { value: 'multiple_choice', label: 'Multiple Choice', icon: CheckIcon },
    { value: 'checkbox', label: 'Checkboxes', icon: CheckIcon },
    { value: 'dropdown', label: 'Dropdown', icon: CheckIcon },
    { value: 'file', label: 'File Upload', icon: DocumentTextIcon },
    { value: 'image', label: 'Image Upload', icon: PhotoIcon },
    { value: 'video', label: 'Video Upload', icon: VideoCameraIcon },
];

export default function ApplicationFormBuilder({
    form,
    onChange,
    onSave,
    onPreview,
    isEditing = false
}: ApplicationFormBuilderProps) {
    const [activePageId, setActivePageId] = useState(form.pages[0]?.id || '');
    const [editingQuestion, setEditingQuestion] = useState<string | null>(null);

    const addPage = useCallback(() => {
        const newPage: FormPage = {
            id: `page_${Date.now()}`,
            title: `Page ${form.pages.length + 1}`,
            description: '',
            questions: []
        };

        onChange({
            ...form,
            pages: [...form.pages, newPage]
        });
        setActivePageId(newPage.id);
    }, [form, onChange]);

    const updatePage = useCallback((pageId: string, updates: Partial<FormPage>) => {
        onChange({
            ...form,
            pages: form.pages.map(page =>
                page.id === pageId ? { ...page, ...updates } : page
            )
        });
    }, [form, onChange]);

    const deletePage = useCallback((pageId: string) => {
        if (form.pages.length <= 1) return;

        const newPages = form.pages.filter(page => page.id !== pageId);
        onChange({
            ...form,
            pages: newPages
        });

        if (activePageId === pageId) {
            setActivePageId(newPages[0]?.id || '');
        }
    }, [form, onChange, activePageId]);

    const addQuestion = useCallback((pageId: string, type: FormQuestion['type']) => {
        const newQuestion: FormQuestion = {
            id: `question_${Date.now()}`,
            type,
            title: '',
            required: false,
            options: type === 'multiple_choice' || type === 'checkbox' || type === 'dropdown' ? ['Option 1'] : undefined,
            placeholder: type === 'text' ? 'Enter your answer...' : undefined,
            maxLength: type === 'text' ? 100 : undefined,
            fileTypes: type === 'file' ? ['pdf', 'doc', 'docx'] : undefined,
            maxFileSize: type === 'file' ? 5 : undefined,
        };

        updatePage(pageId, {
            questions: [...(form.pages.find(p => p.id === pageId)?.questions || []), newQuestion]
        });
        setEditingQuestion(newQuestion.id);
    }, [form.pages, updatePage]);

    const updateQuestion = useCallback((pageId: string, questionId: string, updates: Partial<FormQuestion>) => {
        updatePage(pageId, {
            questions: form.pages
                .find(p => p.id === pageId)
                ?.questions.map(q =>
                    q.id === questionId ? { ...q, ...updates } : q
                ) || []
        });
    }, [form.pages, updatePage]);

    const deleteQuestion = useCallback((pageId: string, questionId: string) => {
        updatePage(pageId, {
            questions: form.pages
                .find(p => p.id === pageId)
                ?.questions.filter(q => q.id !== questionId) || []
        });
    }, [form.pages, updatePage]);

    const duplicateQuestion = useCallback((pageId: string, question: FormQuestion) => {
        const newQuestion: FormQuestion = {
            ...question,
            id: `question_${Date.now()}`,
            title: `${question.title} (Copy)`
        };

        updatePage(pageId, {
            questions: [...(form.pages.find(p => p.id === pageId)?.questions || []), newQuestion]
        });
    }, [form.pages, updatePage]);

    const moveQuestion = useCallback((pageId: string, questionId: string, direction: 'up' | 'down') => {
        const page = form.pages.find(p => p.id === pageId);
        if (!page) return;

        const questions = [...page.questions];
        const index = questions.findIndex(q => q.id === questionId);

        if (direction === 'up' && index > 0) {
            [questions[index], questions[index - 1]] = [questions[index - 1], questions[index]];
        } else if (direction === 'down' && index < questions.length - 1) {
            [questions[index], questions[index + 1]] = [questions[index + 1], questions[index]];
        }

        updatePage(pageId, { questions });
    }, [form.pages, updatePage]);

    const activePage = form.pages.find(p => p.id === activePageId);

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold text-foreground">
                        {isEditing ? 'Edit Application Form' : 'Create Application Form'}
                    </h1>
                    <div className="flex gap-2">
                        {onPreview && (
                            <button
                                onClick={() => onPreview(form)}
                                className="btn-secondary flex items-center gap-2"
                            >
                                <EyeIcon className="w-4 h-4" />
                                Preview
                            </button>
                        )}
                        {onSave && (
                            <button
                                onClick={() => onSave(form)}
                                className="btn-primary flex items-center gap-2"
                            >
                                <CheckIcon className="w-4 h-4" />
                                Save Form
                            </button>
                        )}
                    </div>
                </div>

                {/* Form Settings */}
                <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Form Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Form Title
                            </label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => onChange({ ...form, title: e.target.value })}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Enter form title"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Form Description
                            </label>
                            <input
                                type="text"
                                value={form.description || ''}
                                onChange={(e) => onChange({ ...form, description: e.target.value })}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Enter form description"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Pages Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg border border-neutral-200 p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-foreground">Pages</h3>
                            <button
                                onClick={addPage}
                                className="p-2 text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                                title="Add Page"
                            >
                                <PlusIcon className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-2">
                            {form.pages.map((page, index) => (
                                <div
                                    key={page.id}
                                    className={`p-3 rounded-md cursor-pointer transition-colors ${activePageId === page.id
                                        ? 'bg-primary-50 border-primary-200 border'
                                        : 'hover:bg-neutral-50'
                                        }`}
                                    onClick={() => setActivePageId(page.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">
                                                {page.title}
                                            </p>
                                            <p className="text-xs text-neutral-500">
                                                {page.questions.length} questions
                                            </p>
                                        </div>
                                        {form.pages.length > 1 && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deletePage(page.id);
                                                }}
                                                className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <TrashIcon className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Form Builder */}
                <div className="lg:col-span-3">
                    {activePage && (
                        <div className="bg-white rounded-lg border border-neutral-200 p-6">
                            {/* Page Header */}
                            <div className="mb-6">
                                <input
                                    type="text"
                                    value={activePage.title}
                                    onChange={(e) => updatePage(activePage.id, { title: e.target.value })}
                                    className="text-xl font-semibold text-foreground bg-transparent border-none outline-none w-full"
                                    placeholder="Page Title"
                                />
                                <input
                                    type="text"
                                    value={activePage.description || ''}
                                    onChange={(e) => updatePage(activePage.id, { description: e.target.value })}
                                    className="text-sm text-neutral-600 bg-transparent border-none outline-none w-full mt-2"
                                    placeholder="Page Description (optional)"
                                />
                            </div>

                            {/* Questions */}
                            <div className="space-y-4">
                                {activePage.questions.map((question, index) => (
                                    <QuestionEditor
                                        key={question.id}
                                        question={question}
                                        isEditing={editingQuestion === question.id}
                                        onEdit={() => setEditingQuestion(question.id)}
                                        onSave={() => setEditingQuestion(null)}
                                        onUpdate={(updates) => updateQuestion(activePage.id, question.id, updates)}
                                        onDelete={() => deleteQuestion(activePage.id, question.id)}
                                        onDuplicate={() => duplicateQuestion(activePage.id, question)}
                                        onMove={(direction) => moveQuestion(activePage.id, question.id, direction)}
                                        canMoveUp={index > 0}
                                        canMoveDown={index < activePage.questions.length - 1}
                                    />
                                ))}
                            </div>

                            {/* Add Question Button */}
                            <div className="mt-6 pt-6 border-t border-neutral-200">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {QUESTION_TYPES.map((type) => (
                                        <button
                                            key={type.value}
                                            onClick={() => addQuestion(activePage.id, type.value as FormQuestion['type'])}
                                            className="flex items-center gap-2 p-3 text-sm text-neutral-700 hover:bg-neutral-50 rounded-md border border-neutral-200 transition-colors"
                                        >
                                            <type.icon className="w-4 h-4" />
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

interface QuestionEditorProps {
    question: FormQuestion;
    isEditing: boolean;
    onEdit: () => void;
    onSave: () => void;
    onUpdate: (updates: Partial<FormQuestion>) => void;
    onDelete: () => void;
    onDuplicate: () => void;
    onMove: (direction: 'up' | 'down') => void;
    canMoveUp: boolean;
    canMoveDown: boolean;
}

function QuestionEditor({
    question,
    isEditing,
    onEdit,
    onSave,
    onUpdate,
    onDelete,
    onDuplicate,
    onMove,
    canMoveUp,
    canMoveDown
}: QuestionEditorProps) {
    const [tempTitle, setTempTitle] = useState(question.title);
    const [tempDescription, setTempDescription] = useState(question.description || '');

    const handleSave = () => {
        onUpdate({
            title: tempTitle,
            description: tempDescription
        });
        onSave();
    };

    const handleCancel = () => {
        setTempTitle(question.title);
        setTempDescription(question.description || '');
        onSave();
    };

    const addOption = () => {
        onUpdate({
            options: [...(question.options || []), `Option ${(question.options?.length || 0) + 1}`]
        });
    };

    const updateOption = (index: number, value: string) => {
        const newOptions = [...(question.options || [])];
        newOptions[index] = value;
        onUpdate({ options: newOptions });
    };

    const removeOption = (index: number) => {
        const newOptions = question.options?.filter((_, i) => i !== index) || [];
        onUpdate({ options: newOptions });
    };

    return (
        <div className="border border-neutral-200 rounded-lg p-4 hover:border-neutral-300 transition-colors">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    {isEditing ? (
                        <div className="space-y-3">
                            <input
                                type="text"
                                value={tempTitle}
                                onChange={(e) => setTempTitle(e.target.value)}
                                className="w-full text-lg font-medium text-foreground bg-transparent border border-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Question title"
                                autoFocus
                            />
                            <input
                                type="text"
                                value={tempDescription}
                                onChange={(e) => setTempDescription(e.target.value)}
                                className="w-full text-sm text-neutral-600 bg-transparent border border-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Question description (optional)"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSave}
                                    className="px-3 py-1 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-3 py-1 bg-neutral-200 text-neutral-700 text-sm rounded-md hover:bg-neutral-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h4 className="text-lg font-medium text-foreground">
                                {question.title || 'Untitled Question'}
                            </h4>
                            {question.description && (
                                <p className="text-sm text-neutral-600 mt-1">
                                    {question.description}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1 ml-4">
                    <button
                        onClick={() => onMove('up')}
                        disabled={!canMoveUp}
                        className="p-1 text-neutral-500 hover:text-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Move up"
                    >
                        <ArrowUpIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onMove('down')}
                        disabled={!canMoveDown}
                        className="p-1 text-neutral-500 hover:text-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Move down"
                    >
                        <ArrowDownIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onDuplicate}
                        className="p-1 text-neutral-500 hover:text-neutral-700"
                        title="Duplicate"
                    >
                        <DocumentDuplicateIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onEdit}
                        className="p-1 text-neutral-500 hover:text-neutral-700"
                        title="Edit"
                    >
                        <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-1 text-red-500 hover:text-red-700"
                        title="Delete"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Question Preview */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                        {question.title || 'Untitled Question'}
                    </span>
                    {question.required && (
                        <span className="text-red-500 text-sm">*</span>
                    )}
                </div>

                {/* Question Type Specific Preview */}
                {question.type === 'text' && (
                    <input
                        type="text"
                        placeholder={question.placeholder || 'Enter your answer...'}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        disabled
                    />
                )}

                {question.type === 'textarea' && (
                    <textarea
                        placeholder={question.placeholder || 'Enter your answer...'}
                        rows={3}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                        disabled
                    />
                )}

                {(question.type === 'multiple_choice' || question.type === 'checkbox') && (
                    <div className="space-y-2">
                        {question.options?.map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type={question.type === 'multiple_choice' ? 'radio' : 'checkbox'}
                                    disabled
                                    className="w-4 h-4"
                                />
                                <span className="text-sm text-neutral-700">{option}</span>
                            </div>
                        ))}
                        <button
                            onClick={addOption}
                            className="text-sm text-primary-600 hover:text-primary-700"
                        >
                            + Add option
                        </button>
                    </div>
                )}

                {question.type === 'dropdown' && (
                    <select
                        disabled
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option>Select an option</option>
                        {question.options?.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                )}

                {(question.type === 'file' || question.type === 'image' || question.type === 'video') && (
                    <div className="border-2 border-dashed border-neutral-300 rounded-md p-6 text-center">
                        <div className="text-neutral-500">
                            {question.type === 'file' && <DocumentTextIcon className="w-8 h-8 mx-auto mb-2" />}
                            {question.type === 'image' && <PhotoIcon className="w-8 h-8 mx-auto mb-2" />}
                            {question.type === 'video' && <VideoCameraIcon className="w-8 h-8 mx-auto mb-2" />}
                            <p className="text-sm">
                                {question.type === 'file' && 'Upload file'}
                                {question.type === 'image' && 'Upload image'}
                                {question.type === 'video' && 'Upload video'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Question Settings */}
                <div className="flex items-center gap-4 pt-2 border-t border-neutral-100">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={question.required}
                            onChange={(e) => onUpdate({ required: e.target.checked })}
                            className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-neutral-700">Required</span>
                    </label>
                </div>
            </div>
        </div>
    );
}
