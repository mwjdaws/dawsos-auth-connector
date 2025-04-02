
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ExternalSourceData {
  externalSourceUrl: string | null;
  lastCheckedAt: string | null;
  needsExternalReview: boolean;
}

interface UseExternalSourceProps {
  contentId: string;
  onMetadataChange?: () => void;
}

export const useExternalSource = ({ contentId, onMetadataChange }: UseExternalSourceProps) => {
  const [data, setData] = useState<ExternalSourceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchExternalSource = useCallback(async () => {
    if (!contentId) {
      return null;
    }
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('knowledge_sources')
        .select(`
          external_source_url,
          external_source_checked_at,
          needs_external_review
        `)
        .eq('id', contentId)
        .single();
      
      if (error) {
        throw new Error(`Failed to fetch external source data: ${error.message}`);
      }
      
      const sourceData: ExternalSourceData = {
        externalSourceUrl: data.external_source_url,
        lastCheckedAt: data.external_source_checked_at,
        needsExternalReview: data.needs_external_review || false
      };
      
      setData(sourceData);
      return sourceData;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch external source data');
      setError(error);
      console.error('Error fetching external source data:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [contentId]);
  
  // Update external source URL
  const updateExternalSource = useCallback(async (url: string) => {
    if (!contentId) {
      return false;
    }
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('knowledge_sources')
        .update({
          external_source_url: url,
          updated_at: new Date().toISOString()
        })
        .eq('id', contentId);
      
      if (error) {
        throw new Error(`Failed to update external source: ${error.message}`);
      }
      
      // Update local state
      setData(prev => prev ? {
        ...prev,
        externalSourceUrl: url
      } : null);
      
      // Notify parent component
      if (onMetadataChange) {
        onMetadataChange();
      }
      
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update external source');
      setError(error);
      console.error('Error updating external source:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [contentId, onMetadataChange]);
  
  // Initialize on mount or when contentId changes
  useEffect(() => {
    if (contentId) {
      fetchExternalSource();
    }
  }, [contentId, fetchExternalSource]);
  
  return {
    data,
    isLoading,
    error,
    fetchExternalSource,
    updateExternalSource
  };
};
