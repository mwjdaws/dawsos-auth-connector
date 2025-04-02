
import { useState } from 'react';
import { fetchKnowledgeTemplateById } from '@/services/api/templates/knowledgeTemplateFetchers';
import { toast } from '@/hooks/use-toast';

interface UseTemplateHandlingProps {
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setTemplateId?: (id: string | null) => void;
  setIsDirty: (isDirty: boolean) => void;
}

export const useTemplateHandling = ({
  setTitle,
  setContent,
  setTemplateId,
  setIsDirty
}: UseTemplateHandlingProps) => {
  const [templateId, setLocalTemplateId] = useState<string | null>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);

  /**
   * Handles changing the template
   * @param value Template ID or 'none'
   */
  const handleTemplateChange = async (value: string) => {
    if (value === 'none') {
      if (setTemplateId) {
        setTemplateId(null);
      }
      setLocalTemplateId(null);
      return;
    }

    setIsLoadingTemplate(true);
    try {
      const template = await fetchKnowledgeTemplateById(value);
      
      if (setTemplateId) {
        setTemplateId(template.id);
      }
      setLocalTemplateId(template.id);
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
    templateId: templateId,
    setTemplateId: setLocalTemplateId,
    isLoadingTemplate,
    handleTemplateChange
  };
};
