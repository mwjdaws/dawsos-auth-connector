
import { useState, useEffect } from 'react';
import { SourceMetadata, SimpleSourceMetadata } from '../types';

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
  const fetchSourceMetadata = async () => {
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
        external_source_url: "https://example.com/article",
        external_source_checked_at: new Date().toISOString(),
        needs_external_review: false,
        is_published: true
      };

      setData(mockData);
      setExternalSourceUrl(mockData.external_source_url);
      setLastCheckedAt(mockData.external_source_checked_at);
      setNeedsExternalReview(mockData.needs_external_review);
    } catch (err) {
      console.error("Error fetching source metadata:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      
      // Set default values in case of error
      setData({
        external_source_url: null,
        needs_external_review: false, 
        external_source_checked_at: null
      });
      setExternalSourceUrl(null);
      setLastCheckedAt(null);
      setNeedsExternalReview(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch the metadata on mount or contentId change
  useEffect(() => {
    fetchSourceMetadata();
  }, [contentId]);

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
