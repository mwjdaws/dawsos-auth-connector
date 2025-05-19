import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface KnowledgeSourceInfo {
  id: string;
  title: string;
}

export function useKnowledgeSourceQuery(sourceId?: string) {
  return useQuery({
    queryKey: ['knowledgeSource', sourceId],
    async queryFn() {
      if (!sourceId) return null;
      const { data, error } = await supabase
        .from('knowledge_sources')
        .select('id, title')
        .eq('id', sourceId)
        .single();
      if (error) throw error;
      return data as KnowledgeSourceInfo;
    },
    enabled: !!sourceId,
  });
}
