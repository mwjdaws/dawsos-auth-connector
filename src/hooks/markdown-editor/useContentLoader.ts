
import { useState, useEffect, useTransition } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { handleError } from '@/utils/error-handling';

interface UseContentLoaderProps {
  sourceId?: string;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setTemplateId: (templateId: string | null) => void;
  setLastSavedTitle: (title: string) => void;
  setLastSavedContent: (content: string) => void;
  setIsPublished: (isPublished: boolean) => void;
  setIsDirty: (isDirty: boolean) => void;
}

/**
 * Hook for loading existing content
 */
export const useContentLoader = ({
  sourceId,
  setTitle,
  setContent,
  setTemplateId,
  setLastSavedTitle,
  setLastSavedContent,
  setIsPublished,
  setIsDirty
}: UseContentLoaderProps) => {
  const [isLoading, setIsLoading] = useState(!!sourceId);
  const [isPending, startTransition] = useTransition();

  // Load existing content if sourceId is provided and not a temporary ID
  useEffect(() => {
    const fetchExistingContent = async () => {
      // Skip loading for temporary IDs (which start with "temp-")
      if (sourceId && sourceId.startsWith('temp-')) {
        setIsLoading(false);
        return;
      }
      
      if (sourceId) {
        try {
          setIsLoading(true);
          const { data, error } = await supabase
            .from('knowledge_sources')
            .select('title, content, template_id, published')
            .eq('id', sourceId)
            .single();

          if (error) {
            throw error;
          }

          if (data) {
            startTransition(() => {
              setTitle(data.title);
              setContent(data.content);
              setTemplateId(data.template_id);
              setLastSavedTitle(data.title);
              setLastSavedContent(data.content);
              setIsPublished(!!data.published);
              setIsDirty(false);
            });
          }
        } catch (error) {
          console.error('Error loading existing content:', error);
          handleError(
            error,
            "Error loading content", 
            { 
              level: "error",
              technical: false
            }
          );
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchExistingContent();
  }, [sourceId, setTitle, setContent, setTemplateId, setLastSavedTitle, setLastSavedContent, setIsPublished, setIsDirty]);

  return { isLoading };
};
