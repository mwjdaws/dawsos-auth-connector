
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentOperations } from './useDocumentOperations';
import { useTemplateHandling } from './useTemplateHandling';
import { useAutosave } from './useAutosave';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UseMarkdownEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialTemplateId?: string | null;
  documentId?: string;
  sourceId?: string; // New prop for loading existing content
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null) => void;
}

export const useMarkdownEditor = ({
  initialTitle = '',
  initialContent = '',
  initialTemplateId = null,
  documentId,
  sourceId, // Accept sourceId parameter
  onSaveDraft,
  onPublish
}: UseMarkdownEditorProps) => {
  // State management
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedTitle, setLastSavedTitle] = useState(initialTitle);
  const [lastSavedContent, setLastSavedContent] = useState(initialContent);
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(!!sourceId); // Set loading state if we need to fetch content
  const { user } = useAuth();
  
  // Use our utility hooks
  const {
    templateId,
    setTemplateId,
    isLoadingTemplate,
    handleTemplateChange
  } = useTemplateHandling(setTitle, setContent, setIsDirty);

  const {
    isSaving,
    isPublishing,
    saveDraft,
    publishDocument
  } = useDocumentOperations({
    documentId: documentId || sourceId, // Use sourceId as documentId if provided
    onSaveDraft,
    onPublish
  });

  // Load existing content if sourceId is provided
  useEffect(() => {
    const fetchExistingContent = async () => {
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
            setTitle(data.title);
            setContent(data.content);
            setTemplateId(data.template_id);
            setLastSavedTitle(data.title);
            setLastSavedContent(data.content);
            setIsPublished(!!data.published);
            setIsDirty(false);
          }
        } catch (error) {
          console.error('Error loading existing content:', error);
          toast({
            title: "Error Loading Content",
            description: "There was an error loading the existing content. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchExistingContent();
  }, [sourceId]);

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

  // Handle save draft wrapper
  const handleSaveDraft = async (isAutoSave = false) => {
    const result = await saveDraft(title, content, templateId, user?.id, isAutoSave);
    if (result) {
      // Update last saved state
      setLastSavedTitle(title);
      setLastSavedContent(content);
      setIsDirty(false);
    }
    return result;
  };

  // Handle publish wrapper
  const handlePublish = async () => {
    await publishDocument(title, content, templateId, user?.id);
    setIsPublished(true);
  };

  // Set up autosave
  useAutosave({
    isDirty,
    isSaving,
    isPublishing,
    documentId: documentId || sourceId, // Use sourceId if documentId is not provided
    onSave: () => handleSaveDraft(true)
  });

  return {
    title,
    setTitle,
    content,
    setContent,
    templateId,
    isLoadingTemplate,
    isSaving,
    isPublishing,
    isDirty,
    isPublished,
    isLoading, // Export loading state
    handleSaveDraft,
    handlePublish,
    handleTemplateChange
  };
};
