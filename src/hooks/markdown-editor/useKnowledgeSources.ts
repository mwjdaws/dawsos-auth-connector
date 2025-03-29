
import { useState } from 'react';
import { KnowledgeSource } from '@/services/api/types';
import { toast } from '@/hooks/use-toast';

export function useKnowledgeSources() {
  const [isSourceBrowserOpen, setIsSourceBrowserOpen] = useState(false);
  
  const openSourceBrowser = () => {
    setIsSourceBrowserOpen(true);
  };
  
  const closeSourceBrowser = () => {
    setIsSourceBrowserOpen(false);
  };
  
  const handleSourceSelection = (
    source: KnowledgeSource,
    setTitle: (title: string) => void,
    setContent: (content: string) => void,
    setTemplateId: (templateId: string | null) => void,
    setExternalSourceUrl: (url: string) => void
  ) => {
    setTitle(source.title || '');
    setContent(source.content || '');
    setTemplateId(source.template_id || null);
    setExternalSourceUrl(source.external_source_url || '');
    
    toast({
      title: "Knowledge Source Loaded",
      description: `"${source.title}" has been loaded into the editor.`,
    });
    
    closeSourceBrowser();
  };
  
  return {
    isSourceBrowserOpen,
    openSourceBrowser,
    closeSourceBrowser,
    handleSourceSelection
  };
}
