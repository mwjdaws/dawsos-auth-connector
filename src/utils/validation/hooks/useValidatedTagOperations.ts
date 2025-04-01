
import { useState, useCallback } from 'react';
import { validateTag } from '../tagValidation';
import { TagValidationResult } from '../types';
import { Tag } from '@/types/tag';

/**
 * Props for the useValidatedTagOperations hook
 */
interface UseValidatedTagOperationsProps {
  onAddTag?: (tagName: string, typeId?: string | null) => Promise<boolean>;
  onDeleteTag?: (tagId: string) => Promise<boolean>;
}

/**
 * Custom hook for validated tag operations
 */
export function useValidatedTagOperations({ 
  onAddTag, 
  onDeleteTag 
}: UseValidatedTagOperationsProps = {}) {
  const [validationResult, setValidationResult] = useState<TagValidationResult | null>(null);
  
  // Validate and add a tag
  const addTag = useCallback(async (tagName: string, typeId?: string | null) => {
    const result = validateTag(tagName);
    setValidationResult(result);
    
    if (result.isValid && onAddTag) {
      return await onAddTag(tagName, typeId);
    }
    
    return false;
  }, [onAddTag]);
  
  // Delete a tag (no validation needed)
  const deleteTag = useCallback(async (tagId: string) => {
    if (onDeleteTag) {
      return await onDeleteTag(tagId);
    }
    return false;
  }, [onDeleteTag]);
  
  // Reset validation state
  const resetValidation = useCallback(() => {
    setValidationResult(null);
  }, []);
  
  return {
    validationResult,
    addTag,
    deleteTag,
    resetValidation
  };
}
