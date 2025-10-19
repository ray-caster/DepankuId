'use client';

import { useState } from 'react';

interface ApplicationForm {
    id: string;
    title: string;
    description: string;
    pages: Array<{
        id: string;
        title: string;
        description: string;
        questions: Array<{
            id: string;
            title: string;
            description: string;
            type: string;
            required: boolean;
            options?: string[];
        }>;
    }>;
    settings: {
        allowMultipleSubmissions: boolean;
        collectEmail: boolean;
        showProgressBar: boolean;
    };
}

interface ApplicationFormTemplatesProps {
    onSelectTemplate: (template: ApplicationForm) => void;
}

const templates: ApplicationForm[] = [
    {
        id: 'research_template',
        title: 'Research Application',
        description: 'Template for research opportunities',
        pages: [
            {
                id: 'page_1',
                title: 'Personal Information',
                description: 'Basic information about the applicant',
                questions: [
                    {
                        id: 'question_1',
                        title: 'Full Name',
                        description: 'Enter your full legal name',
                        type: 'text',
                        required: true
                    },
                    {
                        id: 'question_2',
                        title: 'Email Address',
                        description: 'Your primary email address',
                        type: 'email',
                        required: true
                    },
                    {
                        id: 'question_3',
                        title: 'Phone Number',
                        description: 'Best contact number',
                        type: 'text',
                        required: false
                    },
                    {
                        id: 'question_4',
                        title: 'Current Institution',
                        description: 'University, college, or organization you are currently affiliated with',
                        type: 'text',
                        required: true
                    }
                ]
            },
            {
                id: 'page_2',
                title: 'Academic Background',
                description: 'Your educational and research background',
                questions: [
                    {
                        id: 'question_5',
                        title: 'Degree Level',
                        description: 'What is your current or highest degree level?',
                        type: 'dropdown',
                        required: true,
                        options: ['High School', 'Bachelor\'s', 'Master\'s', 'PhD', 'Postdoc', 'Other']
                    },
                    {
                        id: 'question_6',
                        title: 'Field of Study',
                        description: 'Your primary field of study or research area',
                        type: 'text',
                        required: true
                    },
                    {
                        id: 'question_7',
                        title: 'GPA (if applicable)',
                        description: 'Your current or most recent GPA',
                        type: 'text',
                        required: false
                    },
                    {
                        id: 'question_8',
                        title: 'Relevant Coursework',
                        description: 'List courses that are relevant to this research opportunity',
                        type: 'textarea',
                        required: false
                    }
                ]
            },
            {
                id: 'page_3',
                title: 'Research Experience',
                description: 'Your previous research experience and skills',
                questions: [
                    {
                        id: 'question_9',
                        title: 'Previous Research Experience',
                        description: 'Describe any previous research experience you have',
                        type: 'textarea',
                        required: true
                    },
                    {
                        id: 'question_10',
                        title: 'Technical Skills',
                        description: 'List any technical skills, programming languages, or software you are proficient in',
                        type: 'textarea',
                        required: false
                    },
                    {
                        id: 'question_11',
                        title: 'Research Interests',
                        description: 'What specific areas of research interest you most?',
                        type: 'textarea',
                        required: true
                    },
                    {
                        id: 'question_12',
                        title: 'Publications',
                        description: 'List any publications, presentations, or awards (if any)',
                        type: 'textarea',
                        required: false
                    }
                ]
            },
            {
                id: 'page_4',
                title: 'Motivation & Goals',
                description: 'Why you want to participate in this research',
                questions: [
                    {
                        id: 'question_13',
                        title: 'Why are you interested in this research opportunity?',
                        description: 'Explain your motivation for applying',
                        type: 'textarea',
                        required: true
                    },
                    {
                        id: 'question_14',
                        title: 'Career Goals',
                        description: 'How does this opportunity align with your career goals?',
                        type: 'textarea',
                        required: true
                    },
                    {
                        id: 'question_15',
                        title: 'Availability',
                        description: 'What is your availability for this research? (hours per week, duration)',
                        type: 'text',
                        required: true
                    },
                    {
                        id: 'question_16',
                        title: 'Additional Information',
                        description: 'Any additional information you would like to share',
                        type: 'textarea',
                        required: false
                    }
                ]
            }
        ],
        settings: {
            allowMultipleSubmissions: false,
            collectEmail: true,
            showProgressBar: true
        }
    },
    {
        id: 'competition_template',
        title: 'Competition Application',
        description: 'Template for competitions and contests',
        pages: [
            {
                id: 'page_1',
                title: 'Team Information',
                description: 'Information about you and your team',
                questions: [
                    {
                        id: 'question_1',
                        title: 'Team Name',
                        description: 'What is your team name?',
                        type: 'text',
                        required: true
                    },
                    {
                        id: 'question_2',
                        title: 'Team Members',
                        description: 'List all team members and their roles',
                        type: 'textarea',
                        required: true
                    },
                    {
                        id: 'question_3',
                        title: 'Team Leader Contact',
                        description: 'Primary contact information for the team leader',
                        type: 'text',
                        required: true
                    }
                ]
            },
            {
                id: 'page_2',
                title: 'Project Details',
                description: 'Information about your competition entry',
                questions: [
                    {
                        id: 'question_4',
                        title: 'Project Title',
                        description: 'What is your project called?',
                        type: 'text',
                        required: true
                    },
                    {
                        id: 'question_5',
                        title: 'Project Description',
                        description: 'Describe your project in detail',
                        type: 'textarea',
                        required: true
                    },
                    {
                        id: 'question_6',
                        title: 'Problem Statement',
                        description: 'What problem does your project solve?',
                        type: 'textarea',
                        required: true
                    },
                    {
                        id: 'question_7',
                        title: 'Solution Approach',
                        description: 'How do you plan to solve this problem?',
                        type: 'textarea',
                        required: true
                    }
                ]
            },
            {
                id: 'page_3',
                title: 'Technical Details',
                description: 'Technical aspects of your project',
                questions: [
                    {
                        id: 'question_8',
                        title: 'Technologies Used',
                        description: 'What technologies, tools, or platforms will you use?',
                        type: 'textarea',
                        required: true
                    },
                    {
                        id: 'question_9',
                        title: 'Timeline',
                        description: 'What is your project timeline?',
                        type: 'text',
                        required: true
                    },
                    {
                        id: 'question_10',
                        title: 'Resources Needed',
                        description: 'What resources do you need to complete this project?',
                        type: 'textarea',
                        required: false
                    }
                ]
            }
        ],
        settings: {
            allowMultipleSubmissions: false,
            collectEmail: true,
            showProgressBar: true
        }
    },
    {
        id: 'youth_program_template',
        title: 'Youth Program Application',
        description: 'Template for youth programs and camps',
        pages: [
            {
                id: 'page_1',
                title: 'Personal Information',
                description: 'Basic information about the participant',
                questions: [
                    {
                        id: 'question_1',
                        title: 'Full Name',
                        description: 'Enter your full legal name',
                        type: 'text',
                        required: true
                    },
                    {
                        id: 'question_2',
                        title: 'Date of Birth',
                        description: 'Your date of birth',
                        type: 'date',
                        required: true
                    },
                    {
                        id: 'question_3',
                        title: 'Parent/Guardian Name',
                        description: 'Name of parent or legal guardian',
                        type: 'text',
                        required: true
                    },
                    {
                        id: 'question_4',
                        title: 'Parent/Guardian Contact',
                        description: 'Phone number and email of parent/guardian',
                        type: 'text',
                        required: true
                    }
                ]
            },
            {
                id: 'page_2',
                title: 'School Information',
                description: 'Information about your school',
                questions: [
                    {
                        id: 'question_5',
                        title: 'School Name',
                        description: 'Name of your current school',
                        type: 'text',
                        required: true
                    },
                    {
                        id: 'question_6',
                        title: 'Grade Level',
                        description: 'What grade are you in?',
                        type: 'dropdown',
                        required: true,
                        options: ['6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade']
                    },
                    {
                        id: 'question_7',
                        title: 'Favorite Subjects',
                        description: 'What are your favorite subjects in school?',
                        type: 'checkbox',
                        required: false,
                        options: ['Math', 'Science', 'English', 'History', 'Art', 'Music', 'Physical Education', 'Other']
                    }
                ]
            },
            {
                id: 'page_3',
                title: 'Interests & Goals',
                description: 'Your interests and what you hope to learn',
                questions: [
                    {
                        id: 'question_8',
                        title: 'Why do you want to join this program?',
                        description: 'Tell us why you are interested in this program',
                        type: 'textarea',
                        required: true
                    },
                    {
                        id: 'question_9',
                        title: 'What do you hope to learn?',
                        description: 'What skills or knowledge do you hope to gain?',
                        type: 'textarea',
                        required: true
                    },
                    {
                        id: 'question_10',
                        title: 'Hobbies and Interests',
                        description: 'What do you like to do in your free time?',
                        type: 'textarea',
                        required: false
                    }
                ]
            }
        ],
        settings: {
            allowMultipleSubmissions: false,
            collectEmail: true,
            showProgressBar: true
        }
    },
    {
        id: 'community_template',
        title: 'Community Application',
        description: 'Template for community programs and initiatives',
        pages: [
            {
                id: 'page_1',
                title: 'Personal Information',
                description: 'Basic information about the applicant',
                questions: [
                    {
                        id: 'question_1',
                        title: 'Full Name',
                        description: 'Enter your full legal name',
                        type: 'text',
                        required: true
                    },
                    {
                        id: 'question_2',
                        title: 'Email Address',
                        description: 'Your primary email address',
                        type: 'email',
                        required: true
                    },
                    {
                        id: 'question_3',
                        title: 'Phone Number',
                        description: 'Best contact number',
                        type: 'text',
                        required: false
                    },
                    {
                        id: 'question_4',
                        title: 'Location',
                        description: 'City and country where you are located',
                        type: 'text',
                        required: true
                    }
                ]
            },
            {
                id: 'page_2',
                title: 'Background & Experience',
                description: 'Your background and relevant experience',
                questions: [
                    {
                        id: 'question_5',
                        title: 'Professional Background',
                        description: 'Tell us about your professional background',
                        type: 'textarea',
                        required: true
                    },
                    {
                        id: 'question_6',
                        title: 'Relevant Experience',
                        description: 'Any experience relevant to this community program',
                        type: 'textarea',
                        required: false
                    },
                    {
                        id: 'question_7',
                        title: 'Skills',
                        description: 'What skills do you bring to this community?',
                        type: 'textarea',
                        required: true
                    }
                ]
            },
            {
                id: 'page_3',
                title: 'Motivation & Commitment',
                description: 'Why you want to join and your commitment level',
                questions: [
                    {
                        id: 'question_8',
                        title: 'Why do you want to join this community?',
                        description: 'Explain your motivation for joining',
                        type: 'textarea',
                        required: true
                    },
                    {
                        id: 'question_9',
                        title: 'What can you contribute?',
                        description: 'How do you plan to contribute to this community?',
                        type: 'textarea',
                        required: true
                    },
                    {
                        id: 'question_10',
                        title: 'Time Commitment',
                        description: 'How much time can you commit to this community?',
                        type: 'text',
                        required: true
                    }
                ]
            }
        ],
        settings: {
            allowMultipleSubmissions: false,
            collectEmail: true,
            showProgressBar: true
        }
    }
];

