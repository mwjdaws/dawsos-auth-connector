
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentOperations } from './useDocumentOperations';
import { useTemplateHandling } from './useTemplateHandling';
import { useAutosave } from './useAutosave';
import { supabase } from '@/integrations/supabase/client';

interface UseMarkdownEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialTemplateId?: string | null;
  documentId?: string;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null) => void;
}

export const useMarkdownEditor = ({
  initialTitle = '',
  initialContent = '',
  initialTemplateId = null,
  documentId,
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
    documentId,
    onSaveDraft,
    onPublish
  });

  // Update state if props change (e.g., when loading a saved draft)
  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
    setTemplateId(initialTemplateId);
    setLastSavedTitle(initialTitle);
    setLastSavedContent(initialContent);
    setIsDirty(false);
  }, [initialTitle, initialContent, initialTemplateId]);

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
    if (documentId) {
      const fetchPublishStatus = async () => {
        const { data, error } = await supabase
          .from('knowledge_sources')
          .select('published')
          .eq('id', documentId)
          .single();
        
        if (!error && data) {
          setIsPublished(!!data.published);
        }
      };
      
      fetchPublishStatus();
    } else {
      setIsPublished(false);
    }
  }, [documentId]);

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
    documentId,
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
    handleSaveDraft,
    handlePublish,
    handleTemplateChange
  };
};
