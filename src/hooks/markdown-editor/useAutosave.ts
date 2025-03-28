
import { useEffect, useRef, useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface AutosaveProps {
  isDirty: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  documentId?: string;
  onSave: () => void;
  interval?: number; // Allow customization of autosave interval
  enabled?: boolean; // Allow disabling autosave
}

export const useAutosave = ({
  isDirty,
  isSaving,
  isPublishing,
  documentId,
  onSave,
  interval = 15000, // Default to 15 seconds
  enabled = true
}: AutosaveProps) => {
  const [isAutosaving, setIsAutosaving] = useState(false);
  const [lastAutosaveAttempt, setLastAutosaveAttempt] = useState<Date | null>(null);
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);
  
  // Track if component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);
  
  // Track the timeout ID for cleanup
  const timeoutRef = useRef<number | null>(null);

  // Helper to perform the autosave
  const performAutosave = async () => {
    if (!isDirty || isSaving || isPublishing || !documentId || !isMounted.current || !enabled) {
      return;
    }
    
    try {
      setIsAutosaving(true);
      setLastAutosaveAttempt(new Date());
      console.log('Auto-saving document...');
      
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
      if (isMounted.current) {
        setIsAutosaving(false);
      }
    }
  };

  // Autosave effect with exponential backoff for failures
  useEffect(() => {
    if (!enabled) return;
    
    const scheduleNextAutosave = () => {
      // Calculate delay with exponential backoff for failures
      const baseDelay = interval;
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
  }, [isDirty, isSaving, isPublishing, documentId, consecutiveFailures, enabled, interval]);

  return {
    isMounted,
    isAutosaving,
    lastAutosaveAttempt,
    consecutiveFailures
  };
};
