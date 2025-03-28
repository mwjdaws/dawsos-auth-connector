
import { useState, useEffect } from 'react';
import { fetchKnowledgeTemplates } from '@/services/api/templates/knowledgeTemplateFetchers';
import { KnowledgeTemplate } from '@/services/api/types';

export function useTemplates() {
  const [templates, setTemplates] = useState<KnowledgeTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setIsLoading(true);
        const response = await fetchKnowledgeTemplates();
        setTemplates(response.data);
      } catch (err) {
        console.error('Error loading templates:', err);
        setError(err instanceof Error ? err : new Error('Failed to load templates'));
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, []);

  return { templates, isLoading, error };
}
