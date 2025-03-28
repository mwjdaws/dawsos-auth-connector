import { useState, useEffect } from 'react';
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
  const { user } = useAuth();
  
  // Update state if props change (e.g., when loading a saved draft)
  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
    setTemplateId(initialTemplateId);
  }, [initialTitle, initialContent, initialTemplateId]);

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title before saving",
        variant: "destructive",
      });
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
              metadata: { saved_from: "editor" }
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

      toast({
        title: "Draft Saved",
        description: documentId ? "Your draft has been updated and previous version saved" : "Your draft has been saved successfully",
      });

      return savedDocumentId;
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Error Saving Draft",
        description: "There was an error saving your draft. Please try again.",
        variant: "destructive",
      });
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
    handleSaveDraft,
    handlePublish,
    handleTemplateChange
  };
};
