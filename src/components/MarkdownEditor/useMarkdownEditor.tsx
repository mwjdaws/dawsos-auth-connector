
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { fetchKnowledgeTemplateById } from '@/services/api/templates/knowledgeTemplateFetchers';
import { supabase } from '@/integrations/supabase/client';

interface UseMarkdownEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialTemplateId?: string | null;
  initialExternalSourceUrl?: string;
  documentId?: string | null;
  sourceId?: string | null;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
}

export const useMarkdownEditor = ({
  initialTitle = '',
  initialContent = '',
  initialTemplateId = null,
  initialExternalSourceUrl = '',
  documentId = null,
  sourceId = null,
  onSaveDraft,
  onPublish
}: UseMarkdownEditorProps) => {
  // State management
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [templateId, setTemplateId] = useState<string | null>(initialTemplateId);
  const [externalSourceUrl, setExternalSourceUrl] = useState(initialExternalSourceUrl);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const { user } = useAuth();
  
  // Update state if props change (e.g., when loading a saved draft)
  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
    setTemplateId(initialTemplateId);
    setExternalSourceUrl(initialExternalSourceUrl);
  }, [initialTitle, initialContent, initialTemplateId, initialExternalSourceUrl]);

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title before saving",
        variant: "destructive",
      });
      return null;
    }

    setIsSaving(true);
    try {
      const knowledgeData = {
        title,
        content,
        template_id: templateId,
        external_source_url: externalSourceUrl,
        user_id: user?.id || null
      };

      let savedDocumentId = documentId;
      let response;

      if (documentId) {
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
        onSaveDraft(savedDocumentId, title, content, templateId, externalSourceUrl);
      }

      toast({
        title: "Draft Saved",
        description: "Your draft has been saved successfully",
      });

      return savedDocumentId;
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Error Saving Draft",
        description: "There was an error saving your draft. Please try again.",
        variant: "destructive",
      });
      return null;
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
        onPublish(savedId, title, content, templateId, externalSourceUrl);
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
    setTemplateId,
    externalSourceUrl,
    setExternalSourceUrl,
    isLoadingTemplate,
    isSaving,
    isPublishing,
    isDirty: true, // For now hardcoded, can be implemented properly later
    isPublished: false, // For now hardcoded, can be implemented properly later
    isLoading: false, // For now hardcoded, can be implemented properly later
    handleSaveDraft,
    handlePublish,
    handleTemplateChange
  };
};
