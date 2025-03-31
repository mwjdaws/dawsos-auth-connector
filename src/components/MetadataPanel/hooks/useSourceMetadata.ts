
import { useState, useEffect, useCallback } from 'react';
import { SourceMetadata, SimpleSourceMetadata } from '../types';
import { handleError } from '@/utils/errors/handle';

interface UseSourceMetadataProps {
  contentId: string;
}

export const useSourceMetadata = ({ contentId }: UseSourceMetadataProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<SimpleSourceMetadata | null>(null);
  const [lastCheckedAt, setLastCheckedAt] = useState<string | null>(null);
  const [externalSourceUrl, setExternalSourceUrl] = useState<string | null>(null);
  const [needsExternalReview, setNeedsExternalReview] = useState(false);

  // Function to fetch the source metadata
  const fetchSourceMetadata = useCallback(async () => {
    if (!contentId) {
      setIsLoading(false);
      setData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock response data
      // In a real implementation, this would be an API call
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

      setData(mockData);
      setExternalSourceUrl(mockData.external_source_url || null);
      setLastCheckedAt(mockData.external_source_checked_at || null);
      setNeedsExternalReview(mockData.needs_external_review || false);
    } catch (err) {
      console.error("Error fetching source metadata:", err);
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      
      handleError(
        error, 
        "Failed to fetch metadata", 
        { level: "warning" }
      );
      
      // Set default values in case of error
      setData({
        id: contentId,
        title: 'Error loading content',
        external_source_url: null,
        needs_external_review: false, 
        external_source_checked_at: null,
        published: false,
        updated_at: null
      });
      setExternalSourceUrl(null);
      setLastCheckedAt(null);
      setNeedsExternalReview(false);
    } finally {
      setIsLoading(false);
    }
  }, [contentId]);

  // Fetch the metadata on mount or contentId change
  useEffect(() => {
    fetchSourceMetadata();
  }, [contentId, fetchSourceMetadata]);

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
