import { useEffect, useState, useCallback } from 'react';
import { TIMEOUTS, STORAGE_KEYS } from '@/lib/constants';

interface AutosaveOptions {
  key: string;
  debounceMs?: number;
}

export function useAutosave<T>(
  data: T,
  { key, debounceMs = TIMEOUTS.AUTOSAVE }: AutosaveOptions
) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);
  const [savedData, setSavedData] = useState<T | null>(null);

  // Load saved data on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const saved = localStorage.getItem(key);
      const timestamp = localStorage.getItem(`${key}-timestamp`);
      
      if (saved && timestamp) {
        const parsedData = JSON.parse(saved);
        const savedTime = new Date(parseInt(timestamp));
        
        // Only show restore prompt if saved recently (within 24 hours)
        const hoursSinceSave = (Date.now() - savedTime.getTime()) / (1000 * 60 * 60);
        if (hoursSinceSave < 24) {
          setSavedData(parsedData);
          setLastSaved(savedTime);
          setShowRestorePrompt(true);
        } else {
          // Clear old data
          localStorage.removeItem(key);
          localStorage.removeItem(`${key}-timestamp`);
        }
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, [key]);

  // Auto-save with debounce
  useEffect(() => {
    if (typeof window === 'undefined' || !data) return;
    
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        localStorage.setItem(`${key}-timestamp`, Date.now().toString());
        setLastSaved(new Date());
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [data, key, debounceMs]);

  const restoreDraft = useCallback(() => {
    setShowRestorePrompt(false);
    return savedData;
  }, [savedData]);

  const discardDraft = useCallback(() => {
    setShowRestorePrompt(false);
    setSavedData(null);
    setLastSaved(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}-timestamp`);
    }
  }, [key]);

  const clearSaved = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}-timestamp`);
    }
    setLastSaved(null);
  }, [key]);

  return {
    lastSaved,
    showRestorePrompt,
    savedData,
    restoreDraft,
    discardDraft,
    clearSaved,
  };
}

