
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { handleError, ErrorLevel } from '@/utils/errors';

interface ExternalSourceData {
  external_source_url: string | null;
  external_source_checked_at: string | null;
  needs_external_review: boolean | null;
}

interface UseSourceMetadataProps {
  contentId: string;
  enabled?: boolean;
}

/**
 * Hook for managing external source metadata
 */
export const useSourceMetadata = ({ 
  contentId, 
  enabled = true 
}: UseSourceMetadataProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<ExternalSourceData | null>(null);
  
  // Derived state for better usability
  const [externalSourceUrl, setExternalSourceUrl] = useState<string>('');
  const [needsExternalReview, setNeedsExternalReview] = useState<boolean>(false);
  const [lastCheckedAt, setLastCheckedAt] = useState<string>('');
  
  /**
   * Fetch source metadata from the database
   */
  const fetchSourceMetadata = useCallback(async () => {
    if (!contentId || !enabled) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('knowledge_sources')
        .select('external_source_url, external_source_checked_at, needs_external_review')
        .eq('id', contentId)
        .single();
      
      if (error) throw error;
      
      setData(data);
      
      // Set derived state with proper defaults for null values
      setExternalSourceUrl(data.external_source_url || '');
      setNeedsExternalReview(data.needs_external_review === true);
      setLastCheckedAt(data.external_source_checked_at || '');
      
      return data;
    } catch (err) {
      console.error('Error fetching source metadata:', err);
      
      const errorMessage = 'Error fetching source metadata';
      setError(new Error(errorMessage));
      
      handleError(
        err,
        errorMessage,
        { level: ErrorLevel.WARNING, context: { contentId } }
      );
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [contentId, enabled]);
  
  // Fetch data on component mount and when contentId changes
  useEffect(() => {
    if (contentId && enabled) {
      fetchSourceMetadata();
    }
  }, [contentId, enabled, fetchSourceMetadata]);
  
  return {
    externalSourceUrl,
    needsExternalReview,
    lastCheckedAt,
    isLoading,
    error,
    data,
    fetchSourceMetadata
  };
};
