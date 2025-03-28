
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

/**
 * Hook to load content from a knowledge source
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
  
  // Load content from database when sourceId is provided
  useEffect(() => {
    let isMounted = true;
    
    const loadContent = async () => {
      // Skip loading for temp documents or when no sourceId is provided
      if (!sourceId || sourceId.startsWith('temp-')) {
        return;
      }
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('knowledge_sources')
          .select('*')
          .eq('id', sourceId)
          .single();
          
        if (error) throw error;
        
        if (data && isMounted) {
          setTitle(data.title || '');
          setContent(data.content || '');
          setTemplateId(data.template_id);
          setExternalSourceUrl(data.external_source_url || '');
          
          // Set last saved state to match loaded content
          setLastSavedTitle(data.title || '');
          setLastSavedContent(data.content || '');
          setLastSavedExternalSourceUrl(data.external_source_url || '');
          
          // Set published state
          setIsPublished(data.published || false);
          
          // Content is clean after loading
          setIsDirty(false);
        }
      } catch (error) {
        console.error('Error loading content:', error);
        handleError(
          error,
          "Failed to load document content",
          { level: "error", technical: true }
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    loadContent();
    
    return () => {
      isMounted = false;
    };
  }, [sourceId, setTitle, setContent, setTemplateId, setExternalSourceUrl, 
      setLastSavedTitle, setLastSavedContent, setLastSavedExternalSourceUrl, 
      setIsPublished, setIsDirty]);
  
  return {
    isLoading
  };
};
