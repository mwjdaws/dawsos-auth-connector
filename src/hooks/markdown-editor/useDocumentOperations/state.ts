
import { useState } from 'react';

/**
 * Handle operation state (loading, saving, publishing)
 */
export const useDocumentOperationState = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  return {
    isSaving,
    isPublishing,
    setIsSaving,
    setIsPublishing
  };
};