export default function ApplicationFormTemplates({ onSelectTemplate }: ApplicationFormTemplatesProps) {
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    const handleSelectTemplate = (template: ApplicationForm) => {
        setSelectedTemplate(template.id);
        onSelectTemplate(template);
    };

    return (
        <div className="space-y-4">
            <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Choose a Template</h3>
                <p className="text-sm text-neutral-600">
                    Select a pre-built template to get started quickly, or create a custom form from scratch.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                    <div
                        key={template.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedTemplate === template.id
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-neutral-300 hover:border-primary-400 hover:bg-neutral-50'
                            }`}
                        onClick={() => handleSelectTemplate(template)}
                    >
                        <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-foreground">{template.title}</h4>
                            {selectedTemplate === template.id && (
                                <span className="text-primary-600 text-sm font-medium">Selected</span>
                            )}
                        </div>
                        <p className="text-sm text-neutral-600 mb-3">{template.description}</p>
                        <div className="text-xs text-neutral-500">
                            {template.pages.length} page{template.pages.length !== 1 ? 's' : ''} • {' '}
                            {template.pages.reduce((total, page) => total + page.questions.length, 0)} questions
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center">
                <button
                    onClick={() => onSelectTemplate({
                        id: '',
                        title: 'Application Form',
                        description: '',
                        pages: [{
                            id: 'page_1',
                            title: 'Application Information',
                            description: '',
                            questions: []
                        }],
                        settings: {
                            allowMultipleSubmissions: false,
                            collectEmail: true,
                            showProgressBar: true
                        }
                    })}
                    className="px-4 py-2 text-sm text-primary-600 hover:text-primary-700 border border-primary-300 rounded-md hover:bg-primary-50 transition-colors"
                >
                    Start from Scratch
                </button>
            </div>
        </div>
    );
}
