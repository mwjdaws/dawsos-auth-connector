
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseContentStateProps {
  initialTitle: string;
  initialContent: string;
  initialTemplateId: string | null;
  sourceId?: string;
  documentId?: string;
}

/**
 * Hook for managing content state and tracking changes
 */
export const useContentState = ({
  initialTitle,
  initialContent,
  initialTemplateId,
  sourceId,
  documentId
}: UseContentStateProps) => {
  // Basic state
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [templateId, setTemplateId] = useState<string | null>(initialTemplateId);
  
  // State tracking
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedTitle, setLastSavedTitle] = useState(initialTitle);
  const [lastSavedContent, setLastSavedContent] = useState(initialContent);
  const [isPublished, setIsPublished] = useState(false);

  // Update state if props change (e.g., when loading a saved draft)
  useEffect(() => {
    if (!sourceId) { // Don't override fetched content with initialValues
      setTitle(initialTitle);
      setContent(initialContent);
      setTemplateId(initialTemplateId);
      setLastSavedTitle(initialTitle);
      setLastSavedContent(initialContent);
      setIsDirty(false);
    }
  }, [initialTitle, initialContent, initialTemplateId, sourceId]);

  // Track changes to mark document as dirty when content changes
  useEffect(() => {
    if (title !== lastSavedTitle || content !== lastSavedContent) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  }, [title, content, lastSavedTitle, lastSavedContent]);

  // Fetch published status when document loads
  useEffect(() => {
    const documentToCheck = documentId || sourceId;
    if (documentToCheck) {
      const fetchPublishStatus = async () => {
        const { data, error } = await supabase
          .from('knowledge_sources')
          .select('published')
          .eq('id', documentToCheck)
          .single();
        
        if (!error && data) {
          setIsPublished(!!data.published);
        }
      };
      
      fetchPublishStatus();
    } else {
      setIsPublished(false);
    }
  }, [documentId, sourceId]);

  return {
    title,
    setTitle,
    content,
    setContent,
    templateId,
    setTemplateId,
    isDirty,
    setIsDirty,
    lastSavedTitle,
    setLastSavedTitle,
    lastSavedContent,
    setLastSavedContent,
    isPublished,
    setIsPublished
  };
};
