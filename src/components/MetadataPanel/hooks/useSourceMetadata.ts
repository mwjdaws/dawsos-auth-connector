
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SourceMetadata } from '@/types/metadata';
import { handleError, ErrorLevel, withErrorHandling } from '@/utils/errors';

interface UseSourceMetadataProps {
  contentId: string;
  enabled?: boolean;
}

/**
 * Hook for fetching and managing external source metadata
 */
export const useSourceMetadata = ({ contentId, enabled = true }: UseSourceMetadataProps) => {
  const [data, setData] = useState<SourceMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch source metadata for a specific content ID
   */
  const fetchSourceMetadata = useCallback(async () => {
    if (!contentId || !enabled) {
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data: sourceData, error: sourceError } = await supabase
        .from('knowledge_sources')
        .select(`
          id,
          external_source_url,
          external_source_checked_at,
          external_content_hash,
          is_published,
          title,
          created_at,
          updated_at
        `)
        .eq('id', contentId)
        .single();

      if (sourceError) {
        throw sourceError;
      }

      // Transform to the SourceMetadata type
      const metadata: SourceMetadata = {
        id: sourceData.id,
        title: sourceData.title,
        external_source_url: sourceData.external_source_url,
        external_source_checked_at: sourceData.external_source_checked_at,
        external_content_hash: sourceData.external_content_hash,
        needs_external_review: sourceData.external_source_url && !sourceData.external_source_checked_at,
        is_published: sourceData.is_published,
        created_at: sourceData.created_at,
        updated_at: sourceData.updated_at
      };

      setData(metadata);
      return metadata;
    } catch (err) {
      handleError(
        err,
        `Failed to fetch source metadata for content: ${contentId}`,
        { level: ErrorLevel.WARNING }
      );
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [contentId, enabled]);

  // Fetch metadata when the component mounts and when contentId changes
  useEffect(() => {
    if (enabled && contentId) {
      fetchSourceMetadata();
    }
  }, [enabled, contentId, fetchSourceMetadata]);

  // Extract values for convenience
  const externalSourceUrl = data?.external_source_url || null;
  const needsExternalReview = data?.needs_external_review || false;
  const lastCheckedAt = data?.external_source_checked_at || null;

  // Safe version of fetch with error handling
  const safeFetchSourceMetadata = withErrorHandling(
    fetchSourceMetadata,
    (error) => handleError(
      error,
      `Failed to fetch source metadata`,
      { level: ErrorLevel.WARNING }
    )
  );

  return {
    data,
    isLoading,
    error,
    fetchSourceMetadata: safeFetchSourceMetadata,
    // Extracted metadata for convenience
    externalSourceUrl,
    needsExternalReview,
    lastCheckedAt
  };
};
