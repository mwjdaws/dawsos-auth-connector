
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseContentStateProps {
  initialTitle: string;
  initialContent: string;
  initialTemplateId: string | null;
  initialExternalSourceUrl?: string;
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
  initialExternalSourceUrl = '',
  sourceId,
  documentId
}: UseContentStateProps) => {
  // Basic state
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [templateId, setTemplateId] = useState<string | null>(initialTemplateId);
  const [externalSourceUrl, setExternalSourceUrl] = useState(initialExternalSourceUrl);
  
  // State tracking
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedTitle, setLastSavedTitle] = useState(initialTitle);
  const [lastSavedContent, setLastSavedContent] = useState(initialContent);
  const [lastSavedExternalSourceUrl, setLastSavedExternalSourceUrl] = useState(initialExternalSourceUrl);
  const [isPublished, setIsPublished] = useState(false);

  // Update state if props change (e.g., when loading a saved draft)
  useEffect(() => {
    if (!sourceId) { // Don't override fetched content with initialValues
      setTitle(initialTitle);
      setContent(initialContent);
      setTemplateId(initialTemplateId);
      setExternalSourceUrl(initialExternalSourceUrl);
      setLastSavedTitle(initialTitle);
      setLastSavedContent(initialContent);
      setLastSavedExternalSourceUrl(initialExternalSourceUrl);
      setIsDirty(false);
    }
  }, [initialTitle, initialContent, initialTemplateId, initialExternalSourceUrl, sourceId]);

  // Track changes to mark document as dirty when content changes
  useEffect(() => {
    if (title !== lastSavedTitle || 
        content !== lastSavedContent || 
        externalSourceUrl !== lastSavedExternalSourceUrl) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  }, [title, content, externalSourceUrl, lastSavedTitle, lastSavedContent, lastSavedExternalSourceUrl]);

  // Fetch published status when document loads
  useEffect(() => {
    const documentToCheck = documentId || sourceId;
    if (documentToCheck) {
      const fetchPublishStatus = async () => {
        const { data, error } = await supabase
          .from('knowledge_sources')
          .select('published, external_source_url')
          .eq('id', documentToCheck)
          .single();
        
        if (!error && data) {
          setIsPublished(!!data.published);
          if (data.external_source_url) {
            setExternalSourceUrl(data.external_source_url);
            setLastSavedExternalSourceUrl(data.external_source_url);
          }
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
    externalSourceUrl,
    setExternalSourceUrl,
    isDirty,
    setIsDirty,
    lastSavedTitle,
    setLastSavedTitle,
    lastSavedContent,
    setLastSavedContent,
    lastSavedExternalSourceUrl,
    setLastSavedExternalSourceUrl,
    isPublished,
    setIsPublished
  };
};
