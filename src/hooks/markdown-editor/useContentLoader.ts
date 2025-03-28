
import { useEffect } from 'react';
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

  useEffect(() => {
    let isMounted = true;
    
    const loadContent = async () => {
      if (!sourceId) return;
      
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('knowledge_sources')
          .select('*')
          .eq('id', sourceId)
          .single();
        
        if (error) throw error;
        
        if (isMounted && data) {
          setTitle(data.title || '');
          setContent(data.content || '');
          setTemplateId(data.template_id);
          setExternalSourceUrl(data.external_source_url || '');
          setLastSavedTitle(data.title || '');
          setLastSavedContent(data.content || '');
          setLastSavedExternalSourceUrl(data.external_source_url || '');
          setIsPublished(!!data.published);
          setIsDirty(false);
        }
      } catch (error) {
        handleError(
          error, 
          "Failed to load content", 
          { level: "error", silent: false }
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    if (sourceId) {
      loadContent();
    }
    
    return () => {
      isMounted = false;
    };
  }, [sourceId]);
  
  return { isLoading };
};
