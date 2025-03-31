
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SimpleSourceMetadata } from '../types';

export interface UseSourceMetadataProps {
  contentId: string;
}

export interface UseSourceMetadataResult {
  data: SimpleSourceMetadata | null;
  isLoading: boolean;
  error: Error | null;
  fetchSourceMetadata: () => void;
  externalSourceUrl: string | null;
  needsExternalReview: boolean;
  lastCheckedAt: string | null;
}

export const useSourceMetadata = ({ contentId }: UseSourceMetadataProps): UseSourceMetadataResult => {
  const [data, setData] = useState<SimpleSourceMetadata | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchSourceMetadata = async () => {
    if (!contentId) {
      setData(null);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: source, error: fetchError } = await supabase
        .from('knowledge_sources')
        .select('*')
        .eq('id', contentId)
        .single();
      
      if (fetchError) throw fetchError;
      
      setData(source as SimpleSourceMetadata);
    } catch (err) {
      console.error('Error fetching source metadata:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch source metadata'));
      
      // Provide fallback values even in error state
      setData({
        id: contentId,
        title: 'Unknown Title',
        content: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        external_source_url: null,
        needs_external_review: false,
        external_source_checked_at: null,
        external_content_hash: null,
        is_published: false,
        published_at: null,
        template_id: null
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSourceMetadata();
  }, [contentId]);
  
  return {
    data,
    isLoading,
    error,
    fetchSourceMetadata,
    externalSourceUrl: data?.external_source_url || null,
    needsExternalReview: data?.needs_external_review || false,
    lastCheckedAt: data?.external_source_checked_at || null
  };
};
