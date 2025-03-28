
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/error-handling';

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
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Only load content if we have a valid sourceId that doesn't start with temp-
    if (sourceId && !sourceId.startsWith('temp-')) {
      loadContent();
    }
  }, [sourceId]);

  const loadContent = async () => {
    if (!sourceId || sourceId.startsWith('temp-')) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Loading content for document:', sourceId);
      
      const { data, error } = await supabase
        .from('knowledge_sources')
        .select('*')
        .eq('id', sourceId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Update all state values with loaded content
        setTitle(data.title || '');
        setContent(data.content || '');
        setTemplateId(data.template_id);
        setExternalSourceUrl(data.external_source_url || '');
        
        // Also update the lastSaved values to match
        setLastSavedTitle(data.title || '');
        setLastSavedContent(data.content || '');
        setLastSavedExternalSourceUrl(data.external_source_url || '');
        
        // Set published status
        setIsPublished(!!data.is_published);
        
        // Reset dirty state since we just loaded
        setIsDirty(false);
        
        console.log('Content loaded successfully');
      }
    } catch (loadError) {
      console.error('Error loading content:', loadError);
      setError(loadError instanceof Error ? loadError : new Error('Failed to load content'));
      handleError(
        loadError,
        "Failed to load document content",
        { level: "error" }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    loadContent
  };
};
