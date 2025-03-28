
import { useEffect, useRef, useState } from 'react';
import { toast } from '@/hooks/use-toast';

/**
 * Hook to automatically save content at specified intervals
 * @param isDirtyOrConfig Whether the content has unsaved changes or full config object
 * @param interval Interval in milliseconds between save attempts
 * @param onSave Function to call to save the content
 */
export const useAutosave = (
  isDirtyOrConfig: boolean | { 
    isDirty: boolean;
    interval?: number; 
    onSave: () => void;
    [key: string]: any; // Allow any other properties
  },
  interval: number = 15000, // Default to 15 seconds
  onSave?: () => void
) => {
  // Handle both calling styles (object or individual params)
  let effectiveIsDirty: boolean;
  let effectiveInterval: number = interval;
  let effectiveOnSave: (() => void) | undefined = onSave;
  
  // If first argument is an object, extract properties from it
  if (typeof isDirtyOrConfig === 'object') {
    effectiveIsDirty = isDirtyOrConfig.isDirty;
    effectiveInterval = isDirtyOrConfig.interval || 15000;
    effectiveOnSave = isDirtyOrConfig.onSave;
  } else {
    effectiveIsDirty = isDirtyOrConfig;
  }
  
  // State for tracking autosave status
  const [isAutosaving, setIsAutosaving] = useState(false);
  const [lastAutosaveAttempt, setLastAutosaveAttempt] = useState<Date | null>(null);
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);
  
  // Track if component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);
  
  // Track the timeout ID for cleanup
  const timeoutRef = useRef<number | null>(null);

  // Helper to perform the autosave
  const performAutosave = async () => {
    if (!effectiveIsDirty || isAutosaving || !isMounted.current || !effectiveOnSave) {
      return;
    }
    
    try {
      setIsAutosaving(true);
      setLastAutosaveAttempt(new Date());
      console.log('Auto-saving document...');
      
      await effectiveOnSave();
      
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
      if (isMounted.current) {
        setIsAutosaving(false);
      }
    }
  };

  // Autosave effect with exponential backoff for failures
  useEffect(() => {
    const scheduleNextAutosave = () => {
      // Calculate delay with exponential backoff for failures
      const baseDelay = effectiveInterval;
      const backoffFactor = Math.min(Math.pow(1.5, consecutiveFailures), 4); // Cap at 4x delay
      const actualDelay = baseDelay * backoffFactor;
      
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = window.setTimeout(() => {
        performAutosave().finally(() => {
          if (isMounted.current) {
            scheduleNextAutosave();
          }
        });
      }, actualDelay);
    };
    
    // Start the autosave cycle
    scheduleNextAutosave();
    
    // Cleanup on unmount
    return () => {
      isMounted.current = false;
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [effectiveIsDirty, effectiveOnSave, effectiveInterval, consecutiveFailures]);

  return {
    isMounted,
    isAutosaving,
    lastAutosaveAttempt,
    consecutiveFailures
  };
};
