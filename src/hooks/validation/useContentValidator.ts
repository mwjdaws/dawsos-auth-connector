
/**
 * Hook for content validation
 * 
 * Provides utilities for validating content identifiers and metadata
 * with support for both UUID and temporary ID formats.
 */
import { useMemo } from 'react';
import { useContentIdValidation } from './useContentIdValidation';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface ContentValidatorProps {
  contentId?: string | null;
  validateExists?: boolean;
}

export function useContentValidator({
  contentId,
  validateExists = false
}: ContentValidatorProps) {
  // Use the underlying content ID validation
  const {
    isValid,
    isUuid,
    isTemporary,
    isStorable,
    convertToUuid,
    validation,
    error
  } = useContentIdValidation(contentId);
  
  // Check if content exists in database if requested
  const { data: contentExists, isLoading: checkingExistence } = useQuery({
    queryKey: validateExists && isValid && contentId ? ['content-exists', contentId] : null,
    queryFn: async () => {
      if (!contentId || !isValid) return false;
      
      const { count, error } = await supabase
        .from('knowledge_sources')
        .select('id', { count: 'exact', head: true })
        .eq('id', convertToUuid || contentId);
        
      if (error) {
        console.error('Error checking content existence:', error);
        return false;
      }
      
      return count ? count > 0 : false;
    },
    enabled: validateExists && isValid && !!contentId
  });
  
  // Create a comprehensive validation message
  const validationMessage = useMemo(() => {
    if (!isValid) {
      return validation.errorMessage || 'Invalid content ID format';
    }
    
    if (validateExists && !checkingExistence) {
      if (contentExists === false) {
        return 'Content does not exist in database';
      }
    }
    
    if (isTemporary) {
      return 'Using temporary content ID';
    }
    
    return null;
  }, [isValid, validation.errorMessage, validateExists, checkingExistence, contentExists, isTemporary]);
  
  return {
    isValid,
    isUuid,
    isTemporary,
    isStorable,
    convertToUuid,
    validation,
    contentExists: validateExists ? contentExists : undefined,
    checkingExistence,
    validationMessage,
    error: validationMessage || error
  };
}

export default useContentValidator;
