
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { fetchKnowledgeTemplateById } from '@/services/api/templates/knowledgeTemplateFetchers';
import { createKnowledgeSourceVersion } from '@/services/api/knowledgeSourceVersions';
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
  const [templateId, setTemplateId] = useState<string | null>(initialTemplateId);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedTitle, setLastSavedTitle] = useState(initialTitle);
  const [lastSavedContent, setLastSavedContent] = useState(initialContent);
  const { user } = useAuth();
  
  // Track if component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);

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

  // Autosave effect
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (isDirty && !isSaving && !isPublishing && documentId && isMounted.current) {
        console.log('Auto-saving document...');
        handleSaveDraft(true);
      }
    }, 15000); // 15 seconds

    // Cleanup on unmount
    return () => {
      isMounted.current = false;
      clearInterval(autoSaveInterval);
    };
  }, [isDirty, isSaving, isPublishing, documentId, title, content]);

  const handleSaveDraft = async (isAutoSave = false) => {
    if (!title.trim()) {
      if (!isAutoSave) {
        toast({
          title: "Title Required",
          description: "Please enter a title before saving",
          variant: "destructive",
        });
      }
      return;
    }

    setIsSaving(true);
    try {
      const knowledgeData = {
        title,
        content,
        template_id: templateId,
        user_id: user?.id,
      };

      let savedDocumentId = documentId;
      let response;

      if (documentId) {
        // Before updating the document, create a version of the current content
        try {
          // Fetch the current content to save as a version
          const { data: currentDocument, error: fetchError } = await supabase
            .from('knowledge_sources')
            .select('content')
            .eq('id', documentId)
            .single();
          
          if (fetchError) {
            console.error('Error fetching current document content:', fetchError);
          } else if (currentDocument) {
            // Create a version record
            await createKnowledgeSourceVersion({
              source_id: documentId,
              version_number: 1, // The API will determine the correct version number
              content: currentDocument.content,
              metadata: { saved_from: isAutoSave ? "auto_save" : "manual_save" }
            });
          }
        } catch (versionError) {
          console.error('Error creating version:', versionError);
          // Continue with update even if versioning fails
        }

        // Update existing document
        response = await supabase
          .from('knowledge_sources')
          .update(knowledgeData)
          .eq('id', documentId)
          .select()
          .single();
      } else {
        // Create new document
        response = await supabase
          .from('knowledge_sources')
          .insert(knowledgeData)
          .select()
          .single();
      }

      if (response.error) {
        throw response.error;
      }

      savedDocumentId = response.data.id;

      if (onSaveDraft) {
        onSaveDraft(savedDocumentId, title, content, templateId);
      }

      // Update last saved state
      setLastSavedTitle(title);
      setLastSavedContent(content);
      setIsDirty(false);

      if (!isAutoSave) {
        toast({
          title: "Draft Saved",
          description: documentId ? "Your draft has been updated and previous version saved" : "Your draft has been saved successfully",
        });
      }

      return savedDocumentId;
    } catch (error) {
      console.error('Error saving draft:', error);
      if (!isAutoSave) {
        toast({
          title: "Error Saving Draft",
          description: "There was an error saving your draft. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title before publishing",
        variant: "destructive",
      });
      return;
    }

    setIsPublishing(true);
    try {
      // First save the draft to ensure we have the latest content
      const savedId = await handleSaveDraft();
      
      if (savedId && onPublish) {
        onPublish(savedId, title, content, templateId);
      }
      
      toast({
        title: "Content Published",
        description: "Your content has been published successfully",
      });
    } catch (error) {
      console.error('Error publishing content:', error);
      toast({
        title: "Error Publishing",
        description: "There was an error publishing your content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleTemplateChange = async (value: string) => {
    if (value === 'none') {
      setTemplateId(null);
      return;
    }

    setIsLoadingTemplate(true);
    try {
      const template = await fetchKnowledgeTemplateById(value);
      setTemplateId(template.id);
      setTitle(template.name);
      setContent(template.content);
      
      // Mark as dirty to trigger autosave
      setIsDirty(true);
      
      toast({
        title: "Template Loaded",
        description: `Template "${template.name}" has been loaded successfully`,
      });
    } catch (error) {
      console.error('Failed to load template:', error);
      toast({
        title: "Error Loading Template",
        description: "Failed to load the selected template",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTemplate(false);
    }
  };

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
    handleSaveDraft,
    handlePublish,
    handleTemplateChange
  };
};
