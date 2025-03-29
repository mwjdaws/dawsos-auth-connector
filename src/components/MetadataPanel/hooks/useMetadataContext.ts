
import { useMetadataPanel } from './useMetadataPanel';
import { OntologyTerm } from '@/hooks/markdown-editor/ontology-terms/types';

export interface MetadataContext {
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
 * Hook that provides metadata context values
 */
export function useMetadataContext(): MetadataContext {
  const {
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
  } = useMetadataPanel();

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
