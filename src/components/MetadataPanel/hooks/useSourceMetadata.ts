
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SourceMetadata, SimpleSourceMetadata } from '../types';
import { handleError } from '@/utils/errors/handle';

interface UseSourceMetadataProps {
  contentId: string;
  enabled?: boolean;
}

export const useSourceMetadata = ({ contentId, enabled = true }: UseSourceMetadataProps) => {
  const [lastCheckedAt, setLastCheckedAt] = useState<string | null>(null);
  const [externalSourceUrl, setExternalSourceUrl] = useState<string | null>(null);
  const [needsExternalReview, setNeedsExternalReview] = useState(false);

  // Fetch metadata using React Query
  const {
    data,
    isLoading,
    error,
    refetch: fetchSourceMetadata
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
        const error = err instanceof Error ? err : new Error(String(err));
        
        handleError(
          error, 
          "Failed to fetch metadata", 
          { level: "warning" }
        );
        
        throw error;
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

  return {
    isLoading,
    error,
    data,
    externalSourceUrl,
    lastCheckedAt,
    needsExternalReview,
    fetchSourceMetadata
  };
};
