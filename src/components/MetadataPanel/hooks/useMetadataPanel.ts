import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OntologyTerm } from '@/hooks/markdown-editor/ontology-terms/types';

export interface MetadataPanelState {
  contentId: string;
  title: string;
  tags: string[];
  domains: string[];
  externalSource?: string;
  ontologyTerms: OntologyTerm[];
  loading: boolean;
  error: Error | null;
  setTags: (tags: string[]) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  refreshTags: () => void;
}

/**
 * Hook that manages metadata panel state
 */
export function useMetadataPanel(): MetadataPanelState {
  const [contentId, setContentId] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [domains, setDomains] = useState<string[]>([]);
  const [externalSource, setExternalSource] = useState<string | undefined>();
  const [ontologyTerms, setOntologyTerms] = useState<OntologyTerm[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load content metadata
  useEffect(() => {
    // Implementation would go here
  }, [contentId]);

  // Function to add a tag
  const addTag = useCallback((tag: string) => {
    if (!tags.includes(tag)) {
      setTags(prevTags => [...prevTags, tag]);
    }
  }, [tags]);

  // Function to remove a tag
  const removeTag = useCallback((tag: string) => {
    setTags(prevTags => prevTags.filter(t => t !== tag));
  }, []);

  // Function to refresh tags
  const refreshTags = useCallback(() => {
    // Implementation would go here
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [contentId]);

  return {
    contentId,
    title,
    tags,
    domains,
    externalSource,
    ontologyTerms,
    loading,
    error,
    setTags,
    addTag,
    removeTag,
    refreshTags
  };
}
