
import { useState } from 'react';
import { KnowledgeSource } from '@/services/api/types';
import { toast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

// Add a separate hook for fetching knowledge sources
export function useKnowledgeSourcesQuery(searchTerm: string = '') {
  return useQuery({
    queryKey: ['knowledgeSources', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('knowledge_sources')
        .select('*')
        .order('title');
      
      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return data || [];
    }
  });
}
