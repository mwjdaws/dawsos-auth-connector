
import { useEffect, useRef, useState } from 'react';
import { toast } from '@/hooks/use-toast';

/**
 * Hook to automatically save content at specified intervals
 * 
 * @param isDirty Whether the content has unsaved changes
 * @param interval Interval in milliseconds between save attempts
 * @param onSave Function to call to save the content
 * @returns Object with autosave state information
 */
export const useAutosave = (
  isDirty: boolean,
  interval: number = 30000, // Default to 30 seconds
  onSave: () => Promise<any>
) => {
  // Track autosave state
  const [isAutosaving, setIsAutosaving] = useState(false);
  const [lastAutosaveAttempt, setLastAutosaveAttempt] = useState<Date | null>(null);
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);
  
  // Refs for tracking mount state and preventing race conditions
  const isMounted = useRef(true);
  const isAutosaveInProgress = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  // Clear any existing timeout to prevent multiple timers
  const clearExistingTimeout = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Perform the actual autosave operation
  const performAutosave = async () => {
    // Skip if not dirty, already in progress, or component unmounted
    if (!isDirty || isAutosaveInProgress.current || !isMounted.current) {
      return;
    }

    // Set lock to prevent concurrent saves
    isAutosaveInProgress.current = true;
    
    try {
      setIsAutosaving(true);
      setLastAutosaveAttempt(new Date());
      console.log('Auto-saving document...');
      
      // Important: We pass the isAutoSave flag through the onSave function
      // The implementation should handle this properly in the save flow
      await onSave();
      
      // Reset failure count on success
      if (consecutiveFailures > 0) {
        setConsecutiveFailures(0);
      }
    } catch (error) {
      console.error('Autosave error:', error);
      setConsecutiveFailures(prev => prev + 1);
      
      // Only show toast after multiple failures
      if (consecutiveFailures >= 2) {
        toast({
          title: "Autosave Issue",
          description: "We're having trouble automatically saving your work. Consider saving manually.",
          variant: "destructive",
        });
      }
    } finally {
      // Always release the lock and update state if component is still mounted
      isAutosaveInProgress.current = false;
      
      if (isMounted.current) {
        setIsAutosaving(false);
      }
    }
  };

  // Schedule autosave with the specified interval
  useEffect(() => {
    // Clear any existing timeout first
    clearExistingTimeout();
    
    // Only schedule if the document is dirty and component is mounted
    if (isDirty && isMounted.current) {
      // Calculate delay with exponential backoff for failures
      const backoffFactor = Math.min(Math.pow(1.5, consecutiveFailures), 4); // Cap at 4x delay
      const actualDelay = interval * backoffFactor;
      
      // Schedule the next autosave
      timeoutRef.current = window.setTimeout(performAutosave, actualDelay);
    }
    
    // Cleanup function to run when component unmounts or dependencies change
    return () => {
      clearExistingTimeout();
    };
  }, [isDirty, interval, consecutiveFailures, isAutosaving]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      clearExistingTimeout();
    };
  }, []);

  return {
    isAutosaving,
    lastAutosaveAttempt,
    consecutiveFailures
  };
};
