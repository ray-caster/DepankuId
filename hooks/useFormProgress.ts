import { useMemo } from 'react';

interface FormField {
  value: any;
  required: boolean;
}

export function useFormProgress(fields: Record<string, FormField>) {
  return useMemo(() => {
    const requiredFields = Object.entries(fields).filter(([_, field]) => field.required);
    const totalFields = requiredFields.length;
    
    if (totalFields === 0) return { progress: 100, completed: 0, total: 0 };
    
    const completedFields = requiredFields.filter(([_, field]) => {
      const value = field.value;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'string') return value.trim().length > 0;
      return !!value;
    }).length;
    
    const progress = Math.round((completedFields / totalFields) * 100);
    
    return {
      progress,
      completed: completedFields,
      total: totalFields,
    };
  }, [fields]);
}

