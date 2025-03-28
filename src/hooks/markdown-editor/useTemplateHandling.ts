
import { useState } from 'react';
import { fetchKnowledgeTemplateById } from '@/services/api/templates/knowledgeTemplateFetchers';
import { toast } from '@/hooks/use-toast';

export const useTemplateHandling = (
  setTitle: (title: string) => void,
  setContent: (content: string) => void,
  setIsDirty: (isDirty: boolean) => void
) => {
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);

  /**
   * Handles changing the template
   * @param value Template ID or 'none'
   */
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
    templateId,
    setTemplateId,
    isLoadingTemplate,
    handleTemplateChange
  };
};
