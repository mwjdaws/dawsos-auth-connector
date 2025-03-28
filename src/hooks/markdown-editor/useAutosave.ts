
import { useEffect, useRef } from 'react';

interface AutosaveProps {
  isDirty: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  documentId?: string;
  onSave: () => void;
}

export const useAutosave = ({
  isDirty,
  isSaving,
  isPublishing,
  documentId,
  onSave
}: AutosaveProps) => {
  // Track if component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);

  // Autosave effect
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (isDirty && !isSaving && !isPublishing && documentId && isMounted.current) {
        console.log('Auto-saving document...');
        onSave();
      }
    }, 15000); // 15 seconds

    // Cleanup on unmount
    return () => {
      isMounted.current = false;
      clearInterval(autoSaveInterval);
    };
  }, [isDirty, isSaving, isPublishing, documentId, onSave]);

  return {
    isMounted
  };
};
