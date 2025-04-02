
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/error-handling';
import { Json } from '@/integrations/supabase/types';

interface UseContentLoaderProps {
  sourceId?: string;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setTemplateId: (templateId: string | null) => void;
  setExternalSourceUrl: (url: string) => void;
  setLastSavedTitle: (title: string) => void;
  setLastSavedContent: (content: string) => void;
  setLastSavedExternalSourceUrl: (url: string) => void;
  setIsPublished: (isPublished: boolean) => void;
  setIsDirty: (isDirty: boolean) => void;
}

/**
 * Hook for loading existing content into the editor
 */
export const useContentLoader = ({
  sourceId,
  setTitle,
  setContent,
  setTemplateId,
  setExternalSourceUrl,
  setLastSavedTitle,
  setLastSavedContent,
  setLastSavedExternalSourceUrl,
  setIsPublished,
  setIsDirty
}: UseContentLoaderProps) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Skip for temporary IDs or when no sourceId is provided
    if (!sourceId || sourceId.startsWith('temp-')) {
      return;
    }

    const loadContent = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('knowledge_sources')
          .select('*')
          .eq('id', sourceId)
          .single();

        if (error) throw error;

        if (data) {
          setTitle(data.title || '');
          setContent(data.content || '');
          setTemplateId(data.template_id || null);
          setExternalSourceUrl(data.external_source_url || '');
          setLastSavedTitle(data.title || '');
          setLastSavedContent(data.content || '');
          setLastSavedExternalSourceUrl(data.external_source_url || '');
          setIsPublished(data.published || false); // Changed from is_published to published
          setIsDirty(false);

          console.log('Loaded content for source:', sourceId);
        }
      } catch (error) {
        console.error('Error loading content:', error);
        handleError(
          error,
          "Failed to load content",
          { level: "error" }
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [sourceId]);

  return {
    isLoading
  };
};
