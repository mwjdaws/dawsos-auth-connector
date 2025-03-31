
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SourceMetadata, SimpleSourceMetadata } from '../types';
import { handleError } from '@/utils/errors/handle';
import { tryAction } from '@/utils/errors/wrappers';

interface UseSourceMetadataProps {
  contentId: string;
  enabled?: boolean;
}

/**
 * Hook for fetching and managing source metadata
 * 
 * @param props Configuration for the hook
 * @returns Source metadata state and operations
 */
export const useSourceMetadata = ({ contentId, enabled = true }: UseSourceMetadataProps) => {
  const [lastCheckedAt, setLastCheckedAt] = useState<string | null>(null);
  const [externalSourceUrl, setExternalSourceUrl] = useState<string | null>(null);
  const [needsExternalReview, setNeedsExternalReview] = useState(false);

  // Fetch metadata using React Query
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['sourceMetadata', contentId],
    queryFn: async () => {
      if (!contentId) {
        throw new Error('Cannot fetch metadata: No content ID provided');
      }
  
      try {
        // In a real implementation, this would be an API call
        // For now, we'll simulate a response
        await new Promise(resolve => setTimeout(resolve, 500));
  
        // Mock response data
        const mockData: SimpleSourceMetadata = {
          id: contentId,
          title: 'Sample content',
          external_source_url: "https://example.com/article",
          external_source_checked_at: new Date().toISOString(),
          needs_external_review: false,
          published: true,
          updated_at: new Date().toISOString(),
          content: "Sample content",
          created_at: new Date().toISOString(),
          published_at: null,
          metadata: null
        };
  
        return mockData;
      } catch (err) {
        console.error("Error fetching source metadata:", err);
        
        handleError(
          err, 
          "Failed to fetch source metadata", 
          { 
            level: "warning",
            context: { contentId }
          }
        );
        
        throw err;
      }
    },
    enabled: enabled && !!contentId
  });

  // Update state when data changes
  useEffect(() => {
    if (data) {
      setExternalSourceUrl(data.external_source_url || null);
      setLastCheckedAt(data.external_source_checked_at || null);
      setNeedsExternalReview(data.needs_external_review || false);
    }
  }, [data]);

  // Safely fetch source metadata with error handling
  const fetchSourceMetadata = useCallback(async () => {
    return tryAction(
      () => refetch(),
      {
        errorMessage: "Failed to refresh source metadata",
        context: { contentId },
        level: "warning"
      }
    );
  }, [refetch, contentId]);

  // Mark the external source as checked
  const markExternalSourceChecked = useCallback(async () => {
    // This would be an API call in a real implementation
    console.log("Marking external source as checked:", contentId);
    
    setLastCheckedAt(new Date().toISOString());
    setNeedsExternalReview(false);
    
    return true;
  }, [contentId]);

  // Update the external source URL
  const updateExternalSourceUrl = useCallback(async (url: string | null) => {
    // This would be an API call in a real implementation
    console.log("Updating external source URL:", url);
    
    setExternalSourceUrl(url);
    
    return true;
  }, []);

  return {
    isLoading,
    error,
    data,
    externalSourceUrl,
    lastCheckedAt,
    needsExternalReview,
    fetchSourceMetadata,
    markExternalSourceChecked,
    updateExternalSourceUrl
  };
};

export default useSourceMetadata;
